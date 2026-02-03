// components/explore/ZoneInfoButton.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface ZoneInfoButtonProps {
  onPress: () => void;
}

export function ZoneInfoButton({ onPress }: ZoneInfoButtonProps) {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed
      ]}
      onPress={onPress}
    >
      <Ionicons name="information-circle" size={20} color="#FFF" />
      <Text style={styles.buttonText}>Sobre este lugar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#003D7A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  buttonPressed: {
    backgroundColor: '#002A5A',
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});