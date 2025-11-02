import Colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import PrimaryButton from "./PrimaryButton";


interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title?: string;
    message?: string;
    actionLabel?: string;
    onAction?: () => void;
    style?: ViewStyle;
}

export default function EmptyState({
    icon = 'search',
    title = 'No hay resultados',
    message = 'No se encontraron elementos',
    actionLabel,
    onAction,
    style
}: EmptyStateProps) {
    return (
        <View style={[styles.container, style]}>
            <Ionicons name={icon} size={64} color={Colors.gray} />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
            {actionLabel && onAction && (
                <PrimaryButton
                    title={actionLabel}
                    onPress={onAction}
                    style={styles.button}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginTop: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 8,
        textAlign: 'center',
    },
    button: {
        marginTop: 24,
        paddingHorizontal: 32,
    },
});