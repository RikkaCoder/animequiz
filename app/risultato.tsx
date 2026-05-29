/**
 * Schermata Risultato. Mostra punteggio, valutazione e riepilogo errori.
 * Salva la partita su Supabase tramite useStats.
 */
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { PixelButton } from '@/components/PixelButton';
import { useQuizStore } from '@/store/quizStore';
import { useStats } from '@/hooks/useStats';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

function valutazione(pct: number): string {
  if (pct === 100) return 'Maestro Anime!';
  if (pct >= 75) return 'Ottimo allenatore!';
  if (pct >= 50) return 'Non male!';
  return 'Continua ad allenarti!';
}

export default function RisultatoScreen() {
  const router = useRouter();
  const { salvaPartita } = useStats();

  const config = useQuizStore((s) => s.config);
  const questions = useQuizStore((s) => s.questions);
  const risposte = useQuizStore((s) => s.risposte);
  const reset = useQuizStore((s) => s.reset);

  const punteggio = risposte.filter((r) => r.corretto).length;
  const totale = questions.length;
  const pct = totale > 0 ? Math.round((punteggio / totale) * 100) : 0;

  useEffect(() => {
    if (config) {
      salvaPartita({
        franchiseId: config.franchiseId,
        difficolta: config.difficolta,
        risposte,
        punteggio,
      }).catch((err) => console.error('SALVA PARTITA ERROR', err));
    } else {
      console.warn('RISULTATO: config è null, statistiche non salvate');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errori = risposte
    .filter((r) => !r.corretto)
    .map((r) => questions[r.questionIndex])
    .filter(Boolean);

  function giocaAncora() {
    const cfg = config;
    reset();
    if (cfg) router.replace({ pathname: '/impostazioni', params: { franchiseId: cfg.franchiseId } });
    else router.replace('/');
  }

  function home() {
    reset();
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.titolo}>{valutazione(pct)}</Text>
        <Text style={styles.punteggio}>
          {punteggio}/{totale}
        </Text>
        <Text style={styles.pct}>{pct}% di risposte corrette</Text>

        {errori.length > 0 && (
          <View style={styles.erroriBox}>
            <Text style={styles.erroriTitolo}>Da ripassare:</Text>
            {errori.map((q) => (
              <View key={q.character.id} style={styles.erroreRow}>
                <Image source={{ uri: q.character.immagineUrl }} style={styles.erroreImg} contentFit="contain" />
                <Text style={styles.erroreNome}>{q.rispostaCorretta}</Text>
              </View>
            ))}
          </View>
        )}

        <PixelButton label="Gioca ancora" onPress={giocaAncora} style={{ marginTop: Spacing.lg }} />
        <PixelButton label="Home" variant="secondary" onPress={home} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bluNotte },
  content: { padding: Spacing.lg, gap: Spacing.sm },
  titolo: { fontSize: Typography.sizes.h1, fontWeight: '800', color: Colors.giallo, textAlign: 'center' },
  punteggio: { fontSize: 48, fontWeight: '800', color: Colors.bianco, textAlign: 'center' },
  pct: { color: Colors.grigioMedio, textAlign: 'center', marginBottom: Spacing.md },
  erroriBox: { backgroundColor: Colors.bianco, borderRadius: Radius.lg, padding: Spacing.md, gap: Spacing.sm },
  erroriTitolo: { fontWeight: '700', color: Colors.bluNotte },
  erroreRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  erroreImg: { width: 48, height: 48 },
  erroreNome: { color: Colors.grigioScuro, fontWeight: '600' },
});
