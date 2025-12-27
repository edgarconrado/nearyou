import { Header } from '@/components/home/Header';
import { ZoneGrid } from '@/components/home/ZoneGrid';
import { Logo } from '@/components/shared/logo';
import { supabase, Zone } from '@/lib/supabase';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchZones();

    // Configurar suscripción en tiempo real
    const channel = supabase
      .channel('zones-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Escuchar todos los eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'zones',
        },
        (payload: RealtimePostgresChangesPayload<Zone>) => {
          handleRealtimeChange(payload);
        }
      )
      .subscribe();

    // Cleanup: cancelar suscripción cuando el componente se desmonte
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      setZones(data || []);
    } catch (err) {
      setError('Error al cargar las zonas:  ' + err);
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeChange = (payload: RealtimePostgresChangesPayload<Zone>) => {
    console.log('Cambio en tiempo real:', payload);

    switch (payload.eventType) {
      case 'INSERT':
        // Solo agregar si está activa
        if (payload.new.is_active) {
          setZones((currentZones) => {
            // Evitar duplicados
            const exists = currentZones.some(z => z.id === payload.new.id);
            if (exists) return currentZones;

            // Insertar en orden alfabético
            const newZones = [...currentZones, payload.new];
            return newZones.sort((a, b) => a.name.localeCompare(b.name));
          });
        }
        break;

      case 'UPDATE':
        setZones((currentZones) => {
          // Si la zona se desactivó, removerla
          if (!payload.new.is_active) {
            return currentZones.filter(z => z.id !== payload.new.id);
          }

          // Actualizar la zona existente
          const updated = currentZones.map(zone =>
            zone.id === payload.new.id ? payload.new : zone
          );

          // Reordenar alfabéticamente
          return updated.sort((a, b) => a.name.localeCompare(b.name));
        });
        break;

      case 'DELETE':
        setZones((currentZones) =>
          currentZones.filter(zone => zone.id !== payload.old.id)
        );
        break;
    }
  };

  const handleZonePress = (zone: Zone) => {
    router.push({
      pathname: '/explore',
      params: {
        zoneId: zone.id,
        zoneName: zone.name,
        zoneLocation: zone.state,
        zoneImage: zone.image_url || '',
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003D7A" />
      <Header />

      <Logo
        version='Versión 1.0.3'
        slogan='Descubre, explora y comparte experiencias'
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Explora por Zona</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#003D7A" />
            <Text style={styles.loadingText}>Cargando zonas...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.retryText} onPress={fetchZones}>
              Intentar nuevamente
            </Text>
          </View>
        ) : zones.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay zonas disponibles</Text>
          </View>
        ) : (
          <ZoneGrid zones={zones} onZonePress={handleZonePress} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 12,
  },
  retryText: {
    fontSize: 16,
    color: '#003D7A',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});