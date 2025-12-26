import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BusinessHours } from '../../types/types';

interface HoursSectionProps {
    businessHours: BusinessHours[];
}

export const HoursSection: React.FC<HoursSectionProps> = ({ businessHours }) => {
    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Ionicons name="time" size={24} color="#003D7A" />
                <Text style={styles.sectionTitle}>Horarios</Text>
            </View>

            <View style={styles.hoursContainer}>
                {businessHours.map((schedule, index) => (
                    <View
                        key={index}
                        style={[styles.hourRow, schedule.isToday && styles.hourRowToday]}
                    >
                        <Text style={[styles.dayText, schedule.isToday && styles.dayTextToday]}>
                            {schedule.day}
                        </Text>
                        <Text style={[styles.hoursText, schedule.isToday && styles.hoursTextToday]}>
                            {schedule.hours}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        marginTop: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    hoursContainer: {
        gap: 12,
    },
    hourRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    hourRowToday: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    dayText: {
        fontSize: 15,
        color: '#666',
    },
    dayTextToday: {
        fontWeight: '600',
        color: '#003D7A',
    },
    hoursText: {
        fontSize: 15,
        color: '#666',
    },
    hoursTextToday: {
        fontWeight: '600',
        color: '#003D7A',
    },
});