import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface WriteReviewButtonProps {
    onPress: () => void;
}

export const WriteReviewButton: React.FC<WriteReviewButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.writeReviewButton} onPress={onPress}>
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            <Text style={styles.writeReviewButtonText}>Escribir una opinión</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    writeReviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#003D7A',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    writeReviewButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});