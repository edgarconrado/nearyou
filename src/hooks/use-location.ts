// hooks/useLocation.ts
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export interface UserLocation {
    latitude: number;
    longitude: number;
    accuracy: number | null;
}

export function useLocation() {
    const [location, setLocation] = useState<UserLocation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);

    useEffect(() => {
        requestLocationPermission();
    }, []);

    const requestLocationPermission = async () => {
        try {
            setLoading(true);
            setError(null);

            // Verificar permisos actuales
            const { status: currentStatus } = await Location.getForegroundPermissionsAsync();
            setPermissionStatus(currentStatus);

            if (currentStatus !== Location.PermissionStatus.GRANTED) {
                // Solicitar permisos
                const { status: newStatus } = await Location.requestForegroundPermissionsAsync();
                setPermissionStatus(newStatus);

                if (newStatus !== Location.PermissionStatus.GRANTED) {
                    setError('Permiso de ubicación denegado');
                    setLoading(false);
                    return;
                }
            }

            // Obtener ubicación actual
            await getCurrentLocation();
        } catch (err) {
            console.error('Error requesting location permission:', err);
            setError('Error al obtener permisos de ubicación');
            setLoading(false);
        }
    };

    const getCurrentLocation = async () => {
        try {
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
                accuracy: currentLocation.coords.accuracy,
            });

            setError(null);
        } catch (err) {
            console.error('Error getting current location:', err);
            setError('No se pudo obtener la ubicación actual');
        } finally {
            setLoading(false);
        }
    };

    const refreshLocation = async () => {
        setLoading(true);
        await getCurrentLocation();
    };

    return {
        location,
        loading,
        error,
        permissionStatus,
        hasPermission: permissionStatus === Location.PermissionStatus.GRANTED,
        refreshLocation,
        requestPermission: requestLocationPermission,
    };
}