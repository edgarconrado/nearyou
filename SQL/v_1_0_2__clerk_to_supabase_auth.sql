-- ============================================================================
-- v_1_0_2 — Migración de Clerk a Supabase Auth
-- ============================================================================
-- Punto de partida real de la base (jul 2026):
--   · auth.users está vacía
--   · profiles tiene 19 filas y profiles.id es TEXT con IDs de Clerk
--     (user_2xxxxx...), igual que todas las columnas user_id
--
-- Estrategia: NO se borra nada. Cuando un usuario entra por primera vez con
-- Google o Apple, Supabase crea su fila en auth.users; un trigger busca su
-- perfil por email y le reasigna el id nuevo. Las tablas hijas se actualizan
-- solas porque antes convertimos sus llaves foráneas a ON UPDATE CASCADE.
--
-- Ejecutar completo en el SQL Editor de Supabase. Es idempotente.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Conservar el id viejo de Clerk (auditoría y rollback)
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS legacy_clerk_id TEXT;

UPDATE public.profiles
   SET legacy_clerk_id = id
 WHERE legacy_clerk_id IS NULL
   AND id LIKE 'user_%';

CREATE INDEX IF NOT EXISTS idx_profiles_legacy_clerk_id
  ON public.profiles (legacy_clerk_id);

-- El email es la llave con la que reconocemos al usuario entre los dos mundos.
CREATE UNIQUE INDEX IF NOT EXISTS uq_profiles_email
  ON public.profiles (lower(email));


-- ----------------------------------------------------------------------------
-- 2. Convertir a ON UPDATE CASCADE todas las FK que apuntan a profiles(id)
-- ----------------------------------------------------------------------------
-- Así, al cambiar profiles.id, reviews / favorites / visits / notifications /
-- user_settings / messages / reported_content se actualizan automáticamente.
DO $$
DECLARE
  fk RECORD;
  cols TEXT;
BEGIN
  FOR fk IN
    SELECT c.conname,
           c.conrelid::regclass AS child_table,
           pg_get_constraintdef(c.oid) AS def
      FROM pg_constraint c
     WHERE c.contype = 'f'
       AND c.confrelid = 'public.profiles'::regclass
  LOOP
    -- Si ya tiene ON UPDATE CASCADE, no tocar
    CONTINUE WHEN fk.def ILIKE '%ON UPDATE CASCADE%';

    SELECT string_agg(quote_ident(a.attname), ', ' ORDER BY x.ord)
      INTO cols
      FROM pg_constraint c
      CROSS JOIN LATERAL unnest(c.conkey) WITH ORDINALITY AS x(attnum, ord)
      JOIN pg_attribute a
        ON a.attrelid = c.conrelid AND a.attnum = x.attnum
     WHERE c.conname = fk.conname
       AND c.conrelid = fk.child_table::regclass;

    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', fk.child_table, fk.conname);
    EXECUTE format(
      'ALTER TABLE %s ADD CONSTRAINT %I FOREIGN KEY (%s)
         REFERENCES public.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE',
      fk.child_table, fk.conname, cols
    );

    RAISE NOTICE 'FK % en % ahora es ON UPDATE CASCADE', fk.conname, fk.child_table;
  END LOOP;
END $$;


-- ----------------------------------------------------------------------------
-- 3. Trigger: enlazar o crear el perfil al nacer el usuario en auth.users
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  legacy_id TEXT;
  meta_name TEXT;
  meta_avatar TEXT;
BEGIN
  meta_name   := COALESCE(
                   NEW.raw_user_meta_data ->> 'full_name',
                   NEW.raw_user_meta_data ->> 'name',
                   ''
                 );
  meta_avatar := COALESCE(
                   NEW.raw_user_meta_data ->> 'avatar_url',
                   NEW.raw_user_meta_data ->> 'picture'
                 );

  -- ¿Ya existía como usuario de Clerk? Lo reconocemos por el email.
  SELECT id INTO legacy_id
    FROM public.profiles
   WHERE lower(email) = lower(NEW.email)
   LIMIT 1;

  IF legacy_id IS NOT NULL THEN
    -- Reasignar el id: las tablas hijas viajan solas por ON UPDATE CASCADE
    UPDATE public.profiles
       SET id          = NEW.id::text,
           full_name   = COALESCE(NULLIF(full_name, ''), meta_name),
           avatar_url  = COALESCE(avatar_url, meta_avatar),
           is_verified = TRUE,
           updated_at  = NOW()
     WHERE id = legacy_id;
  ELSE
    INSERT INTO public.profiles (id, email, full_name, avatar_url, is_active, is_verified)
    VALUES (NEW.id::text, NEW.email, meta_name, meta_avatar, TRUE, TRUE)
    ON CONFLICT (id) DO NOTHING;
  END IF;

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id::text)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ----------------------------------------------------------------------------
-- 4. RLS con auth.uid()
-- ----------------------------------------------------------------------------
-- Las políticas viejas comparaban contra el 'sub' del JWT de Clerk.
-- Ahora la identidad la da auth.uid(), que es UUID: se castea a texto porque
-- las columnas siguen siendo TEXT hasta la fase 2.
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT schemaname, tablename, policyname
      FROM pg_policies
     WHERE schemaname = 'public'
       AND tablename IN ('profiles', 'reviews', 'favorites', 'visits',
                         'notifications', 'user_settings', 'messages',
                         'reported_content')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
                   pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings    ENABLE ROW LEVEL SECURITY;

