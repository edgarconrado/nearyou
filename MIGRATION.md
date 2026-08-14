# NearYou — Migración a Supabase Auth + rediseño Airbnb

Guía de puesta en marcha. El orden importa: la base de datos primero, las
credenciales después, el build al final.

---

## 0. Antes de empezar

Esto **no corre en Expo Go**. El inicio de sesión con Google y Apple usa módulos
nativos, así que necesitas un *development build*. Ya tenías `expo-dev-client`
instalado, así que el salto es corto.

```bash
npm install
npx expo install expo-apple-authentication @react-native-google-signin/google-signin
```

Usa `npx expo install` y no `npm install` para esos dos: fija las versiones
compatibles con SDK 54 (dejé un rango tentativo en `package.json`, pero deja que
Expo lo corrija).

---

## 1. Base de datos

Ejecuta `SQL/v_1_0_2__clerk_to_supabase_auth.sql` completo en el SQL Editor de
Supabase. Es idempotente, lo puedes correr dos veces sin romper nada.

**Antes de correrlo, haz un backup.** El script no borra filas, pero toca llaves
foráneas y políticas RLS.

Qué hace, en corto:

1. Copia el ID de Clerk a `profiles.legacy_clerk_id` (para auditar o revertir).
2. Convierte las FK que apuntan a `profiles(id)` a `ON UPDATE CASCADE`.
3. Instala un trigger en `auth.users`: cuando alguien entra por primera vez,
   busca su perfil **por email** y le reasigna el UUID nuevo. Reseñas, favoritos,
   visitas y ajustes se mueven solos por el cascade.
4. Recrea las políticas RLS usando `auth.uid()` y las de storage para avatares.

### Verificar el avance

```sql
SELECT count(*) FILTER (WHERE id LIKE 'user_%')     AS pendientes,
       count(*) FILTER (WHERE id NOT LIKE 'user_%') AS migrados
  FROM public.profiles;
```

Empiezas con 19 pendientes. Cada usuario que entra baja el contador en uno.
Cuando llegue a 0, puedes correr la **Fase 2** (comentada al final del script):
convierte las columnas a UUID de verdad y ata `profiles.id` a `auth.users(id)`.

### El caso que no tiene solución automática

Si alguien se registró en Clerk con su Gmail y ahora entra con Apple usando
*Hide My Email*, el correo que llega es `algo@privaterelay.appleid.com`. No
coincide con nada y se le crea un perfil nuevo — pierde sus favoritos y reseñas.

Son 19 usuarios, así que si pasa lo puedes enlazar a mano:

```sql
-- Fusionar un perfil nuevo (huérfano) con el perfil viejo de Clerk
UPDATE public.profiles
   SET id = '<uuid-nuevo-de-auth.users>'
 WHERE legacy_clerk_id = '<user_2xxxx...>';
```

---

## 2. Google

### 2.1 Google Cloud Console

Puedes reusar el proyecto donde tienes la API key de Maps.

Ve a **APIs y servicios → Credenciales** y crea **tres** IDs de cliente OAuth:

| Tipo | Para qué | Dónde se usa |
|---|---|---|
| **Aplicación web** | Emitir el `idToken` | `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` **y** Supabase |
| **iOS** | Bundle `com.jacarandalab.nearyou` | `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` y `iosUrlScheme` |
| **Android** | Paquete `com.jacarandalab.nearyou` + huella SHA-1 | No va en el código, solo debe existir |

El SHA-1 de Android sale de EAS:

```bash
eas credentials --platform android
# → Keystore → verás el SHA-1 Fingerprint
```

> Si generas builds con perfiles distintos (`development` y `production`) y cada
> uno usa keystore propio, registra **ambos** SHA-1. Un SHA-1 faltante es la
> causa número uno de `DEVELOPER_ERROR` en Android.

### 2.2 `app.json`

Ya dejé el plugin puesto, pero con un valor de relleno que **tienes que
reemplazar**:

```json
["@react-native-google-signin/google-signin", {
  "iosUrlScheme": "com.googleusercontent.apps.REEMPLAZA_CON_TU_IOS_CLIENT_ID_INVERTIDO"
}]
```

El valor es tu iOS client ID al revés. Si tu client ID es
`123456-abcdef.apps.googleusercontent.com`, el scheme es
`com.googleusercontent.apps.123456-abcdef`.

### 2.3 Supabase

**Authentication → Sign In / Providers → Google**, actívalo y llena:

- **Client ID** y **Client Secret**: los del cliente **web**.
- **Authorized Client IDs**: agrega ahí los IDs de **iOS** y **Android**,
  separados por coma.

Ese último campo es el que suele olvidarse. Si ves el error
`Unacceptable audience in id_token`, es exactamente esto.

---

## 3. Apple

### 3.1 Apple Developer

**Certificates, Identifiers & Profiles → Identifiers →** tu App ID
`com.jacarandalab.nearyou` → marca la capacidad **Sign In with Apple** y guarda.

### 3.2 Supabase

**Authentication → Sign In / Providers → Apple**, actívalo y en
**Authorized Client IDs** pon el bundle: `com.jacarandalab.nearyou`.

