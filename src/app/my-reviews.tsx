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

export default function MyReviewsScreen() {
    const router = useRouter();
    const { t } = useLanguage();

    const reviews = [
        {
            id: 1,
            businessName: 'Restaurant El Mirador',
            businessImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
            rating: 5,
            comment: 'Excelente servicio y comida deliciosa. Totalmente recomendado.',
            date: '15 Dic 2024',
        },
        {
            id: 2,
            businessName: 'Café Aroma',
            businessImage: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',
            rating: 4,
            comment: 'Buen ambiente y café de calidad. El servicio podría mejorar.',
            date: '10 Dic 2024',
        },
    ];

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Ionicons
                key={i}
                name={i < rating ? 'star' : 'star-outline'}
                size={16}
                color={palette.ink}
            />
        ));
    };

    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Image source={{ uri: item.businessImage }} style={styles.thumbnail} />
                <View style={styles.businessInfo}>
                    <Text style={styles.businessName}>{item.businessName}</Text>
                    <View style={styles.starsRow}>{renderStars(item.rating)}</View>
                    <Text style={styles.date}>{item.date}</Text>
                </View>
            </View>
            <Text style={styles.comment}>{item.comment}</Text>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="create-outline" size={18} color={palette.ink} />
                    <Text style={styles.actionText}>{t('reviews.edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="trash-outline" size={18} color={palette.danger} />
                    <Text style={[styles.actionText, { color: palette.danger }]}>{t('reviews.delete')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="star-outline" size={80} color={palette.faint} />
            <Text style={styles.emptyTitle}>{t('reviews.noReviews')}</Text>
            <Text style={styles.emptyText}>{t('reviews.noReviewsDesc')}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={palette.ink} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('reviews.title')}</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={reviews}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[
                    styles.list,
                    reviews.length === 0 && styles.listEmpty
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
    list: {
        padding: 16,
    },
    listEmpty: {
        flexGrow: 1,
    },
    card: {
        backgroundColor: palette.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    businessInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    businessName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: palette.ink,
        marginBottom: 4,
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: palette.muted,
    },
    comment: {
        fontSize: 14,
        color: palette.muted,
        lineHeight: 20,
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: palette.ink,
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