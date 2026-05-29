/**
 * Schermata Home. Mostra i franchise disponibili.
 * e avvia il flusso di impostazione partita.
 */
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { getFranchisesAttivi } from '@/lib/characters';
import { Colors, Spacing, Typography } from '@/constants/theme';
import type { Franchise } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFranchisesAttivi()
      .then(setFranchises)
      .catch((e) => console.error('Errore caricamento franchise:', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Anime Quiz</Text>
        <Text style={styles.subtitle}>Indovina il personaggio!</Text>

        {loading ? (
          <Text style={styles.info}>Caricamento…</Text>
        ) : (
          franchises.map((f) => (
            <View key={f.id} style={styles.franchiseCard}>
              <Text style={styles.franchiseName}>{f.nome}</Text>
              <PixelButton
                label="Gioca"
                onPress={() =>
                  router.push({
                    pathname: '/impostazioni',
                    params: { franchiseId: f.id },
                  })
                }
              />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bluNotte },
  content: { padding: Spacing.lg, gap: Spacing.md },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: '800',
    color: Colors.giallo,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.sizes.small,
    color: Colors.grigioMedio,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  info: { color: Colors.bianco, textAlign: 'center' },
  franchiseCard: {
    backgroundColor: Colors.bianco,
    borderRadius: 16,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  franchiseName: {
    fontSize: Typography.sizes.h2,
    fontWeight: '700',
    color: Colors.bluNotte,
  },
});
