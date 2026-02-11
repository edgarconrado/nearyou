// utils/distance.utils.ts

export interface Coordinates {
    latitude: number;
    longitude: number;
}

/**
 * Calcular distancia entre dos puntos usando la fórmula de Haversine
 * Retorna la distancia en kilómetros
 */
export function calculateDistance(
    point1: Coordinates,
    point2: Coordinates
): number {
    const R = 6371; // Radio de la Tierra en kilómetros

    const dLat = toRadians(point2.latitude - point1.latitude);
    const dLon = toRadians(point2.longitude - point1.longitude);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(point1.latitude)) *
        Math.cos(toRadians(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Convertir grados a radianes
 */
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Formatear distancia para mostrar en UI
 */
export function formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
        // Mostrar en metros si es menos de 1 km
        const meters = Math.round(distanceKm * 1000);
        return `${meters} m`;
    } else if (distanceKm < 10) {
        // Mostrar con 1 decimal si es menos de 10 km
        return `${distanceKm.toFixed(1)} km`;
    } else {
        // Mostrar sin decimales si es más de 10 km
        return `${Math.round(distanceKm)} km`;
    }
}

/**
 * Calcular y formatear distancia en un solo paso
 */
export function calculateAndFormatDistance(
    userLocation: Coordinates | null,
    targetLocation: Coordinates | null
): string {
    if (!userLocation || !targetLocation) {
        return 'N/A';
    }

    // Si las coordenadas son 0,0 (no definidas)
    if (targetLocation.latitude === 0 && targetLocation.longitude === 0) {
        return 'N/A';
    }

    const distance = calculateDistance(userLocation, targetLocation);
    return formatDistance(distance);
}

/**
 * Ordenar una lista de lugares por distancia al usuario Y AGREGAR la propiedad distance
 */
export function sortByDistance<T extends { latitude: number | null; longitude: number | null }>(
    items: T[],
    userLocation: Coordinates | null
): (T & { distance?: number })[] {
    if (!userLocation) {
        return items;
    }

    // Agregar la propiedad distance a cada item y ordenar
    const itemsWithDistance = items.map(item => {
        // Si no tiene coordenadas, no calcular distancia
        if (!item.latitude || !item.longitude) {
            return { ...item, distance: undefined };
        }

        const distance = calculateDistance(userLocation, {
            latitude: item.latitude,
            longitude: item.longitude,
        });

        return { ...item, distance };
    });

    // Ordenar por distancia
    return itemsWithDistance.sort((a, b) => {
        // Si alguno no tiene distancia, ponerlo al final
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;

        return a.distance - b.distance;
    });
}

/**
 * Filtrar lugares dentro de un radio específico (en km)
 */
export function filterByRadius<T extends { latitude: number | null; longitude: number | null }>(
    items: T[],
    userLocation: Coordinates | null,
    radiusKm: number
): T[] {
    if (!userLocation) {
        return items;
    }

    return items.filter(item => {
        if (!item.latitude || !item.longitude) return false;

        const distance = calculateDistance(userLocation, {
            latitude: item.latitude,
            longitude: item.longitude,
        });

        return distance <= radiusKm;
    });
}

/**
 * Obtener el negocio más cercano
 */
export function getClosest<T extends { latitude: number | null; longitude: number | null }>(
    items: T[],
    userLocation: Coordinates | null
): T | null {
    if (!userLocation || items.length === 0) {
        return null;
    }

    const sorted = sortByDistance(items, userLocation);
    return sorted[0] || null;
}