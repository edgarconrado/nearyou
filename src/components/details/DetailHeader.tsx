import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DetailHeaderProps {
    businessName: string;
    onBack: () => void;
    onShare: () => void;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
    businessName,
    onBack,
    onShare,
}) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={onBack}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
                {businessName}
            </Text>
            <TouchableOpacity style={styles.headerButton} onPress={onShare}>
                <Ionicons name="share-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#003D7A',
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginHorizontal: 8,
    },
});