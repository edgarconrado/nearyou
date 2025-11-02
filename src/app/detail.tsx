import Colors from "@/constants/colors";
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DetailScreen() {
  const params = useLocalSearchParams();
  const businessId = params.businessId;

  // Aquí después obtendrás los datos de la BD según el businessId
  // Por ahora usamos datos de ejemplo
  const business = {
    id: businessId,
    name: 'Restaurant El Mirador',
    rating: 4.8,
    reviews: 234,
    category: 'Cocina tradicional mexicana',
    price: '$$',
    distance: '2.3 km',
    isOpen: true,
    address: {
      street: 'Av. Principal 123',
      neighborhood: 'Centro Histórico',
      city: 'Zapopan, Jalisco, México',
    },
    phone: '+52 33 1234 5678',
    schedule: [
      { days: 'Lunes - Viernes', hours: '9:00 AM - 10:00 PM' },
      { days: 'Sábado', hours: '10:00 AM - 11:00 PM' },
      { days: 'Domingo', hours: '10:00 AM - 9:00 PM' },
    ],
    ratingDistribution: [
      { stars: 5, percentage: 75, count: 175 },
      { stars: 4, percentage: 15, count: 35 },
      { stars: 3, percentage: 6, count: 14 },
      { stars: 2, percentage: 3, count: 7 },
      { stars: 1, percentage: 1, count: 3 },
    ],
    recentReviews: [
      {
        id: 1,
        userName: 'Usuario 1',
        date: 'Hace 2 días',
        rating: 4,
        comment: 'Excelente lugar, la comida deliciosa y el servicio muy atento. Totalmente recomendado para venir en familia.',
      },
      {
        id: 2,
        userName: 'Usuario 2',
        date: 'Hace 5 días',
        rating: 5,
        comment: 'Ambiente agradable y precios justos. La atención al cliente es excepcional.',
      },
      {
        id: 3,
        userName: 'Usuario 3',
        date: 'Hace 1 semana',
        rating: 5,
        comment: 'Me encantó la experiencia. Definitivamente volveré pronto.',
      },
    ],
  };

  const handleCall = () => {
    Linking.openURL(`tel:${business.phone}`);
  };

  const handleDirections = () => {
    const address = `${business.address.street}, ${business.address.city}`;
    const url = Platform.OS === 'ios' 
      ? `maps://app?daddr=${address}`
      : `geo:0,0?q=${address}`;
    Linking.openURL(url);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name="star"
          size={14}
          color={i <= rating ? Colors.accent : Colors.grayLight}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <View style={styles.banner}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Main Info Card */}
          <View style={styles.card}>
            <Text style={styles.businessTitle}>{business.name}</Text>
            
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={20} color={Colors.accent} />
              <Text style={styles.largeRating}>{business.rating}</Text>
              <Text style={styles.reviewCount}>({business.reviews} opiniones)</Text>
            </View>

            <Text style={styles.description}>
              {business.category} • {business.price} • {business.distance}
            </Text>

            <View style={styles.statusBadges}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: business.isOpen ? '#D1FAE5' : '#FEE2E2' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: business.isOpen ? '#065F46' : '#991B1B' }
                ]}>
                  {business.isOpen ? 'Abierto ahora' : 'Cerrado'}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.reservationButton}>
              <Text style={styles.reservationButtonText}>Hacer Reservación</Text>
            </TouchableOpacity>
          </View>

          {/* Location Card */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="map" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Ubicación</Text>
            </View>

            <View style={styles.mapPlaceholder}>
              <Ionicons name="location" size={48} color={Colors.primary} />
            </View>

            <View style={styles.addressRow}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <View style={styles.addressText}>
                <Text style={styles.addressLabel}>Dirección</Text>
                <Text style={styles.addressLine}>{business.address.street}</Text>
                <Text style={styles.addressLine}>{business.address.neighborhood}</Text>
                <Text style={styles.addressLine}>{business.address.city}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={handleDirections}
            >
              <Ionicons name="navigate" size={16} color={Colors.primary} />
              <Text style={styles.directionsText}>Cómo llegar</Text>
            </TouchableOpacity>
          </View>

          {/* Contact Card */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="call" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Contacto</Text>
            </View>

            <TouchableOpacity 
              style={styles.contactRow}
              onPress={handleCall}
            >
              <Ionicons name="call" size={18} color={Colors.primary} />
              <Text style={styles.contactText}>{business.phone}</Text>
            </TouchableOpacity>
          </View>

          {/* Schedule Card */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Horarios</Text>
            </View>

            {business.schedule.map((item, index) => (
              <View key={index} style={styles.scheduleRow}>
                <Text style={styles.dayLabel}>{item.days}</Text>
                <Text style={styles.hoursLabel}>{item.hours}</Text>
              </View>
            ))}
          </View>

          {/* Ratings Card */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Ionicons name="star" size={24} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Valoraciones</Text>
              <Text style={styles.reviewsTotal}>{business.reviews} opiniones</Text>
            </View>

            <View style={styles.ratingsDistribution}>
              {business.ratingDistribution.map((item) => (
                <View key={item.stars} style={styles.ratingBar}>
                  <Text style={styles.starsLabel}>{item.stars}★</Text>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${item.percentage}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.countLabel}>{item.count}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Reviews Card */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Opiniones recientes</Text>

            {business.recentReviews.map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <View style={styles.userAvatar}>
                    <Ionicons name="person" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.reviewContent}>
                    <View style={styles.reviewUserRow}>
                      <Text style={styles.userName}>{review.userName}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                    <View style={styles.reviewStars}>
                      {renderStars(review.rating)}
                    </View>
                    <Text style={styles.reviewText}>{review.comment}</Text>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>Ver todas las opiniones</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  banner: {
    width: '100%',
    height: 256,
    backgroundColor: Colors.primaryLight,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
    marginTop: -32,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    ...Colors.shadow,
  },
  businessTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  largeRating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  statusBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  reservationButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  reservationButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
  },
  reviewsTotal: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  mapPlaceholder: {
    height: 160,
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  addressText: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  addressLine: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  directionsText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  dayLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  hoursLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  ratingsDistribution: {
    gap: 8,
  },
  ratingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    width: 32,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  countLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    width: 32,
    textAlign: 'right',
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.primaryLight,
    paddingVertical: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewContent: {
    flex: 1,
  },
  reviewUserRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  reviewStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  viewAllButton: {
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});