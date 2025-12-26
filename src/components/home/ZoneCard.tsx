import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

type Zone = {
  id: number;
  title: string;
  location: string;
  image: string;
};

type Props = {
  zone: Zone;
  index: number;
  onPress: (zone: Zone) => void;
};

export function ZoneCard({ zone, index, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        index % 2 === 0 ? styles.cardLeft : styles.cardRight,
      ]}
      activeOpacity={0.8}
      onPress={() => onPress(zone)}
    >
      <Image source={{ uri: zone.image }} style={styles.cardImage} />
      <View style={styles.cardOverlay}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{zone.title}</Text>
          <Text style={styles.cardLocation}>{zone.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: 140,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#333',
    elevation: 3,
  },
  cardLeft: {
    marginRight: 16,
  },
  cardRight: {
    marginLeft: 0,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  cardContent: {
    gap: 2,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardLocation: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.95,
  },
});