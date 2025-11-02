import Colors from "@/constants/colors";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface FilterPillProps {
    label: string;
    isActive?: boolean;
    onPress: () => void;
    style?: ViewStyle;
}

export default function FilterPill({
    label,
    isActive = false,
    onPress,
    style
}: FilterPillProps) {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                isActive && styles.containerActive,
                style
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[
                styles.text,
                isActive && styles.textActive
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    textActive: {
        color: Colors.white,
    },
});