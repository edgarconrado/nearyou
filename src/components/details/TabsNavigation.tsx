import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TabsNavigationProps {
    selectedTab: 'about' | 'reviews';
    onTabChange: (tab: 'about' | 'reviews') => void;
    reviewsCount: number;
}

export const TabsNavigation: React.FC<TabsNavigationProps> = ({
    selectedTab,
    onTabChange,
    reviewsCount,
}) => {
    return (
        <View style={styles.tabsContainer}>
            <TouchableOpacity
                style={[styles.tab, selectedTab === 'about' && styles.tabActive]}
                onPress={() => onTabChange('about')}
            >
                <Text style={[styles.tabText, selectedTab === 'about' && styles.tabTextActive]}>
                    Acerca de
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.tab, selectedTab === 'reviews' && styles.tabActive]}
                onPress={() => onTabChange('reviews')}
            >
                <Text style={[styles.tabText, selectedTab === 'reviews' && styles.tabTextActive]}>
                    Opiniones ({reviewsCount})
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        marginTop: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#003D7A',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#999',
    },
    tabTextActive: {
        color: '#003D7A',
    },
});