Para el flujo **nativo en iOS** eso es todo: no necesitas Services ID, Team ID,
Key ID ni el archivo `.p8`. Esos solo hacen falta si algún día quieres Apple en
Android o en web.

### 3.3 Regla de App Store

Apple exige que, si ofreces login social de terceros, ofrezcas también Sign in
with Apple en iOS. La pantalla de acceso ya cumple: muestra el botón de Apple
solo en iOS (`AppleAuthentication.isAvailableAsync()`), y en Android queda solo
Google.

---

## 4. Variables de entorno

Tu `.env` quedó así:

```
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=      # ← llenar
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=      # ← llenar
```

Quité `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`.

Ojo con esto: tu `.gitignore` ignora `.env*.local` pero **no** `.env`, así que ese
archivo se sube al repo y EAS lo lee en el build. Funciona, pero si prefieres no
commitear credenciales, muévelas a variables de entorno de EAS:

```bash
eas env:create --name EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID --value "..." --environment production
```

(Cualquier variable con prefijo `EXPO_PUBLIC_` termina dentro del bundle de todos
modos — no es un secreto, pero sí es un dato que quizá no quieras en un repo.)

---

## 5. Build

`/ios` y `/android` están en `.gitignore`, o sea que estás en flujo *managed* y
EAS hace el prebuild. Solo asegúrate de que `app.json` esté correcto antes.

```bash
# Dev build para probar el login
eas build --profile development --platform ios
eas build --profile development --platform android

# Producción
eas build --profile production --platform all
```

Si prefieres compilar local en la Mac:

```bash
npx expo prebuild --clean
npx expo run:ios
```

---

## 6. Qué revisar en la primera prueba

1. Entra con Google en Android → revisa que en Supabase aparezca la fila en
   `auth.users`.
2. Corre la consulta de verificación del punto 1: `pendientes` debe haber
   bajado.
3. Entra a Favoritos: si ese usuario ya tenía favoritos de la época de Clerk,
   deben seguir ahí. Si aparecen vacíos, el email no coincidió.
4. Repite con Apple en iOS.

---

## 7. Sistema de diseño

Todo vive en `src/constants/design.ts`. Cuando toques una pantalla nueva, importa
de ahí en lugar de escribir hex a mano:

```ts
import { palette, spacing, radius, type, hairline } from '@/constants/design';
```

Las reglas, para que el rediseño no se desarme pantalla por pantalla:

1. El fondo es blanco. Siempre. El color vive en las fotos.
2. Solo dos colores de texto: `palette.ink` (#222222) y `palette.muted` (#717171).
3. Separa con hairlines (1px), no con tarjetas flotantes. Hay una sola sombra en
   todo el sistema (`elevation.float`) y es para cosas que flotan de verdad.
4. `palette.accent` (#FF385C) se usa con cuentagotas: corazón activo y poco más.
5. La jerarquía la da el **peso** y el **color**, no el tamaño de fuente.

`src/constants/colors.ts` (la paleta dorada vieja) sigue ahí porque las pantallas
que aún no rediseñé la importan. Cuando termines de migrarlas, se puede borrar.

---

## 8. Lo que queda pendiente

### Pantallas sin rediseñar

Funcionan bien — solo se les cambió el import de auth — pero conservan el estilo
azul/dorado anterior:

- `src/app/(tabs)/profile.tsx` (875 líneas)
- `src/app/detail.tsx` (892 líneas)
- `src/app/(tabs)/my-favorites.tsx`
- Las pantallas de ajustes: `notifications-settings`, `privacy-settings`,
  `language`, `help-support`, `about`, `edit-profile`, `my-reviews`, `my-visits`
- Componentes de `explore/` que no toqué: `OfferCard`, `OffersSection`,
  `ExploreHeader`, `ZoneInfoModal`, `FloatingLocationBadge`,
  `LocationPermissionScreen`

Se ven inconsistentes junto a lo nuevo. `profile.tsx` y `detail.tsx` son las dos
que más se notan.

### Errores de TypeScript preexistentes

`npx tsc --noEmit` reporta 15 errores que **ya venían de antes** y no tienen que
ver con esta migración:

- `src/app/detail.tsx` — el import `'../../types/types'` apunta fuera del
  proyecto; debería ser `'../types/types'`. Los otros 6 son `any` implícitos.
- `src/app/notifications-settings.tsx` (7) y `src/utils/business-utils.ts` (1) —
  `src/types/database.types.ts` está desfasado respecto a tu base real.

No bloquean Metro (Babel ignora los tipos), pero conviene regenerarlos después de
la migración:

```bash
npm run gen-types
```

Ese comando es también lo que arregla los errores de `user_settings`.

### Otras notas

- `tsconfig.json` tiene `"ignoreDeprecations": "6.0"`, que TypeScript 5.9 rechaza.
  Para hacer typecheck tuve que quitarlo. Bórralo cuando puedas.
- El textito `v1.0.12r20` del header viejo desapareció con el rediseño. Si lo
  usabas para saber qué build estás probando, dime y lo pongo en Perfil → Acerca de.
