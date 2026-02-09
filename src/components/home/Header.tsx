import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export function Header({ showBackButton = false, onBackPress }: HeaderProps = {}) {
  return (
    <View style={styles.header}>
      <View style={styles.content}>
        {/* Logo/Icono lado izquierdo */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            {/* <Text style={styles.logoIcon}>🏖️</Text> */}
            <Ionicons name="location" size={16} color="#FFFF" />
          </View>
        </View>

        {/* Información central */}
        <View style={styles.infoSection}>
          <Text style={styles.appName}>NearYou</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.versionBadge}>v1.0.8r2</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.subtitle}>Explora México</Text>
          </View>
        </View>

        {/* Botón de menú o back */}
        <View style={styles.actionSection}>
          {showBackButton ? (
            <TouchableOpacity style={styles.iconButton} onPress={onBackPress}>
              <Text style={styles.iconText}>←</Text>
            </TouchableOpacity>
          ) : (
            <View />
/*             <TouchableOpacity style={styles.iconButton}>
              <View style={styles.menuIcon}>
                <View style={styles.menuDot} />
                <View style={styles.menuDot} />
                <View style={styles.menuDot} />
              </View>
            </TouchableOpacity> */
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#003D7A',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoSection: {
    marginRight: 12,
  },
  logoCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoIcon: {
    fontSize: 24,
  },
  infoSection: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  separator: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 6,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#B8D4F1',
  },
  actionSection: {
    marginLeft: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  menuIcon: {
    flexDirection: 'column',
    gap: 3,
  },
  menuDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
});