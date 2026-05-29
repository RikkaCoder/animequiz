/**
 * Mostra l'immagine del personaggio da indovinare.
 * Usa expo-image per caching e fade-in automatico.
 * NB: immagine SEMPRE a colori (niente silhouette) come da specifica.
 */
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Colors, Radius, Spacing } from '@/constants/theme';

interface Props {
  immagineUrl: string;
  nome: string;
}

export function CharacterCard({ immagineUrl, nome }: Props) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: immagineUrl }}
        style={styles.image}
        contentFit="contain"
        transition={200}
        accessibilityLabel={`Immagine di ${nome}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bianco,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.giallo,
  },
  image: {
    width: 200,
    height: 200,
  },
});
