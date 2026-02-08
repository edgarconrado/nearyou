import { useProfile } from '@/hooks/use-profile';
import { supabase } from '@/lib/supabase';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditProfileScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { user } = useUser();
  const { profile, loading, updateProfile } = useProfile(userId);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Estados del formulario
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('México');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);

  // Cargar datos del perfil cuando esté disponible
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setCity(profile.city || '');
      setState(profile.state || '');
      setCountry(profile.country || 'México');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setLocalImageUri(result.assets[0].uri);
    }
  };

  // ✨ Convertir imagen a base64
  const convertToBase64 = async (uri: string): Promise<string | null> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Extraer solo la parte base64 (sin el prefijo data:image/...)
          const base64Data = base64String.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting to base64:', error);
      return null;
    }
  };

  // ✨ Subir imagen a Supabase Storage
  const uploadToSupabase = async (uri: string): Promise<string | null> => {
    try {
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const fileName = `${userId}_${timestamp}_${random}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      console.log('📤 Uploading to Supabase:', filePath);

      const response = await fetch(uri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: false,
          cacheControl: '3600',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const publicUrl = `${data.publicUrl}?t=${timestamp}`;
      console.log('✅ Uploaded to Supabase:', publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading to Supabase:', error);
      return null;
    }
  };

  // ✨ Actualizar avatar en Clerk (requiere base64)
  const updateClerkAvatar = async (imageUri: string): Promise<boolean> => {
    try {
      if (!user) {
        console.warn('⚠️ User not available, skipping Clerk update');
        return false;
      }

      console.log('🔄 Converting image to base64 for Clerk...');
      const base64 = await convertToBase64(imageUri);
      
      if (!base64) {
        console.error('❌ Failed to convert image to base64');
        return false;
      }

      console.log('📤 Updating Clerk avatar with base64 data...');
      
      // ✅ Clerk requiere un File o base64 string
      await user.setProfileImage({
        file: `data:image/jpeg;base64,${base64}`,
      });

      console.log('✅ Clerk avatar updated successfully');
      return true;
    } catch (error: any) {
      console.error('❌ Error updating Clerk avatar:', error);
      console.error('Error details:', error.message || error);
      // No bloquear el guardado si Clerk falla
      return false;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (!fullName.trim()) {
        Alert.alert('Error', 'El nombre es requerido');
        return;
      }

      if (!email.trim()) {
        Alert.alert('Error', 'El correo es requerido');
        return;
      }

      let newAvatarUrl = avatarUrl;

      if (localImageUri) {
        setUploadingImage(true);
        console.log('📷 Processing new avatar...');
        
        try {
          // 1. Subir a Supabase primero
          const supabaseUrl = await uploadToSupabase(localImageUri);
          
          if (supabaseUrl) {
            newAvatarUrl = supabaseUrl;
            
            // 2. Intentar actualizar Clerk (no bloquear si falla)
            await updateClerkAvatar(localImageUri);
          } else {
            Alert.alert('Error', 'No se pudo subir la imagen');
            return;
          }
        } catch (error) {
          console.error('Error processing image:', error);
          Alert.alert('Error', 'No se pudo procesar la imagen');
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      // Actualizar perfil en Supabase
      console.log('💾 Saving profile to Supabase...');
      
      const result = await updateProfile({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        country: country.trim() || 'México',
        bio: bio.trim() || null,
        avatar_url: newAvatarUrl || null,
      });

      if (result.success) {
        setLocalImageUri(null);
        Alert.alert(
          'Perfil actualizado',
          'Tu información ha sido actualizada exitosamente',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar perfil</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#003D7A" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayAvatar = localImageUri || avatarUrl || 'https://i.pravatar.cc/200?img=12';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={saving}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar perfil</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving || uploadingImage}>
          {saving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.saveText}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <Image 
            key={displayAvatar}
            source={{ uri: displayAvatar }} 
            style={styles.avatar}
          />
          {uploadingImage && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color="#003D7A" />
              <Text style={styles.uploadingText}>Subiendo...</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={pickImage}
            disabled={uploadingImage || saving}
          >
            <Ionicons name="camera" size={20} color="#003D7A" />
            <Text style={styles.changePhotoText}>
              {uploadingImage ? 'Subiendo...' : localImageUri ? 'Cambiar de nuevo' : 'Cambiar foto'}
            </Text>
          </TouchableOpacity>
          
          {localImageUri && !uploadingImage && (
            <View style={styles.pendingBadge}>
              <Ionicons name="alert-circle" size={16} color="#FF9800" />
              <Text style={styles.pendingText}>
                Presiona "Guardar" para aplicar cambios
              </Text>
            </View>
          )}
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre completo *</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Tu nombre"
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Correo electrónico *</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.helperText}>
              El correo no se puede modificar
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Teléfono</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+52 123 456 7890"
              keyboardType="phone-pad"
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ciudad</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Tu ciudad"
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Estado</Text>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
              placeholder="Tu estado"
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>País</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder="Tu país"
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Biografía</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Cuéntanos algo sobre ti..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!saving}
              maxLength={500}
            />
            <Text style={styles.charCount}>{bio.length}/500</Text>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#003D7A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 8,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#003D7A',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 32,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: 8,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#003D7A',
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#003D7A',
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  pendingText: {
    fontSize: 12,
    color: '#F57C00',
    fontWeight: '500',
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#F9F9F9',
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    color: '#999',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
});