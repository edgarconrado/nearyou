// app/edit-profile.tsx
import PrimaryButton from '@/components/PrimaryButton';
import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  website: string;
  profileImage: string | null;
}

export default function EditProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Edgar',
    email: 'edgar@email.com',
    phone: '+52 33 1234 5678',
    bio: 'Amante de la buena comida y los viajes. Siempre buscando nuevos lugares por descubrir.',
    location: 'Tlaquepaque, Jalisco',
    website: '',
    profileImage: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Cambiar foto de perfil',
      'Elige una opción',
      [
        {
          text: 'Tomar foto',
          onPress: () => {
            console.log('Abrir cámara');
            // Aquí irá la lógica para abrir la cámara
          },
        },
        {
          text: 'Elegir de galería',
          onPress: () => {
            console.log('Abrir galería');
            // Aquí irá la lógica para abrir la galería
          },
        },
        {
          text: 'Eliminar foto',
          style: 'destructive',
          onPress: () => {
            setProfile(prev => ({ ...prev, profileImage: null }));
            setHasChanges(true);
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const handleSave = async () => {
    // Validaciones
    if (!profile.name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    if (!profile.email.trim()) {
      Alert.alert('Error', 'El correo electrónico es obligatorio');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) {
      Alert.alert('Error', 'El correo electrónico no es válido');
      return;
    }

    setIsLoading(true);

    // Simular guardado
    setTimeout(() => {
      setIsLoading(false);
      setHasChanges(false);
      Alert.alert(
        'Perfil actualizado',
        'Tus cambios han sido guardados exitosamente',
        [
          {
            text: 'Entendido',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Descartar cambios',
        '¿Estás seguro que deseas salir sin guardar los cambios?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Descartar',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
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
              onPress={handleCancel}
            >
              <Ionicons name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editar Perfil</Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={!hasChanges || isLoading}
            >
              <Text style={[
                styles.saveButtonText,
                (!hasChanges || isLoading) && styles.saveButtonTextDisabled
              ]}>
                Guardar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Profile Photo */}
            <View style={styles.photoSection}>
              <View style={styles.photoContainer}>
                {profile.profileImage ? (
                  <Image source={{ uri: profile.profileImage }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Ionicons name="person" size={48} color={Colors.primary} />
                  </View>
                )}
                <TouchableOpacity
                  style={styles.changePhotoButton}
                  onPress={handleChangePhoto}
                >
                  <Ionicons name="camera" size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
              <Text style={styles.photoHint}>Toca para cambiar tu foto</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Nombre completo <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color={Colors.gray} />
                  <TextInput
                    style={styles.input}
                    value={profile.name}
                    onChangeText={(text) => handleChange('name', text)}
                    placeholder="Tu nombre"
                    placeholderTextColor={Colors.gray}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>
                  Correo electrónico <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color={Colors.gray} />
                  <TextInput
                    style={styles.input}
                    value={profile.email}
                    onChangeText={(text) => handleChange('email', text)}
                    placeholder="tu@email.com"
                    placeholderTextColor={Colors.gray}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Teléfono</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color={Colors.gray} />
                  <TextInput
                    style={styles.input}
                    value={profile.phone}
                    onChangeText={(text) => handleChange('phone', text)}
                    placeholder="+52 33 1234 5678"
                    placeholderTextColor={Colors.gray}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Ubicación</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="location-outline" size={20} color={Colors.gray} />
                  <TextInput
                    style={styles.input}
                    value={profile.location}
                    onChangeText={(text) => handleChange('location', text)}
                    placeholder="Ciudad, País"
                    placeholderTextColor={Colors.gray}
                  />
                </View>
              </View>

              {/* Website */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sitio web</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="globe-outline" size={20} color={Colors.gray} />
                  <TextInput
                    style={styles.input}
                    value={profile.website}
                    onChangeText={(text) => handleChange('website', text)}
                    placeholder="https://tusitio.com"
                    placeholderTextColor={Colors.gray}
                    keyboardType="url"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Bio */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Biografía</Text>
                  <Text style={styles.charCount}>
                    {profile.bio.length}/150
                  </Text>
                </View>
                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={profile.bio}
                    onChangeText={(text) => {
                      if (text.length <= 150) {
                        handleChange('bio', text);
                      }
                    }}
                    placeholder="Cuéntanos algo sobre ti..."
                    placeholderTextColor={Colors.gray}
                    multiline
                    numberOfLines={4}
                    maxLength={150}
                  />
                </View>
              </View>
            </View>

            {/* Additional Actions */}
            <View style={styles.actionsSection}>
              <Text style={styles.actionsTitle}>Más opciones</Text>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => router.push('/change-password')}
              >
                <View style={styles.actionLeft}>
                  <Ionicons name="key-outline" size={20} color={Colors.primary} />
                  <Text style={styles.actionText}>Cambiar contraseña</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => {
                  Alert.alert(
                    'Verificar cuenta',
                    'Te enviaremos un código de verificación a tu correo electrónico',
                    [
                      { text: 'Cancelar', style: 'cancel' },
                      { text: 'Enviar', onPress: () => console.log('Verificar cuenta') },
                    ]
                  );
                }}
              >
                <View style={styles.actionLeft}>
                  <Ionicons name="shield-checkmark-outline" size={20} color={Colors.success} />
                  <Text style={styles.actionText}>Verificar cuenta</Text>
                </View>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>No verificado</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Save Button (mobile friendly) */}
            <PrimaryButton
              title="Guardar cambios"
              onPress={handleSave}
              loading={isLoading}
              disabled={!hasChanges}
              icon="checkmark"
              style={styles.saveButtonMobile}
            />

            {/* Info */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color={Colors.textSecondary} />
              <Text style={styles.infoText}>
                Los campos marcados con <Text style={styles.required}>*</Text> son obligatorios
              </Text>
            </View>
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  saveButtonTextDisabled: {
    color: Colors.gray,
  },
  content: {
    padding: 24,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  photoHint: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  required: {
    color: Colors.error,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textSecondary,
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
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    marginLeft: 0,
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  actionItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    ...Colors.shadow,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionText: {
    fontSize: 15,
    color: Colors.textPrimary,
  },
  verifiedBadge: {
    backgroundColor: Colors.grayLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  saveButtonMobile: {
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryVeryLight,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});