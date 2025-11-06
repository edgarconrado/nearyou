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
  score: number;
  label: string;
  color: string;
  percentage: number;
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
    let score = 0;

    if (password.length === 0) {
      return { score: 0, label: '', color: Colors.gray, percentage: 0 };
    }

    // Longitud
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Caracteres
    if (/[a-z]/.test(password)) score += 1; // Minúsculas
    if (/[A-Z]/.test(password)) score += 1; // Mayúsculas
    if (/[0-9]/.test(password)) score += 1; // Números
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Símbolos

    if (score <= 2) {
      return { score, label: 'Débil', color: Colors.error, percentage: 33 };
    } else if (score <= 4) {
      return { score, label: 'Media', color: Colors.warning, percentage: 66 };
    } else {
      return { score, label: 'Fuerte', color: Colors.success, percentage: 100 };
    }
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  const validatePasswords = (): boolean => {
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

    // Validar que no sea igual a la actual
    if (currentPassword === newPassword) {
      Alert.alert('Error', 'La nueva contraseña debe ser diferente a la actual');
      return false;
    }

    // Validar confirmación
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);

    // Simular llamada al API
    setTimeout(() => {
      setIsLoading(false);

      Alert.alert(
        '✅ Contraseña actualizada',
        'Tu contraseña ha sido cambiada exitosamente. Te recomendamos cerrar sesión y volver a iniciar con tu nueva contraseña.',
        [
          {
            text: 'Cerrar sesión',
            style: 'destructive',
            onPress: () => router.replace('/login'),
          },
          {
            text: 'Continuar',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  const getPasswordRequirements = () => {
    return [
      {
        met: newPassword.length >= 8,
        text: 'Al menos 8 caracteres',
        icon: newPassword.length >= 8 ? 'checkmark-circle' : 'close-circle'
      },
      {
        met: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
        text: 'Mayúsculas y minúsculas',
        icon: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'checkmark-circle' : 'close-circle'
      },
      {
        met: /[0-9]/.test(newPassword),
        text: 'Al menos un número',
        icon: /[0-9]/.test(newPassword) ? 'checkmark-circle' : 'close-circle'
      },
      {
        met: /[^A-Za-z0-9]/.test(newPassword),
        text: 'Al menos un símbolo (!@#$%)',
        icon: /[^A-Za-z0-9]/.test(newPassword) ? 'checkmark-circle' : 'close-circle'
      },
    ];
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
              <Text style={styles.infoTitle}>Seguridad de tu cuenta</Text>
              <Text style={styles.infoText}>
                Crea una contraseña fuerte y única para proteger tu cuenta
              </Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Current Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Contraseña actual</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color={Colors.gray} />
                  <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Ingresa tu contraseña actual"
                    placeholderTextColor={Colors.gray}
                    secureTextEntry={!showCurrentPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showCurrentPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nueva contraseña</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color={Colors.gray} />
                  <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Ingresa tu nueva contraseña"
                    placeholderTextColor={Colors.gray}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showNewPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={Colors.gray}
                    />
                  </TouchableOpacity>
                </View>

                {/* Password Strength */}
                {newPassword.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <View style={styles.strengthHeader}>
                      <Text style={styles.strengthLabel}>Seguridad:</Text>
                      <Text style={[styles.strengthValue, { color: passwordStrength.color }]}>
                        {passwordStrength.label}
                      </Text>
                    </View>
                    <View style={styles.strengthBar}>
                      <View
                        style={[
                          styles.strengthFill,
                          {
                            width: `${passwordStrength.percentage}%`,
                            backgroundColor: passwordStrength.color
                          }
                        ]}
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar nueva contraseña</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed" size={20} color={Colors.gray} />
                  <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirma tu nueva contraseña"
                    placeholderTextColor={Colors.gray}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off' : 'eye'}
                      size={20}
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
                    <Text style={[
                      styles.matchText,
                      { color: newPassword === confirmPassword ? Colors.success : Colors.error }
                    ]}>
                      {newPassword === confirmPassword ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Requirements */}
            <View style={styles.requirementsCard}>
              <Text style={styles.requirementsTitle}>Requisitos de contraseña</Text>
              {getPasswordRequirements().map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Ionicons
                    name={req.icon}
                    size={20}
                    color={req.met ? Colors.success : Colors.gray}
                  />
                  <Text style={[
                    styles.requirementText,
                    req.met && styles.requirementMet
                  ]}>
                    {req.text}
                  </Text>
                </View>
              ))}
            </View>

            {/* Save Button */}
            <PrimaryButton
              title="Cambiar contraseña"
              onPress={handleChangePassword}
              loading={isLoading}
              icon="checkmark"
              style={styles.saveButton}
            />

            {/* Security Tips */}
            <View style={styles.tipsCard}>
              <View style={styles.tipHeader}>
                <Ionicons name="bulb" size={20} color={Colors.accent} />
                <Text style={styles.tipsTitle}>Consejos de seguridad</Text>
              </View>
              <View style={styles.tipsList}>
                <Text style={styles.tipItem}>• Usa una contraseña única que no uses en otros sitios</Text>
                <Text style={styles.tipItem}>• Evita información personal (nombres, fechas)</Text>
                <Text style={styles.tipItem}>• Cambia tu contraseña periódicamente</Text>
                <Text style={styles.tipItem}>• No compartas tu contraseña con nadie</Text>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotLink}
              onPress={() => {
                Alert.alert(
                  '¿Olvidaste tu contraseña?',
                  'Te enviaremos un enlace para restablecer tu contraseña a tu correo electrónico',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Enviar enlace',
                      onPress: () => console.log('Enviar enlace de recuperación')
                    },
                  ]
                );
              }}
            >
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
    marginBottom: 20,
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
  eyeButton: {
    padding: 4,
  },
  strengthContainer: {
    marginTop: 12,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  strengthLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  strengthValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  strengthBar: {
    height: 6,
    backgroundColor: Colors.grayLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  matchIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  matchText: {
    fontSize: 13,
    fontWeight: '600',
  },
  requirementsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...Colors.shadow,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  requirementText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  requirementMet: {
    color: Colors.success,
    fontWeight: '600',
  },
  saveButton: {
    marginBottom: 24,
  },
  tipsCard: {
    backgroundColor: Colors.primaryVeryLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  forgotLink: {
    alignItems: 'center',
    padding: 12,
  },
  forgotText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});