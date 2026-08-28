import Colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";


type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type IconPosition = 'left' | 'right';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: IconPosition;
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function PrimaryButton({
    title,
    onPress,
    variant = 'primary',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    style,
    textStyle
}: PrimaryButtonProps) {
    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondary;
            case 'outline':
                return styles.outline;
            case 'danger':
                return styles.danger;
            default:
                return styles.primary;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline':
                return styles.textOutline;
            case 'danger':
                return styles.textDanger;
            default:
                return styles.textPrimary;
        }
    };

    const iconColor = variant === 'outline' ? Colors.primary : Colors.white;

    return (
        <TouchableOpacity
            style={[
                styles.container,
                getButtonStyle(),
                disabled && styles.disabled,
                style
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={iconColor} />
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <Ionicons
                            name={icon}
                            size={20}
                            color={iconColor}
                            style={styles.iconLeft}
                        />
                    )}
                    <Text style={[getTextStyle(), textStyle]}>
                        {title}
                    </Text>
                    {icon && iconPosition === 'right' && (
                        <Ionicons
                            name={icon}
                            size={20}
                            color={iconColor}
                            style={styles.iconRight}
                        />
                    )}
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    primary: {
        backgroundColor: Colors.primary,
    },
    secondary: {
        backgroundColor: Colors.primaryMedium,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    danger: {
        backgroundColor: Colors.error,
    },
    disabled: {
        opacity: 0.5,
    },
    textPrimary: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    textOutline: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '700',
    },
    textDanger: {
        color: Colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});