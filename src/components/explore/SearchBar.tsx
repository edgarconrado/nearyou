import { hairline, palette, radius, spacing, type } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar = ({
  searchQuery,
  onChangeText,
  onClear,
  placeholder = 'Buscar en esta zona',
}: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Ionicons name="search" size={18} color={palette.ink} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={palette.muted}
          value={searchQuery}
          onChangeText={onChangeText}
          returnKeyType="search"
          autoCorrect={false}
          clearButtonMode="never"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={onClear} hitSlop={10} accessibilityLabel="Borrar búsqueda">
            <Ionicons name="close-circle" size={18} color={palette.muted} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    height: 48,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: hairline,
    borderColor: palette.border,
    backgroundColor: palette.white,
  },
  input: {
    ...type.small,
    color: palette.ink,
    flex: 1,
    paddingVertical: 0,
  },
});
