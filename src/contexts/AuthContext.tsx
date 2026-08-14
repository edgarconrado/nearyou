// contexts/AuthContext.tsx
// Autenticación con Supabase Auth (Google + Apple, flujo nativo por idToken).
//
// Expone `useAuth()` y `useUser()` con la misma forma que tenían los hooks de
// Clerk, para que el resto de la app siga funcionando cambiando solo el import.

import { supabase } from '@/lib/supabase';
import { ProfileService } from '@/services/profile.service';
import type { Session, User } from '@supabase/supabase-js';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NativeModules, Platform, TurboModuleRegistry } from 'react-native';

// ---------------------------------------------------------------------------
// Carga perezosa de los módulos nativos
// ---------------------------------------------------------------------------
// Google y Apple traen código nativo: si el dev build instalado no los tiene
// compilados, importarlos arriba tumba TODA la app al arrancar (el import se
// evalúa aunque nadie presione el botón).
//
// Cargándolos dentro de la función, la app arranca siempre y el fallo queda
// contenido en el botón que lo necesita.
//
// TEMPORAL: en cuanto instales un dev build hecho DESPUÉS de agregar estas
// dependencias, puedes volver a los imports normales arriba.

const MISSING_NATIVE =
  'Este módulo no está en el build instalado. Genera un dev build nuevo ' +
  '(eas build --profile development) e instálalo para poder iniciar sesión.';

/**
 * ¿Existe este módulo nativo en el binario?
 *
 * Hay que preguntar ANTES de hacer el require. El paquete llama a
 * `TurboModuleRegistry.getEnforcing()` al evaluarse, y esa función lanza en
 * lugar de devolver null: aunque envolvamos el require en try/catch, Metro
 * ya reportó el error a LogBox y sale la pantalla roja en desarrollo.
 *
 * `TurboModuleRegistry.get()` (sin "Enforcing") devuelve null en vez de lanzar.
 */
function hasNativeModule(name: string): boolean {
  try {
    return !!(TurboModuleRegistry.get?.(name) ?? NativeModules?.[name]);
  } catch {
    return false;
  }
}

let googleConfigured = false;

/** Devuelve el módulo de Google, o null si no está en el binario. */
function loadGoogleSignin() {
  if (!hasNativeModule('RNGoogleSignin')) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('@react-native-google-signin/google-signin');

    if (!googleConfigured) {
      mod.GoogleSignin.configure({
        // Client ID de tipo "Web application" en Google Cloud.
        // El mismo que se pega en Supabase → Authentication → Providers → Google.
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        // Client ID de tipo "iOS" en Google Cloud.
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        scopes: ['profile', 'email'],
      });
      googleConfigured = true;
    }

    return mod;
  } catch {
    return null;
  }
}

/** Devuelve el módulo de Apple, o null si no está en el binario. */
function loadAppleAuth() {
  if (!hasNativeModule('ExpoAppleAuthentication')) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-apple-authentication');
  } catch {
    return null;
  }
}

/** Devuelve expo-crypto, o null si no está en el binario. */
function loadCrypto() {
  if (!hasNativeModule('ExpoCrypto')) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-crypto');
  } catch {
    return null;
  }
}

/**
 * Genera el par de nonce que exige el login por idToken.
 *
 * Cómo funciona la validación:
 *   1. Al proveedor (Google/Apple) se le manda el nonce YA HASHEADO.
 *   2. El proveedor incrusta ese hash dentro del id_token.
 *   3. A Supabase se le manda el nonce EN CRUDO; Supabase lo hashea y
 *      compara con el que viene en el token.
 *
 * Así, un token interceptado no sirve: quien lo robe no conoce el valor
 * crudo que lo generó.
 *
 * Devuelve null si expo-crypto no está en el binario — en ese caso se hace
 * login sin nonce, que es el comportamiento anterior y requiere tener
 * "Skip nonce checks" activado en Supabase.
 */
async function createNonce(): Promise<{ raw: string; hashed: string } | null> {
  const Crypto = loadCrypto();
  if (!Crypto) return null;

  try {
    // 32 bytes aleatorios en hexadecimal
    const bytes = await Crypto.getRandomBytesAsync(32);
    const raw = Array.from(bytes as Uint8Array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    const hashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      raw
    );

    return { raw, hashed };
  } catch {
    return null;
  }
}

/** ¿Se puede ofrecer Sign in with Apple en este dispositivo? */
export async function isAppleAuthAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') return false;

  const AppleAuthentication = loadAppleAuth();
  if (!AppleAuthentication) return false;

  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}

/** Usuario normalizado, con la misma superficie que exponía Clerk. */
export type AppUser = {
  id: string;
  email: string | null;
  fullName: string | null;
  firstName: string | null;
  imageUrl: string | null;
  provider: string | null;
  raw: User;
};

type AuthError = { code: string; message: string };

