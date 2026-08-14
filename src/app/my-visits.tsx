import { hairline, palette, spacing } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
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

export default function MyVisitsScreen() {
    const router = useRouter();
    const { t } = useLanguage();

    const visits = [
        {
            id: 1,
            name: 'Restaurant El Mirador',
            category: 'Restaurante',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
            visitDate: '20 Dic 2024',
            location: 'Pátzcuaro, Michoacán',
        },
        {
            id: 2,
            name: 'Museo Regional',
            category: 'Atracción',
            image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
            visitDate: '15 Dic 2024',
            location: 'Morelia, Michoacán',
        },
        {
            id: 3,
            name: 'Café Aroma',
            category: 'Cafetería',
            image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',
            visitDate: '10 Dic 2024',
            location: 'Pátzcuaro, Michoacán',
        },
        {
            id: 4,
            name: 'Hotel Vista Hermosa',
            category: 'Hotel',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
            visitDate: '5 Dic 2024',
            location: 'Uruapan, Michoacán',
        },
    ];

    const renderItem = ({ item }: any) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => router.push({
                pathname: '/business-details',
                params: { businessId: item.id, businessName: item.name }
            })}
        >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.category}>{item.category}</Text>
                <View style={styles.footer}>
                    <View style={styles.dateContainer}>
                        <Ionicons name="calendar-outline" size={14} color={palette.muted} />
                        <Text style={styles.date}>{item.visitDate}</Text>
                    </View>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location-outline" size={14} color={palette.muted} />
                        <Text style={styles.location}>{item.location}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={80} color={palette.faint} />
            <Text style={styles.emptyTitle}>{t('visits.noVisits')}</Text>
            <Text style={styles.emptyText}>{t('visits.noVisitsDesc')}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={palette.ink} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('visits.title')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{visits.length}</Text>
                    <Text style={styles.statLabel}>{t('visits.totalVisits')}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>3</Text>
                    <Text style={styles.statLabel}>{t('visits.thisMonth')}</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>{t('visits.thisYear')}</Text>
                </View>
            </View>

            <FlatList
                data={visits}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[
                    styles.list,
                    visits.length === 0 && styles.listEmpty
                ]}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: palette.white,
        borderBottomWidth: hairline,
        borderBottomColor: palette.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: palette.ink,
    },
    statsBar: {
        flexDirection: 'row',
        backgroundColor: palette.white,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: palette.ink,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: palette.muted,
    },
    statDivider: {
        width: 1,
        backgroundColor: palette.border,
    },
    list: {
        padding: 16,
    },
    listEmpty: {
        flexGrow: 1,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: palette.white,
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: 100,
        height: 100,
    },
    cardContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: palette.ink,
        marginBottom: 4,
    },
    category: {
        fontSize: 13,
        color: palette.muted,
        marginBottom: 8,
    },
    footer: {
        gap: 4,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    date: {
        fontSize: 12,
        color: palette.muted,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    location: {
        fontSize: 12,
        color: palette.muted,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingTop: 100,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: palette.ink,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: palette.muted,
        textAlign: 'center',
    },
});