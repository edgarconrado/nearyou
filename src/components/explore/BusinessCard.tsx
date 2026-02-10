// components/explore/BusinessCard.tsx
import { Ionicons } from '@expo/vector-icons';
import type { BusinessFull } from '@services/businesses.service';
import React from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';

interface BusinessCardProps {
  business: BusinessFull;
  onPress: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Ancho de cada tarjeta: (ancho total - padding lateral - gap entre tarjetas) / 2
const CARD_WIDTH = (SCREEN_WIDTH - 32 - 12) / 2;

export function BusinessCard({ business, onPress }: BusinessCardProps) {
  const hasOffers = business.active_offers_count && business.active_offers_count > 0;
  const hasDistance = business.distance !== undefined && business.distance !== null;
  
  // Determinar si está abierto basado en el campo is_open
  const isOpen = business.is_open ?? true; // Por defecto abierto si no está definido

  // Usar cover_image_url o main_image_url
  const imageUrl = business.main_image_url;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Imagen del negocio */}
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="business" size={40} color="#CCC" />
          </View>
        )}

        {/* Badge de ofertas - Esquina superior derecha */}
        {hasOffers && (
          <View style={styles.offerBadge}>
            <Ionicons name="pricetag" size={12} color="#FFF" />
            <Text style={styles.offerBadgeText}>{business.active_offers_count}</Text>
          </View>
        )}
      </View>

      {/* Información del negocio */}
      <View style={styles.content}>
        <Text style={styles.businessName} numberOfLines={2}>
          {business.name}
        </Text>

        {/* Indicador de abierto/cerrado - Debajo del nombre */}
        <View style={[styles.statusBadge, isOpen ? styles.openBadge : styles.closedBadge]}>
          <View style={[styles.statusDot, isOpen ? styles.openDot : styles.closedDot]} />
          <Text style={[styles.statusText, isOpen ? styles.openText : styles.closedText]}>
            {isOpen ? 'Abierto' : 'Cerrado'}
          </Text>
        </View>

        {/* Categoría y Distancia en la misma fila */}
        <View style={styles.bottomRow}>
          {/* Categoría */}
          {business.category_name && (
            <View style={styles.categoryContainer}>
              <Ionicons name="pricetags-outline" size={11} color="#666" />
              <Text style={styles.categoryText} numberOfLines={1}>
                {business.category_name}
              </Text>
            </View>
          )}

          {/* Distancia */}
          {hasDistance && (
            <View style={styles.distanceContainer}>
              <Ionicons name="location" size={12} color="#003D7A" />
              <Text style={styles.distanceText}>
                {business.distance! < 1
                  ? `${Math.round(business.distance! * 1000)} m`
                  : `${business.distance!.toFixed(1)} km`}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  offerBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: 12,
    gap: 5,
  },
  businessName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    lineHeight: 18,
    minHeight: 36, // Espacio para 2 líneas
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
    alignSelf: 'flex-start',
  },
  openBadge: {
    backgroundColor: '#E8F5E9', // Verde muy suave
  },
  closedBadge: {
    backgroundColor: '#FFEBEE', // Rojo muy suave
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  openDot: {
    backgroundColor: '#4CAF50', // Verde
  },
  closedDot: {
    backgroundColor: '#F44336', // Rojo
  },
  statusText: {
    fontSize: 9,
    fontWeight: '600',
  },
  openText: {
    color: '#2E7D32', // Verde oscuro para texto
  },
  closedText: {
    color: '#C62828', // Rojo oscuro para texto
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 0, // Permite que se encoja si es necesario
  },
  categoryText: {
    fontSize: 11,
    color: '#666',
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 11,
    color: '#003D7A',
    fontWeight: '700',
  },
});