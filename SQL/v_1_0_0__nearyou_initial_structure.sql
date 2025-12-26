-- ============================================
-- NEARYOU - ESQUEMA DE BASE DE DATOS SUPABASE
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Para funcionalidades de geolocalización

-- ============================================
-- TABLA: profiles (Perfiles de Usuario)
-- ============================================
-- Extiende la tabla auth.users de Supabase
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    location TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'México',
    bio TEXT,
    member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_location ON profiles(location);

-- ============================================
-- TABLA: zones (Zonas Turísticas)
-- ============================================
CREATE TABLE zones (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'México',
    image_url TEXT,
    cover_image_url TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para zones
CREATE INDEX idx_zones_slug ON zones(slug);
CREATE INDEX idx_zones_state ON zones(state);
CREATE INDEX idx_zones_location ON zones USING gist(geography(ST_MakePoint(longitude, latitude)));

-- ============================================
-- TABLA: categories (Categorías de Negocios)
-- ============================================
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT, -- Nombre del ícono de Ionicons
    color TEXT, -- Color hex para el chip
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar categorías predeterminadas
INSERT INTO categories (name, slug, icon, color) VALUES
    ('Todos', 'todos', 'apps-outline', '#003D7A'),
    ('Restaurante', 'restaurante', 'restaurant-outline', '#FF9800'),
    ('Hotel', 'hotel', 'bed-outline', '#2196F3'),
    ('Tienda', 'tienda', 'bag-handle-outline', '#9C27B0'),
    ('Atracción', 'atraccion', 'location-outline', '#4CAF50'),
    ('Taller', 'taller', 'hammer-outline', '#FF5722'),
    ('Comercio', 'comercio', 'storefront-outline', '#607D8B'),
    ('Servicios', 'servicios', 'sparkles-outline', '#E91E63');

-- ============================================
-- TABLA: businesses (Negocios)
-- ============================================
CREATE TABLE businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    zone_id UUID REFERENCES zones(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    
    -- Ubicación
    address TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Contacto
    phone TEXT,
    email TEXT,
    website TEXT,
    
    -- Información adicional
    price_range TEXT, -- '$', '$$', '$$$', '$$$$'
    is_open BOOLEAN DEFAULT TRUE,
    
    -- Características (array de texto)
    features TEXT[], -- ['WiFi', 'Estacionamiento', 'Terraza', etc.]
    
    -- Estadísticas
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_visits INTEGER DEFAULT 0,
    
    -- Galería de imágenes
    main_image_url TEXT,
    gallery_urls TEXT[], -- Array de URLs de imágenes
    
    -- Estado
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para businesses
CREATE INDEX idx_businesses_zone ON businesses(zone_id);
CREATE INDEX idx_businesses_category ON businesses(category_id);
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_name ON businesses(name);
CREATE INDEX idx_businesses_rating ON businesses(average_rating DESC);
CREATE INDEX idx_businesses_location ON businesses USING gist(geography(ST_MakePoint(longitude, latitude)));

-- ============================================
-- TABLA: business_hours (Horarios de Negocios)
-- ============================================
CREATE TABLE business_hours (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0=Domingo, 1=Lunes, ..., 6=Sábado
    opens_at TIME,
    closes_at TIME,
    is_closed BOOLEAN DEFAULT FALSE, -- Si está cerrado todo el día
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para business_hours
CREATE INDEX idx_business_hours_business ON business_hours(business_id);

-- ============================================
-- TABLA: reviews (Reseñas/Opiniones)
-- ============================================
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    image_urls TEXT[], -- Array de URLs de fotos
    
    -- Métricas
    helpful_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    
    -- Estado
    is_edited BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint: Un usuario solo puede tener una reseña por negocio
    UNIQUE(business_id, user_id)
);

-- Índices para reviews
CREATE INDEX idx_reviews_business ON reviews(business_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

-- ============================================
-- TABLA: favorites (Favoritos)
-- ============================================
CREATE TABLE favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Un usuario no puede marcar el mismo negocio dos veces
    UNIQUE(user_id, business_id)
);

-- Índices para favorites
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_business ON favorites(business_id);

-- ============================================
-- TABLA: visits (Visitas a Negocios)
-- ============================================
CREATE TABLE visits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    visit_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para visits
CREATE INDEX idx_visits_user ON visits(user_id);
CREATE INDEX idx_visits_business ON visits(business_id);
CREATE INDEX idx_visits_date ON visits(visit_date DESC);

-- ============================================
-- TABLA: offers (Ofertas Destacadas)
-- ============================================
CREATE TABLE offers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    discount_percentage INTEGER, -- Ej: 50 para 50%
    discount_text TEXT, -- Ej: "2x1", "50% OFF"
    image_url TEXT,
    terms_and_conditions TEXT,
    
    -- Validez
    valid_from DATE,
    valid_until DATE,
    
    -- Estado
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para offers
CREATE INDEX idx_offers_business ON offers(business_id);
CREATE INDEX idx_offers_valid_until ON offers(valid_until);
CREATE INDEX idx_offers_active ON offers(is_active) WHERE is_active = TRUE;

-- ============================================
-- TABLA: notifications (Notificaciones)
-- ============================================
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'new_place', 'offer', 'review_response', 'message', 'update'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Datos adicionales en formato JSON
    
    -- Estado
    is_read BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Índices para notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- TABLA: user_settings (Configuración de Usuario)
-- ============================================
CREATE TABLE user_settings (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
    
    -- Notificaciones
    push_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    notify_new_places BOOLEAN DEFAULT TRUE,
    notify_offers BOOLEAN DEFAULT TRUE,
    notify_reviews BOOLEAN DEFAULT TRUE,
    notify_messages BOOLEAN DEFAULT FALSE,
    notify_updates BOOLEAN DEFAULT TRUE,
    
    -- Privacidad
    profile_public BOOLEAN DEFAULT TRUE,
    show_email BOOLEAN DEFAULT FALSE,
    show_phone BOOLEAN DEFAULT FALSE,
    allow_messages BOOLEAN DEFAULT TRUE,
    share_location BOOLEAN DEFAULT TRUE,
    show_activity BOOLEAN DEFAULT TRUE,
    
    -- Preferencias
    language TEXT DEFAULT 'es',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: messages (Mensajes entre Usuarios) - FUTURO
-- ============================================
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para messages
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read) WHERE is_read = FALSE;

-- ============================================
-- TABLA: reported_content (Contenido Reportado)
-- ============================================
CREATE TABLE reported_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL, -- 'review', 'business', 'user'
    content_id UUID NOT NULL,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'dismissed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Índices para reported_content
CREATE INDEX idx_reported_status ON reported_content(status);
CREATE INDEX idx_reported_type ON reported_content(content_type);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar el campo updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a tablas relevantes
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON zones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Función para crear perfil automáticamente al registrarse
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    
    -- Crear configuración por defecto
    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil al registrar usuario
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Función para actualizar estadísticas de negocios
-- ============================================
CREATE OR REPLACE FUNCTION update_business_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar promedio de rating y total de reviews
    UPDATE businesses
    SET 
        average_rating = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM reviews
            WHERE business_id = NEW.business_id
            AND is_visible = TRUE
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE business_id = NEW.business_id
            AND is_visible = TRUE
        )
    WHERE id = NEW.business_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar stats cuando se inserta/actualiza/elimina una review
CREATE TRIGGER update_business_stats_on_review_insert
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_business_stats();

CREATE TRIGGER update_business_stats_on_review_update
    AFTER UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_business_stats();

CREATE TRIGGER update_business_stats_on_review_delete
    AFTER DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_business_stats();

-- ============================================
-- POLÍTICAS DE SEGURIDAD (RLS - Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reported_content ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS PARA PROFILES
-- ============================================

-- Usuarios pueden ver todos los perfiles públicos
CREATE POLICY "Profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (TRUE);

-- Usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================
-- POLÍTICAS PARA ZONES
-- ============================================

-- Zonas son visibles para todos
CREATE POLICY "Zones are viewable by everyone"
    ON zones FOR SELECT
    USING (is_active = TRUE);

-- ============================================
-- POLÍTICAS PARA CATEGORIES
-- ============================================

-- Categorías son visibles para todos
CREATE POLICY "Categories are viewable by everyone"
    ON categories FOR SELECT
    USING (is_active = TRUE);

-- ============================================
-- POLÍTICAS PARA BUSINESSES
-- ============================================

-- Negocios son visibles para todos
CREATE POLICY "Businesses are viewable by everyone"
    ON businesses FOR SELECT
    USING (is_active = TRUE);

-- ============================================
-- POLÍTICAS PARA BUSINESS_HOURS
-- ============================================

-- Horarios son visibles para todos
CREATE POLICY "Business hours are viewable by everyone"
    ON business_hours FOR SELECT
    USING (TRUE);

-- ============================================
-- POLÍTICAS PARA REVIEWS
-- ============================================

-- Reviews visibles son públicas
CREATE POLICY "Reviews are viewable by everyone"
    ON reviews FOR SELECT
    USING (is_visible = TRUE);

-- Usuarios autenticados pueden crear reviews
CREATE POLICY "Authenticated users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden actualizar sus propias reviews
CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (auth.uid() = user_id);

-- Usuarios pueden eliminar sus propias reviews
CREATE POLICY "Users can delete own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS PARA FAVORITES
-- ============================================

-- Usuarios solo ven sus propios favoritos
CREATE POLICY "Users can view own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

-- Usuarios pueden crear sus favoritos
CREATE POLICY "Users can create own favorites"
    ON favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden eliminar sus favoritos
CREATE POLICY "Users can delete own favorites"
    ON favorites FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS PARA VISITS
-- ============================================

-- Usuarios solo ven sus propias visitas
CREATE POLICY "Users can view own visits"
    ON visits FOR SELECT
    USING (auth.uid() = user_id);

-- Usuarios pueden registrar visitas
CREATE POLICY "Users can create own visits"
    ON visits FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS PARA OFFERS
-- ============================================

-- Ofertas activas son visibles para todos
CREATE POLICY "Active offers are viewable by everyone"
    ON offers FOR SELECT
    USING (is_active = TRUE AND valid_until >= CURRENT_DATE);

-- ============================================
-- POLÍTICAS PARA NOTIFICATIONS
-- ============================================

-- Usuarios solo ven sus propias notificaciones
CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);

-- Usuarios pueden actualizar sus notificaciones (marcar como leídas)
CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS PARA USER_SETTINGS
-- ============================================

-- Usuarios solo ven su propia configuración
CREATE POLICY "Users can view own settings"
    ON user_settings FOR SELECT
    USING (auth.uid() = user_id);

-- Usuarios pueden actualizar su configuración
CREATE POLICY "Users can update own settings"
    ON user_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- POLÍTICAS PARA MESSAGES
-- ============================================

-- Usuarios ven mensajes enviados o recibidos
CREATE POLICY "Users can view own messages"
    ON messages FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Usuarios pueden enviar mensajes
CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- ============================================
-- POLÍTICAS PARA REPORTED_CONTENT
-- ============================================

-- Usuarios pueden reportar contenido
CREATE POLICY "Users can report content"
    ON reported_content FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: Negocios con toda su información
CREATE VIEW businesses_full AS
SELECT 
    b.*,
    z.name as zone_name,
    z.state as zone_state,
    c.name as category_name,
    c.icon as category_icon,
    (SELECT COUNT(*) FROM favorites WHERE business_id = b.id) as favorites_count
FROM businesses b
LEFT JOIN zones z ON b.zone_id = z.id
LEFT JOIN categories c ON b.category_id = c.id;

-- Vista: Estadísticas de usuario
CREATE VIEW user_stats AS
SELECT 
    p.id as user_id,
    p.full_name,
    (SELECT COUNT(*) FROM favorites WHERE user_id = p.id) as favorites_count,
    (SELECT COUNT(*) FROM reviews WHERE user_id = p.id) as reviews_count,
    (SELECT COUNT(*) FROM visits WHERE user_id = p.id) as visits_count
FROM profiles p;

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL - Para desarrollo)
-- ============================================

-- Insertar zonas de ejemplo
INSERT INTO zones (name, slug, state, image_url, latitude, longitude) VALUES
    ('Pátzcuaro Pueblo Mágico', 'patzcuaro', 'Michoacán', 'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e', 19.511697, -101.609015),
    ('Morelia Centro Histórico', 'morelia', 'Michoacán', 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b', 19.703731, -101.194189),
    ('Uruapan', 'uruapan', 'Michoacán', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', 19.420370, -102.063011);

-- Nota: Para insertar negocios, horarios, etc., puedes hacerlo desde la app
-- o crear más inserts aquí según necesites.

-- ============================================
-- FIN DEL ESQUEMA
-- ============================================