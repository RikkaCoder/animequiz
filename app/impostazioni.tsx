/**
 * Schermata Impostazioni Partita: scelta difficoltà e numero domande,
 * poi costruisce il quiz e naviga alla schermata di gioco.
 */
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { getCharactersForQuiz } from '@/lib/characters';
import { buildQuiz, poolSufficiente } from '@/utils/difficulty';
import { useQuizStore } from '@/store/quizStore';
import { QUIZ_LENGTHS, DEFAULT_QUIZ_LENGTH } from '@/constants/config';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { Difficolta } from '@/types';

const DIFFICOLTA: Difficolta[] = ['facile', 'medio', 'difficile'];

export default function ImpostazioniScreen() {
  const { franchiseId } = useLocalSearchParams<{ franchiseId: string }>();
  const router = useRouter();
  const initQuiz = useQuizStore((s) => s.initQuiz);

  const [difficolta, setDifficolta] = useState<Difficolta>('medio');
  const [numero, setNumero] = useState<number | null>(DEFAULT_QUIZ_LENGTH);
  const [busy, setBusy] = useState(false);

  async function avvia() {
    if (!franchiseId) return;
    setBusy(true);
    try {
      const pool = await getCharactersForQuiz(franchiseId, difficolta);
      if (!poolSufficiente(pool)) {
        Alert.alert('Pochi dati', 'Non ci sono abbastanza personaggi per giocare.');
        return;
      }
      const n = numero ?? pool.length;
      const questions = buildQuiz(pool, n, difficolta);
      initQuiz({ franchiseId, difficolta, numeroDomante: n }, questions);
      router.replace('/quiz');
    } catch (e) {
      Alert.alert('Errore', e instanceof Error ? e.message : 'Riprova');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Impostazioni</Text>

        <Text style={styles.label}>Difficoltà</Text>
        <View style={styles.row}>
          {DIFFICOLTA.map((d) => (
            <Chip key={d} label={d} active={d === difficolta} onPress={() => setDifficolta(d)} />
          ))}
        </View>

        <Text style={styles.label}>Numero di domande</Text>
        <View style={styles.row}>
          {QUIZ_LENGTHS.map((n) => (
            <Chip key={n} label={String(n)} active={n === numero} onPress={() => setNumero(n)} />
          ))}
          <Chip label="Tutti" active={numero === null} onPress={() => setNumero(null)} />
        </View>

        <PixelButton label={busy ? 'Carico…' : 'Inizia'} onPress={avvia} style={{ marginTop: Spacing.lg }} />
      </View>
    </SafeAreaView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Text
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bluNotte },
  content: { padding: Spacing.lg, gap: Spacing.sm },
  title: { fontSize: Typography.sizes.h1, fontWeight: '800', color: Colors.giallo, marginBottom: Spacing.md },
  label: { color: Colors.bianco, fontWeight: '600', marginTop: Spacing.md },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  chip: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.bianco,
    color: Colors.bluNotte,
    fontWeight: '600',
    overflow: 'hidden',
    textTransform: 'capitalize',
  },
  chipActive: { backgroundColor: Colors.giallo },
});
