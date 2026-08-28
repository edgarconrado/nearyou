import { palette } from '@/constants/design';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface LogoProps {
    version: string;
    slogan: string;
}

export const Logo: React.FC<LogoProps> = ({
    version,
    slogan,
}) => {
    return (
        <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
                <Ionicons name="location" size={60} color={palette.ink} />
            </View>
            <Text style={styles.appName}>NearYou</Text>
            <Text style={styles.appVersion}>{version}</Text>
            <Text style={styles.appTagline}>
                {slogan}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    logoSection: {
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        paddingVertical: 40,
        marginBottom: 8,
    },
    logoContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: palette.ink,
        marginBottom: 4,
    },
    appVersion: {
        fontSize: 14,
        color: '#999',
        marginBottom: 12,
    },
    appTagline: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 40,
    },
});