import React from 'react';
import { StyleSheet, View } from 'react-native';

interface FloatingReserveButtonProps {
    onPress: () => void;
}

export const FloatingReserveButton: React.FC<FloatingReserveButtonProps> = ({
    onPress,
}) => {
    return (
        <View style={styles.floatingButton}>
            {/* <TouchableOpacity style={styles.reserveButton} onPress={onPress}>
                <Ionicons name="calendar" size={20} color="#FFFFFF" />
                <Text style={styles.reserveButtonText}>Hacer reservación</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    reserveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#003D7A',
        paddingVertical: 14,
        borderRadius: 12,
    },
    reserveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});