-- profiles: todos pueden leer perfiles activos; cada quien edita el suyo
CREATE POLICY "profiles_select_public" ON public.profiles
  FOR SELECT USING (is_active IS NOT FALSE);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid())::text = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid())::text = id)
  WITH CHECK ((SELECT auth.uid())::text = id);

-- reviews: lectura pública, escritura solo del autor
CREATE POLICY "reviews_select_public" ON public.reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "reviews_insert_own" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid())::text = user_id);

CREATE POLICY "reviews_update_own" ON public.reviews
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid())::text = user_id);

CREATE POLICY "reviews_delete_own" ON public.reviews
  FOR DELETE TO authenticated
  USING ((SELECT auth.uid())::text = user_id);

-- favorites / visits / notifications / user_settings: privadas del dueño
CREATE POLICY "favorites_all_own" ON public.favorites
  FOR ALL TO authenticated
  USING ((SELECT auth.uid())::text = user_id)
  WITH CHECK ((SELECT auth.uid())::text = user_id);

CREATE POLICY "visits_all_own" ON public.visits
  FOR ALL TO authenticated
  USING ((SELECT auth.uid())::text = user_id)
  WITH CHECK ((SELECT auth.uid())::text = user_id);

CREATE POLICY "notifications_all_own" ON public.notifications
  FOR ALL TO authenticated
  USING ((SELECT auth.uid())::text = user_id)
  WITH CHECK ((SELECT auth.uid())::text = user_id);

CREATE POLICY "user_settings_all_own" ON public.user_settings
  FOR ALL TO authenticated
  USING ((SELECT auth.uid())::text = user_id)
  WITH CHECK ((SELECT auth.uid())::text = user_id);


-- ----------------------------------------------------------------------------
-- 5. Storage: bucket de avatares
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "avatars_read_public"  ON storage.objects;
DROP POLICY IF EXISTS "avatars_write_own"    ON storage.objects;
DROP POLICY IF EXISTS "avatars_update_own"   ON storage.objects;
DROP POLICY IF EXISTS "avatars_delete_own"   ON storage.objects;

CREATE POLICY "avatars_read_public" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- El nombre del archivo empieza con el id del usuario: <uid>_<timestamp>.<ext>
CREATE POLICY "avatars_write_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.filename(name)) LIKE ((SELECT auth.uid())::text || '_%')
  );

CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.filename(name)) LIKE ((SELECT auth.uid())::text || '_%')
  );

CREATE POLICY "avatars_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.filename(name)) LIKE ((SELECT auth.uid())::text || '_%')
  );


-- ----------------------------------------------------------------------------
-- 6. Verificación
-- ----------------------------------------------------------------------------
-- Cuántos perfiles siguen con id de Clerk (o sea, sin migrar):
--
--   SELECT count(*) FILTER (WHERE id LIKE 'user_%') AS pendientes,
--          count(*) FILTER (WHERE id NOT LIKE 'user_%') AS migrados
--     FROM public.profiles;
--
-- Perfiles huérfanos (id que ya no es de Clerk pero no existe en auth.users):
--
--   SELECT p.id, p.email
--     FROM public.profiles p
--    WHERE p.id NOT LIKE 'user_%'
--      AND NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id::text = p.id);


-- ============================================================================
-- FASE 2 — ejecutar solo cuando `pendientes` sea 0
-- ============================================================================
-- Convierte las columnas a UUID de verdad y ata profiles a auth.users.
-- Hasta entonces las políticas de arriba (con ::text) funcionan bien.
--
-- BEGIN;
--   ALTER TABLE public.reviews          ALTER COLUMN user_id     TYPE UUID USING user_id::uuid;
--   ALTER TABLE public.favorites        ALTER COLUMN user_id     TYPE UUID USING user_id::uuid;
--   ALTER TABLE public.visits           ALTER COLUMN user_id     TYPE UUID USING user_id::uuid;
--   ALTER TABLE public.notifications    ALTER COLUMN user_id     TYPE UUID USING user_id::uuid;
--   ALTER TABLE public.user_settings    ALTER COLUMN user_id     TYPE UUID USING user_id::uuid;
--   ALTER TABLE public.messages         ALTER COLUMN sender_id   TYPE UUID USING sender_id::uuid;
--   ALTER TABLE public.messages         ALTER COLUMN receiver_id TYPE UUID USING receiver_id::uuid;
--   ALTER TABLE public.reported_content ALTER COLUMN reporter_id TYPE UUID USING reporter_id::uuid;
--   ALTER TABLE public.profiles         ALTER COLUMN id          TYPE UUID USING id::uuid;
--
--   ALTER TABLE public.profiles
--     ADD CONSTRAINT profiles_id_fkey
--     FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
-- COMMIT;
--
-- Después reemplaza en las políticas `(SELECT auth.uid())::text` por
-- `(SELECT auth.uid())` y vuelve a generar los tipos:
--   npm run gen-types
-- ============================================================================
