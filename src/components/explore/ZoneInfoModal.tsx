// components/explore/ZoneInfoModal.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH - 64;

interface ZoneInfoModalProps {
    visible: boolean;
    onClose: () => void;
    zoneName: string;
    zoneDescription?: string | null;
    galleryImages?: string[];
    coverImage?: string | null;
    loading?: boolean;
}

export function ZoneInfoModal({
    visible,
    onClose,
    zoneName,
    zoneDescription,
    galleryImages = [],
    coverImage,
    loading = false,
}: ZoneInfoModalProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Combinar cover image con galería si existe
    const allImages = coverImage
        ? [coverImage, ...galleryImages.filter(img => img !== coverImage)]
        : galleryImages;

    const hasImages = allImages.length > 0;
    const hasDescription = Boolean(zoneDescription);

    const handleScroll = (event: any) => {
        const slideSize = IMAGE_WIDTH;
        const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
        setActiveImageIndex(index);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color="#333" />
                    </Pressable>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {zoneName}
                    </Text>
                    <View style={styles.headerSpacer} />
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#003D7A" />
                        <Text style={styles.loadingText}>Cargando información...</Text>
                    </View>
                ) : (
                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Carrusel de Imágenes */}
                        {hasImages && (
                            <View style={styles.gallerySection}>
                                <ScrollView
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    onScroll={handleScroll}
                                    scrollEventThrottle={16}
                                    decelerationRate="fast"
                                    snapToInterval={IMAGE_WIDTH}
                                    contentContainerStyle={styles.galleryContainer}
                                >
                                    {allImages.map((imageUrl, index) => (
                                        <View key={index} style={styles.imageWrapper}>
                                            <Image
                                                source={{ uri: imageUrl }}
                                                style={styles.galleryImage}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    ))}
                                </ScrollView>

                                {/* Indicadores de posición */}
                                {allImages.length > 1 && (
                                    <View style={styles.pagination}>
                                        {allImages.map((_, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.paginationDot,
                                                    index === activeImageIndex && styles.paginationDotActive,
                                                ]}
                                            />
                                        ))}
                                    </View>
                                )}

                                {/* Contador de imágenes */}
                                <View style={styles.imageCounter}>
                                    <Ionicons name="images" size={16} color="#FFF" />
                                    <Text style={styles.imageCounterText}>
                                        {activeImageIndex + 1} / {allImages.length}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Sección de Historia/Descripción */}
                        {hasDescription && (
                            <View style={styles.descriptionSection}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="book-outline" size={24} color="#003D7A" />
                                    <Text style={styles.sectionTitle}>Historia del Lugar</Text>
                                </View>
                                <Text style={styles.descriptionText}>{zoneDescription}</Text>
                            </View>
                        )}

                        {/* Mensaje cuando no hay información */}
                        {!hasImages && !hasDescription && (
                            <View style={styles.emptyState}>
                                <Ionicons name="information-circle-outline" size={64} color="#CCC" />
                                <Text style={styles.emptyStateText}>
                                    No hay información adicional disponible para esta zona
                                </Text>
                            </View>
                        )}

                        {/* Espaciador inferior */}
                        <View style={styles.bottomSpacer} />
                    </ScrollView>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    closeButton: {
        padding: 8,
        width: 44,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
    },
    headerSpacer: {
        width: 44,
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    gallerySection: {
        marginBottom: 24,
        position: 'relative',
    },
    galleryContainer: {
        paddingHorizontal: 32,
    },
    imageWrapper: {
        width: IMAGE_WIDTH,
        height: 240,
        marginRight: 0,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#E0E0E0',
    },
    galleryImage: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 16,
        gap: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D0D0D0',
    },
    paginationDotActive: {
        width: 24,
        backgroundColor: '#003D7A',
    },
    imageCounter: {
        position: 'absolute',
        bottom: 24,
        right: 48,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    imageCounterText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    descriptionSection: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        marginBottom: 24,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        textAlign: 'justify',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    emptyStateText: {
        marginTop: 16,
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
    },
    bottomSpacer: {
        height: 40,
    },
});