type AuthContextValue = {
  session: Session | null;
  user: AppUser | null;
  userId: string | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithApple: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function toAppUser(user: User | null): AppUser | null {
  if (!user) return null;

  const meta = user.user_metadata ?? {};
  const fullName: string | null =
    meta.full_name ?? meta.name ?? meta.preferred_username ?? null;

  return {
    id: user.id,
    email: user.email ?? meta.email ?? null,
    fullName,
    firstName: fullName ? fullName.split(' ')[0] : null,
    imageUrl: meta.avatar_url ?? meta.picture ?? null,
    provider: user.app_metadata?.provider ?? null,
    raw: user,
  };
}

/** El usuario canceló el diálogo nativo: no es un error que mostrar. */
const CANCELLED = 'cancelled';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const syncedUserRef = useRef<string | null>(null);

  // Sesión inicial + suscripción a cambios
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setIsLoaded(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        setIsLoaded(true);
      }
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  // Asegurar perfil + settings la primera vez que vemos a este usuario
  useEffect(() => {
    const user = session?.user;
    if (!user || syncedUserRef.current === user.id) return;

    syncedUserRef.current = user.id;
    ProfileService.ensureProfile(user);
  }, [session?.user?.id]);

  const signInWithGoogle = useCallback(async () => {
    const google = loadGoogleSignin();
    if (!google) {
      return { error: { code: 'native_missing', message: MISSING_NATIVE } };
    }
    const { GoogleSignin, statusCodes } = google;

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const nonce = await createNonce();

      const response = await GoogleSignin.signIn(
        nonce ? { nonce: nonce.hashed } : undefined
      );

      const idToken =
        // v13+ devuelve { type, data }, versiones previas devuelven el usuario plano
        (response as any)?.data?.idToken ?? (response as any)?.idToken;

      if (!idToken) {
        return {
          error: { code: 'no_id_token', message: 'Google no devolvió un token.' },
        };
      }

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
        // El crudo: Supabase lo hashea y lo compara con el del token
        ...(nonce ? { nonce: nonce.raw } : {}),
      });

      if (error) return { error: { code: 'supabase', message: error.message } };
      return { error: null };
    } catch (e: any) {
      if (
        e?.code === statusCodes.SIGN_IN_CANCELLED ||
        e?.code === statusCodes.IN_PROGRESS
      ) {
        return { error: { code: CANCELLED, message: '' } };
      }
      return {
        error: { code: 'google', message: e?.message ?? 'Error con Google.' },
      };
    }
  }, []);

  const signInWithApple = useCallback(async () => {
    if (Platform.OS !== 'ios') {
      return {
        error: {
          code: 'unsupported',
          message: 'Sign in with Apple solo está disponible en iOS.',
        },
      };
    }

    const AppleAuthentication = loadAppleAuth();
    if (!AppleAuthentication) {
      return { error: { code: 'native_missing', message: MISSING_NATIVE } };
    }

    try {
      const nonce = await createNonce();

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        ...(nonce ? { nonce: nonce.hashed } : {}),
      });

      if (!credential.identityToken) {
        return {
          error: { code: 'no_id_token', message: 'Apple no devolvió un token.' },
        };
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
        ...(nonce ? { nonce: nonce.raw } : {}),
      });

      if (error) return { error: { code: 'supabase', message: error.message } };

      // Apple solo entrega el nombre en el PRIMER inicio de sesión.
      // Si viene, hay que guardarlo ya o se pierde para siempre.
      const appleName = [
        credential.fullName?.givenName,
        credential.fullName?.familyName,
      ]
        .filter(Boolean)
        .join(' ');

      if (appleName && data.user) {
        await supabase.auth.updateUser({ data: { full_name: appleName } });
        await ProfileService.updateProfile(data.user.id, {
          full_name: appleName,
        });
      }

      return { error: null };
    } catch (e: any) {
      if (e?.code === 'ERR_REQUEST_CANCELED') {
        return { error: { code: CANCELLED, message: '' } };
      }
      return {
        error: { code: 'apple', message: e?.message ?? 'Error con Apple.' },
      };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const isGoogle = session?.user?.app_metadata?.provider === 'google';
      if (isGoogle) {
        const google = loadGoogleSignin();
        await google?.GoogleSignin.signOut().catch(() => { });
      }
    } finally {
      syncedUserRef.current = null;
      await supabase.auth.signOut();
    }
  }, [session?.user?.app_metadata?.provider]);

  const refreshUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      setSession((prev) => (prev ? { ...prev, user: data.user } : prev));
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const user = toAppUser(session?.user ?? null);
    return {
      session,
      user,
      userId: user?.id ?? null,
      isLoaded,
      isSignedIn: !!session,
      signInWithGoogle,
      signInWithApple,
      signOut,
      refreshUser,
    };
  }, [session, isLoaded, signInWithGoogle, signInWithApple, signOut, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}

/** Compatibilidad con el `useUser()` que venía de Clerk. */
export function useUser() {
  const { user, isLoaded, isSignedIn, refreshUser } = useAuth();
  return { user, isLoaded, isSignedIn, refreshUser };
}

export const isCancelled = (error: AuthError | null) =>
  error?.code === CANCELLED;