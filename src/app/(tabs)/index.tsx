import Colors from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const categories = [
    { id: 1, name: "Restaurantes", icon: "restaurant" },
    { id: 2, name: "Hoteles", icon: "bed" },
    { id: 3, name: "Tiendas", icon: "storefront" },
    { id: 4, name: "Atracciones", icon: "ticket" },
  ];

  const featuredBusinesses = [
    {
      id: 1,
      name: "Restaurant El Mirador",
      rating: 4.8,
      category: "Cocina tradicional",
      price: "$$",
    },
    {
      id: 2,
      name: "Hotel Vista Hermosa",
      rating: 4.6,
      category: "Hotel boutique",
      price: "$$$",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header oscuro */}
        <View style={styles.header}>
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeSection}>
              <View style={styles.logoIcon}>
                {/* <Ionicons name="location" size={28} color={Colors.primary} /> */}
                <Image
                  source={require("../../../assets/images/logo.png")}
                  style={styles.logo}
                />
              </View>
              <Text style={styles.welcomeText}>Bienvenido</Text>
              <Text style={styles.userName}>Edgar</Text>
            </View>
          </View>
        </View>

        {/* Contenido principal */}
        <View style={styles.content}>
          {/* Barra de búsqueda */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={Colors.gray} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar restaurantes, hoteles, tiendas..."
              placeholderTextColor={Colors.gray}
            />
          </View>

          {/* Categorías */}
          <Text style={styles.sectionTitle}>Categorías</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => router.push("/explore")}
              >
                <View style={styles.categoryIconBox}>
                  <Ionicons
                    name={category.icon}
                    size={32}
                    color={Colors.primary}
                  />
                </View>
                <Text style={styles.categoryLabel}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Destacados */}
          <Text style={styles.sectionTitle}>Destacados</Text>
          {featuredBusinesses.map((business) => (
            <TouchableOpacity
              key={business.id}
              style={styles.businessCard}
              onPress={() =>
                router.push({
                  pathname: "/detail",
                  params: { businessId: business.id },
                })
              }
            >
              <View style={styles.businessImage} />
              <View style={styles.businessInfo}>
                <View style={styles.businessHeader}>
                  <Text style={styles.businessName}>{business.name}</Text>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={16} color={Colors.accent} />
                    <Text style={styles.ratingText}>{business.rating}</Text>
                  </View>
                </View>
                <Text style={styles.businessMeta}>
                  {business.category} • {business.price}
                </Text>
                <View style={styles.businessFooter}>
                  <View style={styles.distanceBadge}>
                    <Ionicons
                      name="location"
                      size={14}
                      color={Colors.textTertiary}
                    />
                    <Text style={styles.distanceText}>2.3 km</Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={Colors.gray}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  header: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: Colors.darkBg,
  },
  welcomeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeSection: {
    alignItems: "center",
  },
  logoIcon: {
    width: 56,
    height: 56,
    backgroundColor: Colors.darkBg,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  welcomeText: {
    color: Colors.textLight,
    fontSize: 14,
    marginBottom: 4,
  },
  userName: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 24,
  },
  searchBox: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    ...Colors.shadow,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  categoryItem: {
    alignItems: "center",
    width: "23%",
  },
  categoryIconBox: {
    width: 64,
    height: 64,
    backgroundColor: Colors.primaryLight,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    color: Colors.textPrimary,
    textAlign: "center",
  },
  businessCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    ...Colors.shadow,
  },
  businessImage: {
    width: "100%",
    height: 160,
    backgroundColor: Colors.primaryLight,
  },
  businessInfo: {
    padding: 16,
  },
  businessHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.textPrimary,
    flex: 1,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  businessMeta: {
    color: Colors.textTertiary,
    fontSize: 14,
    marginBottom: 12,
  },
  businessFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  distanceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  distanceText: {
    color: Colors.textTertiary,
    fontSize: 12,
  },
  logo: {
    width: 40,
    height: 40,
  },
});
