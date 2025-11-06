import PrimaryButton from "@/components/PrimaryButton";
import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
  feedback: string[];
}

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, label: '', color: Colors.gray, feedback: [] };
    }

    let score = 0;
    const feedback: string[] = [];

    // Longitud
    if (password.length >= 8) {
      score++;
    } else {
      feedback.push('Mínimo 8 caracteres');
    }

    // Mayúsculas
    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push('Una mayúscula');
    }

    // Minúsculas
    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push('Una minúscula');
    }

    // Números
    if (/[0-9]/.test(password)) {
      score++;
    } else {
      feedback.push('Un número');
    }

    // Caracteres especiales
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score++;
    } else {
      feedback.push('Un carácter especial (!@#$...)');
    }

    // Determinar etiqueta y color
    let label = '';
    let color = Colors.gray;

    if (score === 0) {
      label = '';
    } else if (score <= 2) {
      label = 'Débil';
      color = Colors.error;
    } else if (score === 3) {
      label = 'Media';
      color = Colors.warning;
    } else if (score === 4) {
      label = 'Buena';
      color = Colors.success;
    } else if (score === 5) {
      label = 'Excelente';
      color = '#059669'; // Verde más oscuro
    }

    return { score, label, color, feedback };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  const validateForm = (): boolean => {
    // Validar contraseña actual
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Debes ingresar tu contraseña actual');
      return false;
    }

    // Validar nueva contraseña
    if (!newPassword.trim()) {
      Alert.alert('Error', 'Debes ingresar una nueva contraseña');
      return false;
    }

    // Validar longitud mínima
    if (newPassword.length < 8) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 8 caracteres');
      return false;
    }

    // Validar fortaleza
    if (passwordStrength.score < 3) {
      Alert.alert(
        'Contraseña débil',
        'Tu contraseña es muy débil. Te recomendamos usar una contraseña más segura.',
        [
          { text: 'Mejorar contraseña', style: 'cancel' },
          { text: 'Continuar de todos modos', onPress: () => handleSave() },
        ]
      );
      return false;
    }

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    // Validar que sea diferente a la actual
    if (currentPassword === newPassword) {
      Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Simular llamada a API
    setTimeout(() => {
      setIsLoading(false);

      Alert.alert(
        'Contraseña actualizada',
        'Tu contraseña ha sido cambiada exitosamente. Por seguridad, te recomendamos cerrar sesión en otros dispositivos.',
        [
          {
            text: 'Entendido',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        'Confirmar cambio',
        '¿Estás seguro que deseas cambiar tu contraseña?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Cambiar', onPress: handleSave },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
            <View style={styles.backButton} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="shield-checkmark" size={40} color={Colors.primary} />
              <Text style={styles.infoTitle}>Actualiza tu contraseña</Text>
              <Text style={styles.infoText}>
                Usa una contraseña fuerte que incluya letras, números y símbolos
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Current Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña actual</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.gray} />
                  <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Ingresa tu contraseña actual"
                    placeholderTextColor={Colors.gray}
                    secureTextEntry={!showCurrentPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                    <Ionicons
                      name={showCurrentPassword ? 'eye-off' : 'eye'}
                      size={22}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nueva contraseña</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="key-outline" size={20} color={Colors.gray} />
                  <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Ingresa tu nueva contraseña"
                    placeholderTextColor={Colors.gray}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Ionicons
                      name={showNewPassword ? 'eye-off' : 'eye'}
                      size={22}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                </View>

                {/* Password Strength Indicator */}
                {newPassword.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthBars}>
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <View
                          key={bar}
                          style={[
                            styles.strengthBar,
                            bar <= passwordStrength.score && {
                              backgroundColor: passwordStrength.color,
                            },
                          ]}
                        />
                      ))}
                    </View>
                    {passwordStrength.label && (
                      <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                        {passwordStrength.label}
                      </Text>
                    )}
                  </View>
                )}

                {/* Password Requirements */}
                {passwordStrength.feedback.length > 0 && (
                  <View style={styles.requirementsCard}>
                    <Text style={styles.requirementsTitle}>Tu contraseña necesita:</Text>
                    {passwordStrength.feedback.map((req, index) => (
                      <View key={index} style={styles.requirementRow}>
                        <Ionicons name="close-circle" size={16} color={Colors.error} />
                        <Text style={styles.requirementText}>{req}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar nueva contraseña</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="checkmark-circle-outline" size={20} color={Colors.gray} />
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirma tu nueva contraseña"
                    placeholderTextColor={Colors.gray}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={22}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                </View>

                {/* Match Indicator */}
                {confirmPassword.length > 0 && (
                  <View style={styles.matchIndicator}>
                    <Ionicons
                      name={newPassword === confirmPassword ? 'checkmark-circle' : 'close-circle'}
                      size={16}
                      color={newPassword === confirmPassword ? Colors.success : Colors.error}
                    />
                    <Text
                      style={[
                        styles.matchText,
                        { color: newPassword === confirmPassword ? Colors.success : Colors.error },
                      ]}
                    >
                      {newPassword === confirmPassword ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Security Tips */}
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 Consejos de seguridad</Text>
              <View style={styles.tipRow}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Usa una contraseña única que no uses en otros sitios</Text>
              </View>
              <View style={styles.tipRow}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Combina letras mayúsculas y minúsculas</Text>
              </View>
              <View style={styles.tipRow}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Incluye números y símbolos especiales</Text>
              </View>
              <View style={styles.tipRow}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>Evita información personal (nombre, fecha de nacimiento)</Text>
              </View>
            </View>

            {/* Submit Button */}
            <PrimaryButton
              title="Cambiar contraseña"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={!currentPassword || !newPassword || !confirmPassword || isLoading}
              icon="checkmark"
              style={styles.submitButton}
            />

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotLink}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña actual?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.darkBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  content: {
    padding: 24,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    ...Colors.shadow,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: Colors.grayLight,
    ...Colors.shadow,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  strengthContainer: {
    marginTop: 12,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.grayLight,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  requirementsCard: {
    marginTop: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...Colors.shadow,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: Colors.primary,
    marginRight: 8,
    marginTop: -2,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  submitButton: {
    marginBottom: 16,
  },
  forgotLink: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  forgotText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});