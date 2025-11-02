import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface CategoryButtonProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    style?: ViewStyle;
}

export default function CategoryButton({
    icon,
    label,
    onPress,
    style
}: CategoryButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconBox}>
                <Ionicons name={icon} size={32} color={Colors.primary} />
            </View>
            <Text style={styles.label} numberOfLines={2}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    iconBox: {
        width: 64,
        height: 64,
        backgroundColor: Colors.primaryLight,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 12,
        color: Colors.textPrimary,
        textAlign: 'center',
        fontWeight: '500',
    },
});