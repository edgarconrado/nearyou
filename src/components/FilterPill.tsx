import Colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface FilterPillProps {
  label: string;
  icon?: string;              // <-- nuevo
  isActive?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export default function FilterPill({
  label,
  icon,
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
      {icon && (
        <Ionicons
          name={icon as any}
          size={16}
          color={isActive ? Colors.white : Colors.textPrimary}
          style={{ marginRight: 6 }}
        />
      )}
      <Text style={[styles.text, isActive && styles.textActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 36,
    flexDirection: "row",    // <-- esto permite texto + icono
    alignItems: "center",
    justifyContent: "center",
  },
  containerActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  textActive: {
    color: Colors.white,
  },
});