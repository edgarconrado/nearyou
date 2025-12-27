import { Zone } from '@/lib/supabase';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 16px padding on each side + 16px gap

type Props = {
  zone: Zone;
  index: number;
  onPress: (zone: Zone) => void;
};

export function ZoneCard({ zone, index, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, index % 2 === 0 ? styles.cardLeft : styles.cardRight]}
      onPress={() => onPress(zone)}
      activeOpacity={0.8}
    >
      <Image
        source={{ 
          uri: zone.image_url || 'https://via.placeholder.com/400x300?text=Sin+imagen' 
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {zone.name}
        </Text>
        <Text style={styles.location} numberOfLines={1}>
          {zone.state}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardLeft: {
    marginRight: 8,
  },
  cardRight: {
    marginLeft: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: '#FFF',
    opacity: 0.9,
  },
});