import { hairline, palette, spacing, type } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BusinessHours } from '../../types/types';

interface HoursSectionProps {
    businessHours: BusinessHours[];
}

/** El día de hoy se destaca con peso, no con fondo de color. */
export const HoursSection: React.FC<HoursSectionProps> = ({ businessHours }) => {
    const { t } = useLanguage();

    return (
        <View style={styles.section}>
            <Text style={styles.title}>{t('detail.schedules')}</Text>

            <View style={styles.list}>
                {businessHours.map((schedule, index) => (
                    <View key={index} style={styles.row}>
                        <Text style={[styles.day, schedule.isToday && styles.today]}>
                            {schedule.day}
                        </Text>
                        <Text style={[styles.hours, schedule.isToday && styles.today]}>
                            {schedule.hours}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
        borderTopWidth: hairline,
        borderTopColor: palette.border,
    },
    title: { ...type.heading, marginBottom: spacing.lg },
    list: { gap: spacing.md },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    day: { ...type.body, color: palette.muted },
    hours: { ...type.body, color: palette.muted },
    today: { color: palette.ink, fontWeight: '600' },
});