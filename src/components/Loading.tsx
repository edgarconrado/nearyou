import Colors from "@/constants/colors";
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from "react-native";

interface LoadingProps {
    message?: string;
    fullScreen?: boolean;
    style?: ViewStyle;
}

export default function Loading({
    message = 'Cargando...',
    fullScreen = false,
    style
}: LoadingProps) {
    if (fullScreen) {
        return (
            <View style={styles.fullScreen}>
                <ActivityIndicator size="large" color={Colors.primary} />
                {message && <Text style={styles.message}>{message}</Text>}
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size="large" color={Colors.primary} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    message: {
        marginTop: 16,
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
});