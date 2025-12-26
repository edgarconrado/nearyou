import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AboutTabProps {
    phone: string;
    email: string;
    website: string;
    onCall: () => void;
    onEmail: () => void;
    onWebsite: () => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({
    phone,
    email,
    website,
    onCall,
    onEmail,
    onWebsite,
}) => {
    return (
        <View style={styles.section}>
            <View style={styles.contactInfo}>
                <TouchableOpacity style={styles.contactRow} onPress={onCall}>
                    <Ionicons name="call-outline" size={22} color="#666" />
                    <Text style={styles.contactText}>{phone}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactRow} onPress={onEmail}>
                    <Ionicons name="mail-outline" size={22} color="#666" />
                    <Text style={styles.contactText}>{email}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactRow} onPress={onWebsite}>
                    <Ionicons name="globe-outline" size={22} color="#666" />
                    <Text style={styles.contactText}>{website}</Text>
                </TouchableOpacity>
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
    contactInfo: {
        gap: 16,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    contactText: {
        fontSize: 15,
        color: '#003D7A',
    },
});