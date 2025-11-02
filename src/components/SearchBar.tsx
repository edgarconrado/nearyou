import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';

interface SearchBarProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
    style?: ViewStyle;
    editable?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
}

export default function SearchBar({
    value = '',
    onChangeText,
    placeholder = 'Buscar...',
    onClear,
    style,
    editable = true,
    onFocus,
    onBlur
}: SearchBarProps) {
    const handleClear = () => {
        if (onClear) {
            onClear();
        } else if (onChangeText) {
            onChangeText('');
        }
    };

    return (
        <View style={[styles.container, style]}>
            <Ionicons name="search" size={20} color={Colors.gray} />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={Colors.gray}
                value={value}
                onChangeText={onChangeText}
                editable={editable}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            {value && value.length > 0 && (
                <TouchableOpacity onPress={handleClear}>
                    <Ionicons name="close-circle" size={20} color={Colors.gray} />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        ...Colors.shadow,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 15,
        color: Colors.textPrimary,
    },
});