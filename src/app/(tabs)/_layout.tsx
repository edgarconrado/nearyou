import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { hairline, palette } from '@/constants/design';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSelectedZone } from '@/contexts/SelectedZoneContext';
import { Ionicons } from '@expo/vector-icons';

/**
 * Barra de pestañas al estilo Airbnb: iconos outline, activo en acento,
 * inactivo en gris, etiqueta pequeña y un solo hairline arriba.
 */
export default function TabLayout() {
    const { t } = useLanguage();
    const { hasZone } = useSelectedZone();

    /**
     * Explorar y Favoritos dependen de una zona activa. Mientras no haya
     * ninguna, las pestañas se ven en gris claro y no responden al toque:
     * es más claro que dejarlas navegables y mostrar una pantalla vacía.
     */
    const lockedOptions = hasZone
        ? {}
        : {
            tabBarButton: (props: any) => (
                <HapticTab
                    {...props}
                    disabled
                    onPress={undefined}
                    onPressIn={undefined}
                    accessibilityState={{ ...props.accessibilityState, disabled: true }}
                />
            ),
            tabBarItemStyle: { opacity: 0.35 },
        };

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarActiveTintColor: palette.accent,
                tabBarInactiveTintColor: palette.muted,
                tabBarStyle: {
                    backgroundColor: palette.white,
                    borderTopWidth: hairline,
                    borderTopColor: palette.border,
                    elevation: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '600',
                    marginTop: 2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('tabs.home'),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'search' : 'search-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="explore"
                options={{
                    ...lockedOptions,
                    title: t('tabs.explore'),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'compass' : 'compass-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="my-favorites"
                options={{
                    ...lockedOptions,
                    title: t('tabs.favorites'),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'heart' : 'heart-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: t('tabs.profile'),
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'person-circle' : 'person-circle-outline'}
                            size={24}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}