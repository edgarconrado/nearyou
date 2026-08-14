// constants/links.ts
// Enlaces externos de la app en un solo lugar: si cambia el dominio,
// se toca aquí y no en cada pantalla.

import * as WebBrowser from 'expo-web-browser';
import { Alert, Linking } from 'react-native';

/**
 * Página legal de NearYou. Contiene la Política de Privacidad y los
 * Términos y Condiciones en el mismo documento.
 *
 * Esta misma URL es la que se registra en App Store Connect como
 * "Privacy Policy URL".
 */
export const LEGAL_URL = 'https://jacaranda-lab.com/nearyou/NearYou_Legal.html';

export const PRIVACY_URL = LEGAL_URL;
export const TERMS_URL = LEGAL_URL;

/** Correo de soporte que se ofrece en Ayuda y en los avisos de error. */
export const SUPPORT_EMAIL = 'edgarconrado23@gmail.com';

/**
 * Abre una URL en el navegador integrado.
 *
 * Se usa expo-web-browser en vez de Linking.openURL porque este último
 * delega en Safari y puede fallar sin avisar (pasa en dispositivos viejos).
 * El navegador integrado además mantiene al usuario dentro de la app.
 *
 * Si por lo que sea no puede abrirse, cae a Linking y, en último caso,
 * avisa mostrando la URL para que se pueda copiar.
 */
export async function openExternalLink(url: string): Promise<void> {
    try {
        await WebBrowser.openBrowserAsync(url, {
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
            enableBarCollapsing: true,
        });
        return;
    } catch {
        // sigue al respaldo
    }

    try {
        await Linking.openURL(url);
    } catch {
        Alert.alert('No pudimos abrir el enlace', url);
    }
}