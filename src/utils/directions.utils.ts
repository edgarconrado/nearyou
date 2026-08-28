// utils/directions.utils.ts
//
// Guía 4 de App Store: si la app ofrece direcciones, el usuario debe poder
// elegir Apple Maps. Antes se abría Google Maps directo, lo que obligaba a
// depender de una app de terceros.
//
// En iOS se muestra un selector; en Android va directo a Google Maps, que es
// el mapa del sistema.

import { ActionSheetIOS, Alert, Linking, Platform } from 'react-native';

type Coordinates = { latitude: number; longitude: number };

function googleMapsUrl({ latitude, longitude }: Coordinates, label?: string) {
  const query = label
    ? `${latitude},${longitude}(${encodeURIComponent(label)})`
    : `${latitude},${longitude}`;
  return `https://maps.google.com/?q=${query}`;
}

function appleMapsUrl({ latitude, longitude }: Coordinates, label?: string) {
  const name = label ? `&q=${encodeURIComponent(label)}` : '';
  return `http://maps.apple.com/?ll=${latitude},${longitude}${name}&dirflg=d`;
}

async function open(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('No pudimos abrir el mapa', 'Inténtalo de nuevo.');
  }
}

/**
 * Abre las direcciones hacia un punto.
 *
 * En iOS pregunta entre Apple Maps y Google Maps (esta última solo si está
 * instalada). En Android abre Google Maps.
 */
export async function openDirections(coordinates: Coordinates, label?: string) {
  const { latitude, longitude } = coordinates;
  if (!latitude || !longitude) {
    Alert.alert('Ubicación no disponible', 'Este lugar no tiene coordenadas registradas.');
    return;
  }

  if (Platform.OS !== 'ios') {
    await open(googleMapsUrl(coordinates, label));
    return;
  }

  // ¿Está Google Maps instalada? Si no, no tiene sentido ofrecerla.
  let hasGoogleMaps = false;
  try {
    hasGoogleMaps = await Linking.canOpenURL('comgooglemaps://');
  } catch {
    hasGoogleMaps = false;
  }

  if (!hasGoogleMaps) {
    await open(appleMapsUrl(coordinates, label));
    return;
  }

  const options = ['Apple Maps', 'Google Maps', 'Cancelar'];

  ActionSheetIOS.showActionSheetWithOptions(
    {
      title: 'Cómo llegar',
      options,
      cancelButtonIndex: 2,
    },
    (index) => {
      if (index === 0) open(appleMapsUrl(coordinates, label));
      if (index === 1) {
        open(
          `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`
        );
      }
    }
  );
}