/**
 * Bottone principale con stile retrò (ombra netta, no gradiente).
 * Usato per le azioni primarie (Inizia, Gioca ancora…).
 */
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export function PixelButton({ label, onPress, variant = 'primary', style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === 'secondary' && styles.labelSecondary,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.bluNotte,
  },
  primary: { backgroundColor: Colors.rosso },
  secondary: { backgroundColor: Colors.bianco },
  pressed: { opacity: 0.85, transform: [{ translateY: 2 }] },
  label: {
    fontSize: Typography.sizes.body,
    fontWeight: '700',
    color: Colors.bianco,
  },
  labelSecondary: { color: Colors.bluNotte },
});
