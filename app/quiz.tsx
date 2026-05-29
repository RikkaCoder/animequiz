/**
 * Schermata Quiz. Orchestra store + componenti + suoni.
 * Mostra immagine e 4 opzioni; dopo la risposta rivela il feedback e,
 * dopo una breve pausa, passa alla domanda successiva o ai risultati.
 */
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CharacterCard } from '@/components/CharacterCard';
import { OptionButton, type OptionState } from '@/components/OptionButton';
import { useQuizStore } from '@/store/quizStore';
import { useSound } from '@/hooks/useSound';
import { FEEDBACK_DELAY_MS } from '@/constants/config';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function QuizScreen() {
  const router = useRouter();
  const { playCorrect, playWrong } = useSound();

  const questions = useQuizStore((s) => s.questions);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const answer = useQuizStore((s) => s.answer);
  const next = useQuizStore((s) => s.next);

  const [scelto, setScelto] = useState<string | null>(null);
  const q = questions[currentIndex];

  useEffect(() => {
    if (!q) router.replace('/');
  }, [q, router]);

  if (!q) return null;

  function statoOpzione(label: string): OptionState {
    if (!scelto) return 'neutro';
    if (label === q.rispostaCorretta) return 'corretto';
    if (label === scelto) return 'errato';
    return 'neutro';
  }

  function handleAnswer(label: string) {
    if (scelto) return;
    setScelto(label);
    answer(label);
    const corretto = label === q.rispostaCorretta;
    void (corretto ? playCorrect() : playWrong());

    setTimeout(() => {
      setScelto(null);
      if (currentIndex + 1 >= questions.length) {
        next(); // porta currentIndex oltre la fine → isFinished
        router.replace('/risultato');
      } else {
        next();
      }
    }, FEEDBACK_DELAY_MS);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.counter}>
          {currentIndex + 1} / {questions.length}
        </Text>

        <CharacterCard immagineUrl={q.character.immagineUrl} nome={q.rispostaCorretta} />

        <Text style={styles.domanda}>Chi è questo personaggio?</Text>

        <View style={styles.grid}>
          {q.opzioni.map((opt) => (
            <View key={opt} style={styles.cell}>
              <OptionButton
                label={opt}
                state={statoOpzione(opt)}
                disabled={!!scelto}
                onPress={() => handleAnswer(opt)}
              />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bluNotte },
  content: { flex: 1, padding: Spacing.lg, gap: Spacing.lg },
  counter: { color: Colors.giallo, textAlign: 'center', fontWeight: '700' },
  domanda: {
    color: Colors.bianco,
    textAlign: 'center',
    fontSize: Typography.sizes.body,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  cell: { width: '48%' },
});
