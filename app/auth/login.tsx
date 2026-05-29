/**
 * Schermata di Login / Registrazione (email + password).
 * La creazione account avviene tramite Supabase Auth; l'app non gestisce
 * direttamente le password.
 */
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PixelButton } from '@/components/PixelButton';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export default function LoginScreen() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [busy, setBusy] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);

  async function handleSubmit() {
    setErrore(null);
    setBusy(true);
    try {
      if (mode === 'login') await signInWithEmail(email, password);
      else await signUpWithEmail(email, password);
    } catch (e) {
      const msg = e instanceof Error ? e.message
        : typeof e === 'object' && e !== null && 'message' in e
          ? String((e as { message: unknown }).message)
          : 'Errore sconosciuto';
      setErrore(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Anime Quiz</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.grigioMedio}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.grigioMedio}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errore && <Text style={styles.errore}>{errore}</Text>}
        <PixelButton
          label={busy ? 'Attendi…' : mode === 'login' ? 'Accedi' : 'Registrati'}
          onPress={handleSubmit}
        />
        <Text
          style={styles.toggle}
          onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login'
            ? 'Non hai un account? Registrati'
            : 'Hai già un account? Accedi'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bluNotte },
  content: { flex: 1, justifyContent: 'center', padding: Spacing.lg, gap: Spacing.md },
  title: {
    fontSize: Typography.sizes.h1,
    fontWeight: '800',
    color: Colors.giallo,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  input: {
    backgroundColor: Colors.bianco,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: Typography.sizes.body,
    color: Colors.grigioScuro,
  },
  toggle: {
    color: Colors.giallo,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  errore: {
    color: Colors.rossoErrore,
    textAlign: 'center',
    fontSize: Typography.sizes.small,
  },
});
