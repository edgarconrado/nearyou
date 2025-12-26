import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

interface ImageGalleryProps {
    images: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    return (
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.gallery}
        >
            {images.map((image, index) => (
                <Image
                    key={index}
                    source={{ uri: image }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    gallery: {
        height: 280,
    },
    galleryImage: {
        width: width,
        height: 280,
    },
});