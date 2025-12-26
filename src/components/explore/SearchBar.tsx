import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
    searchQuery: string;
    onChangeText: (text: string) => void;
    onClear: () => void;
}

export const SearchBar = ({
    searchQuery,
    onChangeText,
    onClear,
}: SearchBarProps) => {
    return (
        <View style={styles.searchContainer}>
            <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color="#999" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar negocios, restaurantes, hoteles..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={onChangeText}
                    returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={onClear}>
                        <Ionicons name="close-circle" size={20} color="#999" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        paddingVertical: 0,
    },
});