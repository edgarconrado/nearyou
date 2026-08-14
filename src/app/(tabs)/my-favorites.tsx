import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFavorites } from '@/hooks/use-favorites';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyFavoritesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { t } = useLanguage();
    const { favorites, loading, removeFavorite, refetch } = useFavorites();
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleRemove = (businessId: string, businessName: string) => {
        Alert.alert(
            t('favorites.remove'),
            t('favorites.removeConfirm').replace('{{name}}', businessName),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('favorites.removeButton'),
                    style: 'destructive',
                    onPress: async () => {
                        const ok = await removeFavorite(businessId);
                        if (!ok) Alert.alert(t('common.error'), t('favorites.error'));
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }: any) => {
        // El negocio pudo haber sido eliminado: el favorito queda huérfano
        if (!item.business) {
            return (
                <View style={styles.orphan}>
                    <Text style={styles.orphanTitle}>
                        {t('favorites.businessNotAvailable')}
                    </Text>
                    <Pressable
                        onPress={() =>
                            handleRemove(item.business_id, t('favorites.businessNotAvailable'))
                        }
                        style={({ pressed }) => [styles.orphanButton, pressed && styles.pressedSoft]}
                    >
                        <Text style={styles.orphanButtonText}>{t('favorites.removeButton')}</Text>
                    </Pressable>
                </View>
            );
        }

        const business = item.business;
        const name = business.name || 'Sin nombre';
        const rating = business.average_rating;

        return (
            <Pressable
                onPress={() =>
                    router.push({
                        pathname: '/detail',
                        params: { businessId: business.id, businessName: name },
                    })
                }
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
                <View style={styles.imageWrap}>
                    {business.main_image_url ? (
                        <Image
                            source={{ uri: business.main_image_url }}
                            style={styles.image}
                            contentFit="cover"
                            transition={180}
                        />
                    ) : (
                        <View style={styles.placeholder}>
                            <Ionicons name="image-outline" size={28} color={palette.faint} />
                        </View>
                    )}

                    <Pressable
                        onPress={() => handleRemove(item.business_id, name)}
                        hitSlop={10}
                        accessibilityLabel={t('favorites.remove')}
                        style={styles.heart}
                    >
                        <Ionicons
                            name="heart"
                            size={24}
                            color={palette.accent}
                            style={styles.heartIcon}
                        />
                    </Pressable>
                </View>

                <View style={styles.body}>
                    <View style={styles.titleRow}>
                        <Text style={styles.name} numberOfLines={1}>
                            {name}
                        </Text>
                        {typeof rating === 'number' && (
                            <View style={styles.rating}>
                                <Ionicons name="star" size={12} color={palette.ink} />
                                <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.meta} numberOfLines={1}>
                        {[business.category_name, business.city].filter(Boolean).join(' · ')}
                    </Text>
                </View>
            </Pressable>
        );
    };

    const renderEmpty = () => (
        <View style={styles.empty}>
            <Ionicons name="heart-outline" size={48} color={palette.faint} />
            <Text style={styles.emptyTitle}>{t('favorites.empty')}</Text>
            <Text style={styles.emptyText}>{t('favorites.emptyDescription')}</Text>
            <Pressable
                onPress={() => router.push('/explore')}
                style={({ pressed }) => [styles.exploreButton, pressed && styles.pressedSoft]}
            >
                <Text style={styles.exploreText}>Explorar lugares</Text>
            </Pressable>
        </View>
    );

    return (
        <View style={styles.screen}>
            <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
                <Text style={styles.title}>{t('favorites.title')}</Text>
                {favorites.length > 0 && (
                    <Text style={styles.count}>
                        {favorites.length === 1
                            ? '1 lugar guardado'
                            : `${favorites.length} lugares guardados`}
                    </Text>
                )}
            </View>

            {loading && favorites.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator color={palette.ink} />
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => item?.id || `fav-${index}`}
                    contentContainerStyle={[
                        styles.list,
                        favorites.length === 0 && styles.listEmpty,
                    ]}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={palette.muted}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: palette.white },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    header: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        borderBottomWidth: hairline,
        borderBottomColor: palette.border,
    },
    title: { ...type.title },
    count: { ...type.small, marginTop: 2 },

    list: { padding: spacing.lg },
    listEmpty: { flexGrow: 1 },
    separator: { height: spacing.xl },

    card: { width: '100%' },
    pressed: { opacity: 0.8 },
    pressedSoft: { backgroundColor: palette.surface },

    imageWrap: {
        width: '100%',
        aspectRatio: 4 / 3,
        borderRadius: radius.md,
        overflow: 'hidden',
        backgroundColor: palette.skeleton,
    },
    image: { width: '100%', height: '100%' },
    placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    heart: { position: 'absolute', top: spacing.sm, right: spacing.sm, padding: spacing.xs },
    heartIcon: {
        textShadowColor: 'rgba(0, 0, 0, 0.35)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },

    body: { paddingTop: spacing.md, gap: 2 },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    name: { ...type.bodyStrong, flex: 1 },
    rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    ratingText: { ...type.smallStrong },
    meta: { ...type.small },

    orphan: {
        padding: spacing.lg,
        borderWidth: hairline,
        borderColor: palette.border,
        borderRadius: radius.md,
        alignItems: 'center',
        gap: spacing.md,
    },
    orphanTitle: { ...type.small, textAlign: 'center' },
    orphanButton: {
        height: 40,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: palette.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orphanButtonText: { ...type.captionStrong, color: palette.danger },

    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
        gap: spacing.sm,
    },
    emptyTitle: { ...type.subheading, textAlign: 'center', marginTop: spacing.md },
    emptyText: { ...type.small, textAlign: 'center' },
    exploreButton: {
        marginTop: spacing.lg,
        height: 48,
        paddingHorizontal: spacing.xl,
        borderRadius: radius.sm,
        borderWidth: 1,
        borderColor: palette.ink,
        alignItems: 'center',
        justifyContent: 'center',
    },
    exploreText: { ...type.smallStrong, fontSize: 15 },
});