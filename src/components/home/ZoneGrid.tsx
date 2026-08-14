import { spacing } from '@/constants/design';
import type { Zone } from '@/services/zones.service';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ZoneCard } from './ZoneCard';

type Props = {
  zones: Zone[];
  onZonePress: (zone: Zone) => void;
};

export function ZoneGrid({ zones, onZonePress }: Props) {
  return (
    <View style={styles.grid}>
      {zones.map((zone, index) => (
        <ZoneCard key={zone.id} zone={zone} index={index} onPress={onZonePress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: spacing.md,
    rowGap: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
