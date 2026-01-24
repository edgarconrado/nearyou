// components/UserProfile.tsx
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function UserProfile() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: user.imageUrl }} 
        style={styles.avatar}
      />
      <Text style={styles.name}>
        {user.fullName || user.firstName}
      </Text>
      <Text style={styles.email}>
        {user.primaryEmailAddress?.emailAddress}
      </Text>
      <Button title="Cerrar sesión" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  email: { fontSize: 16, color: '#666', marginTop: 5 },
});