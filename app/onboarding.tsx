import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '@/hooks/useProfile';
import { AVATARS } from '@/constants/config';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { AvatarId } from '@/constants/config';

const AVATAR_EMOJI: Record<AvatarId, string> = {
  pikachu: '⚡',
  charmander: '🔥',
  bulbasaur: '🌿',
  squirtle: '💧',
  eevee: '🦊',
  jigglypuff: '🎵',
};

export default function OnboardingScreen() {
  const { creaProfile } = useProfile();
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState<AvatarId>('pikachu');
  const [busy, setBusy] = useState(false);

  async function handleContinua() {
    const nick = nickname.trim();
    if (!nick) { Alert.alert('Scegli un nickname'); return; }
    if (nick.length > 20) { Alert.alert('Nickname troppo lungo (max 20 caratteri)'); return; }

    setBusy(true);
    try {
      await creaProfile(nick, avatar);
      // Il routing è gestito da _layout.tsx che rileva il profilo creato
    } catch (e) {
      console.error('ONBOARDING ERROR', e);
      const msg =
        e instanceof Error
          ? e.message
          : typeof e === 'object' && e !== null && 'message' in e
            ? String((e as { message: unknown }).message)
            : JSON.stringify(e);
      Alert.alert('Errore', msg || JSON.stringify(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {busy && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={Colors.giallo} />
          <Text style={styles.overlayText}>Salvataggio in corso…</Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.content} pointerEvents={busy ? 'none' : 'auto'}>
        <Text style={styles.title}>Benvenuto!</Text>
        <Text style={styles.subtitle}>Scegli il tuo nickname e avatar per iniziare.</Text>

        <Text style={styles.label}>Nickname</Text>
        <TextInput
          style={styles.input}
          placeholder="Il tuo nome nel quiz..."
          placeholderTextColor={Colors.grigioMedio}
          value={nickname}
          onChangeText={setNickname}
          maxLength={20}
          autoCapitalize="none"
          autoFocus
        />

        <Text style={styles.label}>Avatar</Text>
        <View style={styles.avatarGrid}>
          {AVATARS.map((id) => (
            <TouchableOpacity
              key={id}
              style={[styles.avatarCard, avatar === id && styles.avatarCardActive]}
              onPress={() => setAvatar(id)}
              activeOpacity={0.7}
            >
              <Text style={styles.avatarEmoji}>{AVATAR_EMOJI[id]}</Text>
              <Text style={[styles.avatarLabel, avatar === id && styles.avatarLabelActive]}>
                {id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, busy && styles.buttonDisabled]}
          onPress={handleContinua}
          disabled={busy}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonLabel}>{busy ? 'Salvo...' : 'Inizia a giocare'}</Text>
        </TouchableOpacity>
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
    marginTop: Spacing.lg,
  },
  subtitle: {
    color: Colors.grigioMedio,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  label: { color: Colors.bianco, fontWeight: '600' },
  input: {
    backgroundColor: Colors.bianco,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: Typography.sizes.body,
    color: Colors.grigioScuro,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  avatarCard: {
    width: '30%',
    backgroundColor: Colors.bianco,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarCardActive: {
    borderColor: Colors.giallo,
    backgroundColor: Colors.grigioChiaro,
  },
  avatarEmoji: { fontSize: 32 },
  avatarLabel: {
    fontSize: Typography.sizes.tiny,
    color: Colors.grigioMedio,
    textTransform: 'capitalize',
  },
  avatarLabelActive: { color: Colors.bluNotte, fontWeight: '700' },
  button: {
    backgroundColor: Colors.rosso,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonLabel: { color: Colors.bianco, fontWeight: '800', fontSize: Typography.sizes.body },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  overlayText: { color: Colors.bianco, fontWeight: '600', fontSize: Typography.sizes.body },
});
