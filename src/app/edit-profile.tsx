import { hairline, palette, spacing } from '@/constants/design';
import { useAuth, useUser } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/hooks/use-profile';
import { supabase } from '@/lib/supabase';
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
  const { user, refreshUser } = useUser();
  const { profile, loading, updateProfile } = useProfile(userId ?? null);
  const { t } = useLanguage();

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
      Alert.alert(t('editProfile.permissionDenied'), t('editProfile.permissionDeniedDesc'));
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

  // ✨ Subir imagen a Supabase Storage
  const uploadToSupabase = async (uri: string): Promise<string | null> => {
    try {
      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const fileName = `${userId}_${timestamp}_${random}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
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
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const publicUrl = `${data.publicUrl}?t=${timestamp}`;

      return publicUrl;
    } catch (error) {
      return null;
    }
  };

  // Reflejar el avatar en los metadatos de Supabase Auth,
  // para que user_metadata.avatar_url quede alineado con el perfil.
  const syncAuthAvatar = async (publicUrl: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });
      if (error) return false;
      await refreshUser();
      return true;
    } catch {
      // No bloquear el guardado si esto falla: la fuente de verdad es profiles.
      return false;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (!fullName.trim()) {
        Alert.alert(t('common.error'), t('editProfile.nameRequired'));
        return;
      }

      if (!email.trim()) {
        Alert.alert(t('common.error'), t('editProfile.emailRequired'));
        return;
      }

      let newAvatarUrl = avatarUrl;

      if (localImageUri) {
        setUploadingImage(true);

        try {
          // 1. Subir a Supabase primero
          const supabaseUrl = await uploadToSupabase(localImageUri);

          if (supabaseUrl) {
            newAvatarUrl = supabaseUrl;

            // 2. Reflejarlo en Supabase Auth (no bloquear si falla)
            await syncAuthAvatar(supabaseUrl);
          } else {
            Alert.alert(t('common.error'), t('editProfile.uploadError'));
            return;
          }
        } catch (error) {
          Alert.alert(t('common.error'), t('editProfile.processError'));
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      // Actualizar perfil en Supabase
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
          t('editProfile.updateSuccess'),
          t('editProfile.updateSuccessDesc'),
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
      Alert.alert(t('common.error'), t('editProfile.updateError'));
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
            <Ionicons name="chevron-back" size={24} color={palette.ink} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('editProfile.title')}</Text>
          <View style={{ width: 60 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={palette.ink} />
          <Text style={styles.loadingText}>{t('editProfile.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayAvatar = localImageUri || avatarUrl || 'https://i.pravatar.cc/200?img=12';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={saving}>
          <Ionicons name="chevron-back" size={24} color={palette.ink} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('editProfile.title')}</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving || uploadingImage}>
          {saving ? (
            <ActivityIndicator size="small" color={palette.white} />
          ) : (
            <Text style={styles.saveText}>{t('editProfile.save')}</Text>
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
              <ActivityIndicator size="large" color={palette.ink} />
              <Text style={styles.uploadingText}>{t('editProfile.uploading')}</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={pickImage}
            disabled={uploadingImage || saving}
          >
            <Ionicons name="camera" size={20} color={palette.ink} />
            <Text style={styles.changePhotoText}>
              {uploadingImage ? t('editProfile.uploading') : localImageUri ? t('editProfile.changePhotoAgain') : t('editProfile.changePhoto')}
            </Text>
          </TouchableOpacity>

          {localImageUri && !uploadingImage && (
            <View style={styles.pendingBadge}>
              <Ionicons name="alert-circle" size={16} color="#FF9800" />
              <Text style={styles.pendingText}>
                {t('editProfile.pendingSave')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.fullName')} *</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder={t('editProfile.fullName')}
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.email')} *</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={email}
              editable={false}
              placeholder={t('editProfile.email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.helperText}>
              {t('editProfile.emailCannotChange')}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.phone')}</Text>
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
            <Text style={styles.label}>{t('editProfile.city')}</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder={t('editProfile.city')}
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.state')}</Text>
            <TextInput
              style={styles.input}
              value={state}
              onChangeText={setState}
              placeholder={t('editProfile.state')}
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.country')}</Text>
            <TextInput
              style={styles.input}
              value={country}
              onChangeText={setCountry}
              placeholder={t('editProfile.country')}
              editable={!saving}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('editProfile.bio')}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder={t('editProfile.bioPlaceholder')}
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
    backgroundColor: palette.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: palette.muted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: palette.white,
    borderBottomWidth: hairline,
    borderBottomColor: palette.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.ink,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.white,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    backgroundColor: palette.white,
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
    borderColor: palette.ink,
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
    color: palette.white,
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
    borderColor: palette.ink,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.ink,
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
    backgroundColor: palette.white,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.ink,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: palette.ink,
    backgroundColor: '#F9F9F9',
  },
  disabledInput: {
    backgroundColor: '#F0F0F0',
    color: palette.muted,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  helperText: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 4,
  },
  charCount: {
    fontSize: 12,
    color: palette.muted,
    marginTop: 4,
    textAlign: 'right',
  },
});