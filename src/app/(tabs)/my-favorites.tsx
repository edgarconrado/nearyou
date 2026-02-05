import { useFavorites } from '@/hooks/use-favorites';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyFavoritesScreen() {
    const router = useRouter();
    // Ahora usa el contexto global - los cambios se sincronizan automáticamente
    const { favorites, loading, removeFavorite, refetch, userId, isSignedIn } = useFavorites();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        console.log('🔄 Manual refresh triggered');
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleRemoveFavorite = async (businessId: string, businessName: string) => {
        Alert.alert(
            'Eliminar favorito',
            `¿Quieres eliminar "${businessName}" de tus favoritos?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        console.log('❌ Removing favorite:', businessId);
                        const success = await removeFavorite(businessId);
                        
                        if (success) {
                            console.log('✅ Favorite removed successfully');
                            // No need to alert, the list updates automatically
                        } else {
                            console.log('❌ Failed to remove favorite');
                            Alert.alert('Error', 'No se pudo eliminar el favorito');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item, index }: any) => {
        // Si no hay datos del negocio
        if (!item.business) {
            return (
                <View style={styles.card}>
                    <View style={styles.errorCard}>
                        <Ionicons name="warning-outline" size={40} color="#FF9800" />
                        <Text style={styles.errorTitle}>Negocio no disponible</Text>
                        <Text style={styles.errorText}>
                            ID: {item.business_id}
                        </Text>
                        <TouchableOpacity 
                            style={styles.removeButton}
                            onPress={() => handleRemoveFavorite(item.business_id, 'este negocio')}
                        >
                            <Text style={styles.removeButtonText}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        const business = item.business;
        const businessName = business.name || 'Sin nombre';
        const businessImage = business.main_image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop';
        const rating = business.average_rating;
        const city = business.city;

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => {
                    console.log('👉 Navigating to business:', business.id);
                    router.push({
                        pathname: '/detail',
                        params: { 
                            businessId: business.id, 
                            businessName: businessName 
                        }
                    });
                }}
            >
                <Image 
                    source={{ uri: businessImage }} 
                    style={styles.image}
                />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.name} numberOfLines={2}>
                            {businessName}
                        </Text>
                        <TouchableOpacity 
                            onPress={() => handleRemoveFavorite(item.business_id, businessName)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons name="heart" size={24} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.footer}>
                        {rating !== null && rating !== undefined && typeof rating === 'number' && (
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={16} color="#FFB800" />
                                <Text style={styles.rating}>
                                    {rating.toFixed(1)}
                                </Text>
                            </View>
                        )}
                        {city && (
                            <View style={styles.locationContainer}>
                                <Ionicons name="location-outline" size={14} color="#666" />
                                <Text style={styles.location}>{city}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={80} color="#CCC" />
            <Text style={styles.emptyTitle}>No tienes favoritos</Text>
            <Text style={styles.emptyText}>
                Comienza a explorar y guarda tus lugares favoritos
            </Text>

            <TouchableOpacity style={styles.reloadButton} onPress={onRefresh}>
                <Ionicons name="refresh" size={20} color="#FFF" />
                <Text style={styles.reloadText}>Recargar</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mis favoritos</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#003D7A" />
                    <Text style={styles.loadingText}>Cargando favoritos...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Mis favoritos ({favorites?.length || 0})
                </Text>
                <TouchableOpacity onPress={onRefresh}>
                    <Ionicons name="refresh" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={(item, index) => item?.id || `fav-${index}`}
                contentContainerStyle={[
                    styles.list,
                    favorites.length === 0 && styles.listEmpty
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#003D7A']}
                        tintColor="#003D7A"
                    />
                }
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
    listEmpty: {
        flexGrow: 1,
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
    errorCard: {
        padding: 24,
        alignItems: 'center',
    },
    errorTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF9800',
        marginTop: 12,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 16,
    },
    removeButton: {
        backgroundColor: '#FF3B30',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    removeButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    image: {
        width: '100%',
        height: 180,
        backgroundColor: '#E0E0E0',
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },
    reloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#003D7A',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    reloadText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});