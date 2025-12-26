import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyFavoritesScreen() {
    const router = useRouter();

    const favorites = [
        {
            id: 1,
            name: 'Restaurant El Mirador',
            category: 'Restaurante',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
            location: 'Pátzcuaro',
        },
        {
            id: 2,
            name: 'Hotel Vista Hermosa',
            category: 'Hotel',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
            location: 'Morelia',
        },
        {
            id: 3,
            name: 'Café Aroma',
            category: 'Cafetería',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',
            location: 'Pátzcuaro',
        },
    ];

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({
                pathname: '/detail',
                params: { businessId: item.id, businessName: item.name }
            })}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.name}>{item.name}</Text>
                    <TouchableOpacity>
                        <Ionicons name="heart" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.category}>{item.category}</Text>
                <View style={styles.footer}>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFB800" />
                        <Text style={styles.rating}>{item.rating}</Text>
                    </View>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={14} color="#666" />
                        <Text style={styles.location}>{item.location}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Mis favoritos</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
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
        backgroundColor: '#003D7A',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: '100%',
        height: 180,
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    name: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    category: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    location: {
        fontSize: 13,
        color: '#666',
    },
});