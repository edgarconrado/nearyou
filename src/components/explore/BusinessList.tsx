import { palette, radius, spacing, type } from '@/constants/design';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BusinessCard, type BusinessListItem } from './BusinessCard';

interface BusinessListProps {
  businesses: BusinessListItem[];
  loading?: boolean;
  error?: string | null;
  onBusinessPress: (business: BusinessListItem) => void;
  onRetry?: () => void;
}

export const BusinessList: React.FC<BusinessListProps> = ({
  businesses,
  loading = false,
  error = null,
  onBusinessPress,
  onRetry,
}) => {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={palette.ink} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>No pudimos cargar los lugares</Text>
        <Text style={styles.errorBody}>{error}</Text>
        {onRetry && (
          <Pressable
            onPress={onRetry}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>Reintentar</Text>
          </Pressable>
        )}
      </View>
    );
  }

  if (businesses.length === 0) return null;

  // Con un número impar de resultados, la última tarjeta se estiraría a todo
  // el ancho (flex: 1 sin pareja en su fila). Una celda vacía la empareja.
  const data: (BusinessListItem | null)[] =
    businesses.length % 2 === 1 ? [...businesses, null] : businesses;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) =>
        item ? (
          <BusinessCard business={item} onPress={() => onBusinessPress(item)} />
        ) : (
          <View style={styles.filler} />
        )
      }
      keyExtractor={(item, index) => (item ? String(item.id) : `filler-${index}`)}
      numColumns={2}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={styles.content}
    />
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
    // Separación vertical entre filas
    rowGap: spacing.xl,
  },
  row: {
    // Separación horizontal entre las dos columnas
    columnGap: spacing.md,
  },
  filler: {
    flex: 1,
  },
  center: {
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  errorTitle: {
    ...type.subheading,
    textAlign: 'center',
  },
  errorBody: {
    ...type.small,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.lg,
    height: 48,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: palette.surface,
  },
  buttonText: {
    ...type.smallStrong,
    fontSize: 15,
  },
});