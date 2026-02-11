import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuickActionsProps {
    hasPhone?: boolean;
    hasWebsite?: boolean;
    hasCoordinates?: boolean;
    onCall: () => void;
    onWebsite: () => void;
    onDirections: () => void;
    onShare: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
    hasPhone = true,
    hasWebsite = true,
    hasCoordinates = true,
    onCall,
    onWebsite,
    onDirections,
    onShare,
}) => {
    return (
        <View style={styles.quickActions}>
            {/* Llamar */}
            <TouchableOpacity 
                style={[
                    styles.actionButton,
                    !hasPhone && styles.actionButtonDisabled
                ]}
                onPress={onCall}
                disabled={!hasPhone}
            >
                <View style={[
                    styles.actionIconContainer,
                    !hasPhone && styles.actionIconContainerDisabled
                ]}>
                    <Ionicons 
                        name="call" 
                        size={24} 
                        color={hasPhone ? "#003D7A" : "#999"}
                    />
                </View>
                <Text style={[
                    styles.actionText,
                    !hasPhone && styles.actionTextDisabled
                ]}>
                    Llamar
                </Text>
            </TouchableOpacity>

            {/* Sitio web */}
            <TouchableOpacity 
                style={[
                    styles.actionButton,
                    !hasWebsite && styles.actionButtonDisabled
                ]}
                onPress={onWebsite}
                disabled={!hasWebsite}
            >
                <View style={[
                    styles.actionIconContainer,
                    !hasWebsite && styles.actionIconContainerDisabled
                ]}>
                    <Ionicons 
                        name="globe-outline" 
                        size={24} 
                        color={hasWebsite ? "#003D7A" : "#999"}
                    />
                </View>
                <Text style={[
                    styles.actionText,
                    !hasWebsite && styles.actionTextDisabled
                ]}>
                    Sitio web
                </Text>
            </TouchableOpacity>

            {/* Direcciones */}
            <TouchableOpacity 
                style={[
                    styles.actionButton,
                    !hasCoordinates && styles.actionButtonDisabled
                ]}
                onPress={onDirections}
                disabled={!hasCoordinates}
            >
                <View style={[
                    styles.actionIconContainer,
                    !hasCoordinates && styles.actionIconContainerDisabled
                ]}>
                    <Ionicons 
                        name="navigate" 
                        size={24} 
                        color={hasCoordinates ? "#003D7A" : "#999"}
                    />
                </View>
                <Text style={[
                    styles.actionText,
                    !hasCoordinates && styles.actionTextDisabled
                ]}>
                    Cómo llegar
                </Text>
            </TouchableOpacity>

            {/* Compartir - Siempre habilitado */}
            <TouchableOpacity 
                style={styles.actionButton}
                onPress={onShare}
            >
                <View style={styles.actionIconContainer}>
                    <Ionicons 
                        name="share-social" 
                        size={24} 
                        color="#003D7A"
                    />
                </View>
                <Text style={styles.actionText}>Compartir</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    actionButton: {
        alignItems: 'center',
        flex: 1,
    },
    actionButtonDisabled: {
        opacity: 0.5,
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionIconContainerDisabled: {
        backgroundColor: '#F5F5F5',
    },
    actionText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
    },
    actionTextDisabled: {
        color: '#999',
    },
});