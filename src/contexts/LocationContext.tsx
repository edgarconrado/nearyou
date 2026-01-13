// contexts/LocationContext.tsx
import { useLocation, UserLocation } from '@/hooks/use-location';
import type { PermissionStatus } from 'expo-location';
import React, { createContext, ReactNode, useContext } from 'react';

interface LocationContextType {
    location: UserLocation | null;
    loading: boolean;
    error: string | null;
    permissionStatus: PermissionStatus | null;
    hasPermission: boolean;
    refreshLocation: () => Promise<void>;
    requestPermission: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
    const locationData = useLocation();

    return (
        <LocationContext.Provider value={locationData}>
            {children}
        </LocationContext.Provider>
    );
}

export function useUserLocation() {
    const context = useContext(LocationContext);

    if (context === undefined) {
        throw new Error('useUserLocation must be used within a LocationProvider');
    }

    return context;
}