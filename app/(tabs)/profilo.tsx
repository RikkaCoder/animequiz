import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PixelButton } from '@/components/PixelButton';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Colors, Spacing, Typography } from '@/constants/theme';

const AVATAR_EMOJI: Record<string, string> = {
  pikachu: '⚡',
  charmander: '🔥',
  bulbasaur: '🌿',
  squirtle: '💧',
  eevee: '🦊',
  jigglypuff: '🎵',
};

export default function ProfiloScreen() {
  const { signOut } = useAuth();
  const { profile } = useProfile();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profilo</Text>

        {profile && (
          <View style={styles.card}>
            <Text style={styles.avatar}>{AVATAR_EMOJI[profile.avatarId] ?? '❓'}</Text>
            <Text style={styles.nickname}>{profile.nickname}</Text>
          </View>
        )}

        <PixelButton label="Esci" variant="secondary" onPress={() => signOut()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bluNotte },
  content: { padding: Spacing.lg, gap: Spacing.md },
  title: { fontSize: Typography.sizes.h1, fontWeight: '800', color: Colors.giallo },
  card: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  avatar: { fontSize: 64 },
  nickname: { fontSize: Typography.sizes.h2, fontWeight: '700', color: Colors.bianco },
});
