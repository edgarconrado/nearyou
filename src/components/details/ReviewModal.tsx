import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { NewReview } from '../../types/types';

interface ReviewModalProps {
    visible: boolean;
    businessName: string;
    review: NewReview;
    isEditing: boolean;
    isSubmitting?: boolean; // 🆕 Nueva prop para controlar el loading
    onClose: () => void;
    onSubmit: () => void;
    onRatingChange: (rating: number) => void;
    onCommentChange: (comment: string) => void;
    onAddPhoto: () => void;
    onRemovePhoto: (index: number) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
    visible,
    businessName,
    review,
    isEditing,
    isSubmitting = false, // 🆕 Por defecto false
    onClose,
    onSubmit,
    onRatingChange,
    onCommentChange,
    onAddPhoto,
    onRemovePhoto,
}) => {
    const { t } = useLanguage();

    const getRatingLabel = (rating: number): string => {
        switch (rating) {
            case 1: return t('reviewModal.ratingBad');
            case 2: return t('reviewModal.ratingRegular');
            case 3: return t('reviewModal.ratingGood');
            case 4: return t('reviewModal.ratingVeryGood');
            case 5: return t('reviewModal.ratingExcellent');
            default: return '';
        }
    };

    const renderRatingSelector = () => {
        return (
            <View style={styles.ratingSelector}>
                <Text style={styles.modalLabel}>{t('reviewModal.rating')}</Text>
                <View style={styles.starsSelector}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity 
                            key={star} 
                            onPress={() => onRatingChange(star)}
                            disabled={isSubmitting} // 🆕 Deshabilitar mientras se envía
                        >
                            <Ionicons
                                name={star <= review.rating ? 'star' : 'star-outline'}
                                size={40}
                                color={isSubmitting ? '#CCC' : '#FFB800'} // 🆕 Color gris si está enviando
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                {review.rating > 0 && (
                    <Text style={styles.ratingLabel}>
                        {getRatingLabel(review.rating)}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={isSubmitting ? undefined : onClose} // 🆕 Prevenir cerrar mientras se envía
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {isEditing ? t('reviewModal.editReview') : t('reviewModal.writeReview')}
                        </Text>
                        <TouchableOpacity 
                            onPress={onClose}
                            disabled={isSubmitting} // 🆕 Deshabilitar mientras se envía
                        >
                            <Ionicons 
                                name="close" 
                                size={28} 
                                color={isSubmitting ? '#CCC' : '#333'} // 🆕 Color gris si está enviando
                            />
                        </TouchableOpacity>
                    </View>

                    <ScrollView 
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={!isSubmitting} // 🆕 Deshabilitar scroll mientras se envía
                    >
                        <Text style={styles.modalSubtitle}>{businessName}</Text>

                        {renderRatingSelector()}

                        <View style={styles.commentSection}>
                            <Text style={styles.modalLabel}>{t('reviewModal.yourOpinion')}</Text>
                            <TextInput
                                style={[
                                    styles.commentInput,
                                    isSubmitting && styles.commentInputDisabled // 🆕 Estilo deshabilitado
                                ]}
                                placeholder={t('reviewModal.commentPlaceholder')}
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={6}
                                value={review.comment}
                                onChangeText={onCommentChange}
                                textAlignVertical="top"
                                maxLength={500}
                                editable={!isSubmitting} // 🆕 Deshabilitar mientras se envía
                            />
                            <Text style={styles.charCount}>
                                {review.comment.length} / 500 {t('reviewModal.characters')}
                            </Text>
                        </View>

                        <View style={styles.photosSection}>
                            <Text style={styles.modalLabel}>{t('reviewModal.addPhotos')}</Text>
                            <Text style={styles.photosHint}>{t('reviewModal.maxPhotos')}</Text>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.photosScroll}
                                scrollEnabled={!isSubmitting} // 🆕 Deshabilitar scroll mientras se envía
                            >
                                {review.images.map((image, index) => (
                                    <View key={index} style={styles.photoContainer}>
                                        <Image source={{ uri: image }} style={styles.photoPreview} />
                                        <TouchableOpacity
                                            style={styles.removePhotoButton}
                                            onPress={() => onRemovePhoto(index)}
                                            disabled={isSubmitting} // 🆕 Deshabilitar mientras se envía
                                        >
                                            <Ionicons 
                                                name="close-circle" 
                                                size={24} 
                                                color={isSubmitting ? '#CCC' : '#FF3B30'} // 🆕 Color gris si está enviando
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                {review.images.length < 5 && (
                                    <TouchableOpacity 
                                        style={[
                                            styles.addPhotoButton,
                                            isSubmitting && styles.addPhotoButtonDisabled // 🆕 Estilo deshabilitado
                                        ]}
                                        onPress={onAddPhoto}
                                        disabled={isSubmitting} // 🆕 Deshabilitar mientras se envía
                                    >
                                        <Ionicons 
                                            name="camera" 
                                            size={32} 
                                            color={isSubmitting ? '#CCC' : '#003D7A'} // 🆕 Color gris si está enviando
                                        />
                                        <Text style={[
                                            styles.addPhotoText,
                                            isSubmitting && styles.addPhotoTextDisabled // 🆕 Color gris si está enviando
                                        ]}>
                                            {t('reviewModal.addPhoto')}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[
                                    styles.cancelButton,
                                    isSubmitting && styles.buttonDisabled // 🆕 Estilo deshabilitado
                                ]}
                                onPress={onClose}
                                disabled={isSubmitting} // 🆕 Deshabilitar mientras se envía
                            >
                                <Text style={[
                                    styles.cancelButtonText,
                                    isSubmitting && styles.buttonTextDisabled // 🆕 Texto gris
                                ]}>
                                    {t('reviewModal.cancel')}
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[
                                    styles.submitButton,
                                    isSubmitting && styles.submitButtonLoading // 🆕 Estilo de carga
                                ]}
                                onPress={onSubmit}
                                disabled={isSubmitting} // 🆕 Deshabilitar mientras se envía
                            >
                                {isSubmitting ? (
                                    // 🆕 Mostrar spinner mientras se envía
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator color="#FFFFFF" size="small" />
                                        <Text style={styles.submitButtonText}>
                                            {isEditing ? t('reviewModal.updating') : t('reviewModal.publishing')}
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={styles.submitButtonText}>
                                        {isEditing ? t('reviewModal.update') : t('reviewModal.publish')}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* 🆕 Overlay de loading (opcional) */}
                    {isSubmitting && (
                        <View style={styles.loadingOverlay}>
                            <View style={styles.loadingBox}>
                                <ActivityIndicator size="large" color="#003D7A" />
                                <Text style={styles.loadingText}>
                                    {isEditing 
                                        ? t('reviewModal.updatingReview') 
                                        : t('reviewModal.publishingReview')
                                    }
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    modalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    ratingSelector: {
        marginBottom: 24,
    },
    starsSelector: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 8,
    },
    ratingLabel: {
        fontSize: 16,
        color: '#003D7A',
        fontWeight: '600',
    },
    commentSection: {
        marginBottom: 24,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: '#333',
        minHeight: 120,
        backgroundColor: '#F9F9F9',
    },
    // 🆕 Estilo para input deshabilitado
    commentInputDisabled: {
        backgroundColor: '#F5F5F5',
        color: '#999',
    },
    charCount: {
        fontSize: 13,
        color: '#999',
        marginTop: 8,
        textAlign: 'right',
    },
    photosSection: {
        marginBottom: 24,
    },
    photosHint: {
        fontSize: 13,
        color: '#999',
        marginBottom: 12,
    },
    photosScroll: {
        marginHorizontal: -24,
        paddingHorizontal: 24,
    },
    photoContainer: {
        position: 'relative',
        marginRight: 12,
    },
    photoPreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removePhotoButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
    },
    addPhotoButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
    },
    // 🆕 Estilo para botón de foto deshabilitado
    addPhotoButtonDisabled: {
        backgroundColor: '#F5F5F5',
        borderColor: '#D0D0D0',
    },
    addPhotoText: {
        fontSize: 12,
        color: '#003D7A',
        fontWeight: '600',
        marginTop: 4,
    },
    // 🆕 Estilo para texto de foto deshabilitado
    addPhotoTextDisabled: {
        color: '#CCC',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    submitButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#003D7A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // 🆕 Estilo para botón de envío en estado de carga
    submitButtonLoading: {
        backgroundColor: '#0052A3',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    // 🆕 Estilos para botones deshabilitados
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonTextDisabled: {
        color: '#CCC',
    },
    // 🆕 Container para el spinner dentro del botón
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    // 🆕 Overlay de loading (opcional, se muestra encima de todo)
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    loadingBox: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
});