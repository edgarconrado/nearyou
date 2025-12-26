import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuickActionsProps {
    onCall: () => void;
    onDirections: () => void;
    onWebsite: () => void;
    onShare: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    onCall,
    onDirections,
    onWebsite,
    onShare,
}) => {
    return (
        <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} onPress={onCall}>
                <Ionicons name="call" size={24} color="#003D7A" />
                <Text style={styles.actionText}>Llamar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onDirections}>
                <Ionicons name="navigate" size={24} color="#003D7A" />
                <Text style={styles.actionText}>Cómo llegar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onWebsite}>
                <Ionicons name="globe" size={24} color="#003D7A" />
                <Text style={styles.actionText}>Sitio web</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onShare}>
                <Ionicons name="share-social" size={24} color="#003D7A" />
                <Text style={styles.actionText}>Compartir</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    quickActions: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    actionButton: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 12,
        color: '#003D7A',
        fontWeight: '600',
    },
});