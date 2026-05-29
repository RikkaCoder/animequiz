/**
 * Bottone di risposta. Cambia stile in base allo stato:
 * - neutro: in attesa di risposta
 * - corretto: verde (risposta giusta)
 * - errato: rosso (scelta sbagliata dall'utente)
 */
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export type OptionState = 'neutro' | 'corretto' | 'errato';

interface Props {
  label: string;
  state: OptionState;
  disabled: boolean;
  onPress: () => void;
}

export function OptionButton({ label, state, disabled, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        state === 'corretto' && styles.corretto,
        state === 'errato' && styles.errato,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          state === 'corretto' && styles.labelCorretto,
          state === 'errato' && styles.labelErrato,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.bianco,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.grigioMedio,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  pressed: { backgroundColor: Colors.grigioChiaro },
  corretto: { backgroundColor: Colors.verdeChiaro, borderColor: Colors.verde },
  errato: { backgroundColor: Colors.rossoErroreChiaro, borderColor: Colors.rossoErrore },
  label: {
    fontSize: Typography.sizes.body,
    fontWeight: '600',
    color: Colors.grigioScuro,
    textAlign: 'center',
  },
  labelCorretto: { color: '#3B6D11' },
  labelErrato: { color: '#A32D2D' },
});
