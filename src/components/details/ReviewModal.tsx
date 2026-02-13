import { useLanguage } from '@/contexts/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
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
                        <TouchableOpacity key={star} onPress={() => onRatingChange(star)}>
                            <Ionicons
                                name={star <= review.rating ? 'star' : 'star-outline'}
                                size={40}
                                color="#FFB800"
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
            onRequestClose={onClose}
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
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.modalSubtitle}>{businessName}</Text>

                        {renderRatingSelector()}

                        <View style={styles.commentSection}>
                            <Text style={styles.modalLabel}>{t('reviewModal.yourOpinion')}</Text>
                            <TextInput
                                style={styles.commentInput}
                                placeholder={t('reviewModal.commentPlaceholder')}
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={6}
                                value={review.comment}
                                onChangeText={onCommentChange}
                                textAlignVertical="top"
                                maxLength={500}
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
                            >
                                {review.images.map((image, index) => (
                                    <View key={index} style={styles.photoContainer}>
                                        <Image source={{ uri: image }} style={styles.photoPreview} />
                                        <TouchableOpacity
                                            style={styles.removePhotoButton}
                                            onPress={() => onRemovePhoto(index)}
                                        >
                                            <Ionicons name="close-circle" size={24} color="#FF3B30" />
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                {review.images.length < 5 && (
                                    <TouchableOpacity style={styles.addPhotoButton} onPress={onAddPhoto}>
                                        <Ionicons name="camera" size={32} color="#003D7A" />
                                        <Text style={styles.addPhotoText}>{t('reviewModal.addPhoto')}</Text>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelButtonText}>{t('reviewModal.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
                                <Text style={styles.submitButtonText}>
                                    {isEditing ? t('reviewModal.update') : t('reviewModal.publish')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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
    addPhotoText: {
        fontSize: 12,
        color: '#003D7A',
        fontWeight: '600',
        marginTop: 4,
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
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});