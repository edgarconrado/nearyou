import { hairline, palette, spacing, type } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface AboutTabProps {
    phone: string;
    email: string;
    website: string;
    onCall: () => void;
    onEmail: () => void;
    onWebsite: () => void;
}

/** Contacto en filas con hairline; los datos vacíos no se muestran. */
export const AboutTab: React.FC<AboutTabProps> = ({
    phone,
    email,
    website,
    onCall,
    onEmail,
    onWebsite,
}) => {
    const rows = [
        { key: 'phone', icon: 'call-outline', value: phone, onPress: onCall },
        { key: 'email', icon: 'mail-outline', value: email, onPress: onEmail },
        { key: 'website', icon: 'globe-outline', value: website, onPress: onWebsite },
    ].filter((r) => !!r.value);

    if (rows.length === 0) return null;

    return (
        <View style={styles.section}>
            {rows.map((row, i) => (
                <Pressable
                    key={row.key}
                    onPress={row.onPress}
                    style={({ pressed }) => [
                        styles.row,
                        i < rows.length - 1 && styles.divider,
                        pressed && styles.pressed,
                    ]}
                >
                    <Ionicons name={row.icon as any} size={20} color={palette.ink} />
                    <Text style={styles.value} numberOfLines={1}>
                        {row.value}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={palette.faint} />
                </Pressable>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    section: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
        paddingVertical: spacing.lg,
    },
    divider: { borderBottomWidth: hairline, borderBottomColor: palette.borderSoft },
    pressed: { opacity: 0.55 },
    value: { ...type.body, flex: 1 },
});