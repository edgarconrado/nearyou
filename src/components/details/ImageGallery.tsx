import { palette, spacing } from '@/constants/design';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const HEIGHT = Math.round(width * 0.75); // 4:3, como las tarjetas del listado

interface ImageGalleryProps {
  images: string[];
}

/**
 * Galería a sangre con contador "3 / 8" en la esquina, al estilo de Airbnb.
 * Sin puntos: con muchas fotos los puntos se vuelven ilegibles.
 */
export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return <View style={[styles.image, styles.placeholder]} />;
  }

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, i) => (
          <Image
            key={`${image}-${i}`}
            source={{ uri: image }}
            style={styles.image}
            contentFit="cover"
            transition={180}
          />
        ))}
      </ScrollView>

      {images.length > 1 && (
        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {index + 1} / {images.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width,
    height: HEIGHT,
    backgroundColor: palette.skeleton,
  },
  placeholder: { backgroundColor: palette.skeleton },
  counter: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 999,
  },
  counterText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: '600',
  },
});