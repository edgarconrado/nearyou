// components/explore/ExploreHeaderSection.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FloatingLocationBadge } from './FloatingLocationBadge';
import { ZoneInfoButton } from './ZoneInfoButton';

interface ExploreHeaderSectionProps {
  businessCount: number;
  showZoneInfo: boolean;
  onZoneInfoPress: () => void;
}

export function ExploreHeaderSection({ 
  businessCount, 
  showZoneInfo, 
  onZoneInfoPress 
}: ExploreHeaderSectionProps) {
  return (
    <View style={styles.container}>
      <FloatingLocationBadge businessCount={businessCount} />
      
      {showZoneInfo && (
        <View style={styles.buttonWrapper}>
          <ZoneInfoButton onPress={onZoneInfoPress} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  buttonWrapper: {
    marginTop: 8,
  },
});