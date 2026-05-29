/**
 * Funzioni di utilità pure (nessun side effect, facilmente testabili).
 */

/** Mescola un array (Fisher-Yates) restituendo una nuova copia. */
export function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Estrae n elementi casuali distinti da un array. */
export function pickRandom<T>(array: readonly T[], n: number): T[] {
  return shuffle(array).slice(0, Math.min(n, array.length));
}

/** Estrae un singolo elemento casuale. */
export function pickOne<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
