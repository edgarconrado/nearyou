// components/details/ReportModal.tsx
import { hairline, palette, radius, spacing, type } from '@/constants/design';
import {
  ModerationService,
  REPORT_REASONS,
  type ReportReason,
} from '@/services/moderation.service';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ReportModalProps {
  visible: boolean;
  reviewId: string | null;
  authorName?: string;
  onClose: () => void;
  onBlocked?: () => void;
}

export function ReportModal({
  visible,
  reviewId,
  authorName,
  onClose,
  onBlocked,
}: ReportModalProps) {
  const insets = useSafeAreaInsets();
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);

  const reset = () => {
    setReason(null);
    setDescription('');
    setSending(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const submit = async () => {
    if (!reason || !reviewId) return;

    setSending(true);
    const { success, error } = await ModerationService.reportReview({
      reviewId,
      reason,
      description,
    });
    setSending(false);

    if (!success) {
      Alert.alert('No pudimos enviar el reporte', error?.message ?? 'Inténtalo de nuevo.');
      return;
    }

    close();
    Alert.alert(
      'Reporte enviado',
      'Gracias por avisarnos. Revisamos todos los reportes en un plazo de 24 horas.'
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={close} hitSlop={10}>
            <Ionicons name="close" size={24} color={palette.ink} />
          </Pressable>
          <Text style={styles.headerTitle}>Reportar reseña</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.body}>
          <Text style={styles.intro}>
            ¿Qué problema tiene esta reseña? Tu reporte es anónimo para el autor.
          </Text>

          {REPORT_REASONS.map((option) => {
            const active = reason === option.key;
            return (
              <Pressable
                key={option.key}
                onPress={() => setReason(option.key)}
                style={({ pressed }) => [styles.option, pressed && styles.pressed]}
              >
                <Ionicons
                  name={active ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={active ? palette.ink : palette.faint}
                />
                <Text style={styles.optionLabel}>{option.label}</Text>
              </Pressable>
            );
          })}

          <Text style={styles.label}>Detalles (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Cuéntanos más sobre el problema..."
            placeholderTextColor={palette.muted}
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
          />

          <Pressable
            onPress={submit}
            disabled={!reason || sending}
            style={({ pressed }) => [
              styles.submit,
              (!reason || sending) && styles.disabled,
              pressed && styles.submitPressed,
            ]}
          >
            {sending ? (
              <ActivityIndicator color={palette.white} />
            ) : (
              <Text style={styles.submitText}>Enviar reporte</Text>
            )}
          </Pressable>

          {onBlocked && (
            <>
              <View style={styles.divider} />
              <Text style={styles.blockIntro}>
                Si no quieres volver a ver contenido de{' '}
                {authorName ? `${authorName}` : 'esta persona'}, puedes bloquearla.
              </Text>
              <Pressable
                onPress={() => {
                  close();
                  onBlocked();
                }}
                style={({ pressed }) => [styles.blockButton, pressed && styles.pressed]}
              >
                <Ionicons name="ban-outline" size={18} color={palette.danger} />
                <Text style={styles.blockText}>Bloquear a este usuario</Text>
              </Pressable>
            </>
          )}
        </ScrollView>

        <View style={{ height: insets.bottom }} />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: hairline,
    borderBottomColor: palette.border,
  },
  headerTitle: { ...type.subheading },
  body: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  intro: { ...type.small, marginBottom: spacing.lg },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: hairline,
    borderBottomColor: palette.borderSoft,
  },
  pressed: { opacity: 0.6 },
  optionLabel: { ...type.body, flex: 1 },
  label: { ...type.smallStrong, marginTop: spacing.xl, marginBottom: spacing.sm },
  input: {
    ...type.body,
    minHeight: 96,
    borderWidth: hairline,
    borderColor: palette.border,
    borderRadius: radius.md,
    padding: spacing.md,
    textAlignVertical: 'top',
  },
  submit: {
    height: 50,
    borderRadius: radius.sm,
    backgroundColor: palette.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  submitPressed: { opacity: 0.85 },
  disabled: { opacity: 0.4 },
  submitText: { ...type.smallStrong, color: palette.white, fontSize: 15 },
  divider: {
    height: hairline,
    backgroundColor: palette.border,
    marginVertical: spacing.xl,
  },
  blockIntro: { ...type.small, marginBottom: spacing.md },
  blockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.danger,
  },
  blockText: { ...type.smallStrong, color: palette.danger, fontSize: 15 },
});
