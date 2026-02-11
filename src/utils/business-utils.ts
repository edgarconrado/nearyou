import type { BusinessData } from '@/components/details/BusinessInfo';
import type { Database } from '@/types/database.types';

// Tipo del negocio desde la base de datos
type BusinessRow = Database['public']['Tables']['businesses']['Row'];

// Tipo del negocio completo con relaciones (si las tienes)
export interface BusinessWithRelations extends BusinessRow {
    category?: {
        name: string;
        slug: string;
        icon?: string | null;
    } | null;
}

/**
 * Transforma los datos del negocio desde la BD al formato de UI
 */
export function transformBusinessToUIData(
    business: BusinessWithRelations,
    additionalData?: {
        isOpen?: boolean;
        closingTime?: string | null;
    }
): BusinessData {
    return {
        // Campos obligatorios
        id: business.id,
        name: business.name,

        // Campos de la BD (renombrados para UI)
        category: business.category?.name || 'Sin categoría',
        rating: business.average_rating ?? undefined,
        reviews: business.total_reviews ?? undefined,
        isOpen: additionalData?.isOpen ?? business.is_open ?? undefined,
        description: business.description ?? undefined,
        priceRange: business.price_range ?? undefined,
        features: business.features ?? undefined,
        closingTime: additionalData?.closingTime,

        // Mantener campos originales de la BD también
        average_rating: business.average_rating,
        total_reviews: business.total_reviews,
        is_open: business.is_open,
        price_range: business.price_range,

        // Otros campos útiles
        address: business.address,
        city: business.city,
        state: business.state,
        postal_code: business.postal_code,
        phone: business.phone,
        email: business.email,
        website: business.website,
        latitude: business.latitude,
        longitude: business.longitude,
        main_image_url: business.main_image_url,
        gallery_urls: business.gallery_urls,
        slug: business.slug,
        is_verified: business.is_verified,
        is_active: business.is_active,
        total_visits: business.total_visits,
        zone_id: business.zone_id,
        category_id: business.category_id,
        created_at: business.created_at,
        updated_at: business.updated_at,
    };
}

/**
 * Parsea las características/features del negocio
 * Maneja tanto arrays como strings JSON
 */
export function parseBusinessFeatures(features: string[] | string | null | undefined): string[] {
    if (!features) return [];

    try {
        if (Array.isArray(features)) {
            return features;
        }
        if (typeof features === 'string') {
            return JSON.parse(features);
        }
    } catch (error) {
    }

    return [];
}

/**
 * Parsea las URLs de la galería
 */
export function parseGalleryUrls(
    mainImage: string | null | undefined,
    galleryUrls: string[] | string | null | undefined
): string[] {
    const images: string[] = [];

    // Agregar imagen principal
    if (mainImage) {
        images.push(mainImage);
    }

    // Agregar galería
    try {
        if (Array.isArray(galleryUrls)) {
            images.push(...galleryUrls);
        } else if (typeof galleryUrls === 'string') {
            const parsed = JSON.parse(galleryUrls);
            if (Array.isArray(parsed)) {
                images.push(...parsed);
            }
        }
    } catch (error) {
    }

    // Retornar imágenes o placeholder
    return images.length > 0
        ? images
        : ['https://via.placeholder.com/800x600?text=Sin+Imagen'];
}

/**
 * Formatea el rango de precio
 */
export function formatPriceRange(priceRange: string | null | undefined): string {
    if (!priceRange) return '$';

    const validRanges = ['$', '$$', '$$$', '$$$$'];
    return validRanges.includes(priceRange) ? priceRange : '$';
}

/**
 * Calcula la distancia entre dos coordenadas (en km)
 * Usa la fórmula de Haversine
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Redondear a 1 decimal
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Formatea la distancia para mostrar en UI
 */
export function formatDistance(
    businessLat: number | null | undefined,
    businessLon: number | null | undefined,
    userLat: number | null | undefined,
    userLon: number | null | undefined
): string {
    if (!businessLat || !businessLon || !userLat || !userLon) {
        return '';
    }

    const distance = calculateDistance(userLat, userLon, businessLat, businessLon);

    if (distance < 1) {
        return `${Math.round(distance * 1000)} m`;
    }

    return `${distance} km`;
}

/**
 * Obtiene la URL de la imagen principal o placeholder
 */
export function getMainImageUrl(business: BusinessRow): string {
    return business.main_image_url || 'https://via.placeholder.com/800x600?text=Sin+Imagen';
}

/**
 * Verifica si un negocio tiene datos completos
 */
export function isBusinessComplete(business: BusinessRow): boolean {
    return !!(
        business.name &&
        business.address &&
        business.city &&
        business.category_id &&
        business.latitude &&
        business.longitude
    );
}

/**
 * Obtiene el estado de verificación del negocio
 */
export function getVerificationStatus(business: BusinessRow): {
    isVerified: boolean;
    label: string;
    color: string;
} {
    const isVerified = business.is_verified ?? false;

    return {
        isVerified,
        label: isVerified ? 'Verificado' : 'No verificado',
        color: isVerified ? '#2E7D32' : '#666',
    };
}

/**
 * Formatea la información de contacto
 */
export function formatContactInfo(business: BusinessRow): {
    hasPhone: boolean;
    hasEmail: boolean;
    hasWebsite: boolean;
    phone?: string;
    email?: string;
    website?: string;
} {
    return {
        hasPhone: !!business.phone,
        hasEmail: !!business.email,
        hasWebsite: !!business.website,
        phone: business.phone ?? undefined,
        email: business.email ?? undefined,
        website: business.website ?? undefined,
    };
}

/**
 * Genera el mensaje para compartir un negocio
 */
export function generateShareMessage(business: BusinessRow): string {
    const rating = business.average_rating
        ? `\n\nCalificación: ${business.average_rating.toFixed(1)} ⭐`
        : '';

    const location = business.address && business.city
        ? `\nUbicación: ${business.address}, ${business.city}`
        : '';

    const website = business.website
        ? `\n\nMás información: ${business.website}`
        : '';

    return `¡Mira este lugar increíble! ${business.name}${business.description ? ` - ${business.description}` : ''}${rating}${location}${website}`;
}