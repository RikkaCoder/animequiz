/**
 * Hook per gli effetti sonori delle risposte (expo-av).
 * I suoni sono precaricati e riutilizzati per evitare latenza.
 */
import { useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export function useSound() {
  const correctRef = useRef<Audio.Sound | null>(null);
  const wrongRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const correct = await Audio.Sound.createAsync(
        require('../assets/sounds/correct.wav')
      );
      const wrong = await Audio.Sound.createAsync(
        require('../assets/sounds/wrong.wav')
      );
      if (mounted) {
        correctRef.current = correct.sound;
        wrongRef.current = wrong.sound;
      } else {
        await correct.sound.unloadAsync();
        await wrong.sound.unloadAsync();
      }
    }

    load();
    return () => {
      mounted = false;
      correctRef.current?.unloadAsync();
      wrongRef.current?.unloadAsync();
    };
  }, []);

  async function playCorrect() {
    await correctRef.current?.replayAsync();
  }

  async function playWrong() {
    await wrongRef.current?.replayAsync();
  }

  return { playCorrect, playWrong };
}
