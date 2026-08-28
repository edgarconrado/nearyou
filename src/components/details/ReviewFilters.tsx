import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

interface ReviewFiltersProps {
    reviewFilter: number | 'all';
    onFilterChange: (filter: number | 'all') => void;
}

/** Chips con borde; el activo se invierte a fondo tinta. */
export const ReviewFilters: React.FC<ReviewFiltersProps> = ({
    reviewFilter,
    onFilterChange,
}) => {
    const { t } = useLanguage();

    const options: (number | 'all')[] = ['all', 5, 4, 3, 2, 1];

    return (
        <View style={styles.container}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.row}>
                    {options.map((option) => {
                        const active = reviewFilter === option;
                        return (
                            <Pressable
                                key={String(option)}
                                onPress={() => onFilterChange(option)}
                                accessibilityRole="button"
                                accessibilityState={{ selected: active }}
                                style={({ pressed }) => [
                                    styles.chip,
                                    active && styles.chipActive,
                                    pressed && styles.pressed,
                                ]}
                            >
                                {option !== 'all' && (
                                    <Ionicons
                                        name="star"
                                        size={13}
                                        color={active ? palette.white : palette.ink}
                                    />
                                )}
                                <Text style={[styles.text, active && styles.textActive]}>
                                    {option === 'all' ? t('detail.all') : option}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: spacing.lg },
    row: { flexDirection: 'row', gap: spacing.sm },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.lg,
        height: 34,
        borderRadius: radius.pill,
        borderWidth: hairline,
        borderColor: palette.border,
    },
    chipActive: { backgroundColor: palette.ink, borderColor: palette.ink },
    pressed: { opacity: 0.7 },
    text: { ...type.caption, color: palette.ink, fontWeight: '600' },
    textActive: { color: palette.white },
});