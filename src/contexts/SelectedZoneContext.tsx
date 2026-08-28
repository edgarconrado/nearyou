// contexts/SelectedZoneContext.tsx
// La zona activa vive aquí y no en los params de navegación, porque varias
// pantallas (pestañas incluidas) necesitan saber si ya hay una seleccionada.
//
// Se persiste para que al reabrir la app el usuario siga donde estaba.

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';

export type SelectedZone = {
    id: string;
    name: string;
    location: string;
    image?: string;
};

const STORAGE_KEY = 'nearyou.selectedZone';

type ContextValue = {
    zone: SelectedZone | null;
    /** false mientras se lee de disco: evita parpadeos al abrir la app. */
    isLoaded: boolean;
    hasZone: boolean;
    selectZone: (zone: SelectedZone) => void;
    clearZone: () => void;
};

const SelectedZoneContext = createContext<ContextValue | undefined>(undefined);

export function SelectedZoneProvider({ children }: { children: React.ReactNode }) {
    const [zone, setZone] = useState<SelectedZone | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then((raw) => {
                if (raw) setZone(JSON.parse(raw));
            })
            .catch(() => { })
            .finally(() => setIsLoaded(true));
    }, []);

    const selectZone = useCallback((next: SelectedZone) => {
        setZone(next);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => { });
    }, []);

    const clearZone = useCallback(() => {
        setZone(null);
        AsyncStorage.removeItem(STORAGE_KEY).catch(() => { });
    }, []);

    const value = useMemo(
        () => ({ zone, isLoaded, hasZone: !!zone, selectZone, clearZone }),
        [zone, isLoaded, selectZone, clearZone]
    );

    return (
        <SelectedZoneContext.Provider value={value}>
            {children}
        </SelectedZoneContext.Provider>
    );
}

export function useSelectedZone() {
    const ctx = useContext(SelectedZoneContext);
    if (!ctx) {
        throw new Error('useSelectedZone debe usarse dentro de <SelectedZoneProvider>');
    }
    return ctx;
}