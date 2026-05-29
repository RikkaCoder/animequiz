/**
 * Costanti di configurazione dell'app.
 */

export const QUIZ_LENGTHS = [5, 10, 20, 30] as const;

export const DEFAULT_QUIZ_LENGTH = 10;

export const OPTIONS_PER_QUESTION = 4;

/** Pausa (ms) tra il feedback della risposta e la domanda successiva. */
export const FEEDBACK_DELAY_MS = 800;

/** Slug del franchise attivo nella beta. */
export const BETA_FRANCHISE_SLUG = 'pokemon';

/** Numero di personaggi Gen 1 (per validazione seed). */
export const GEN1_COUNT = 151;

export const AVATARS = [
  'pikachu',
  'charmander',
  'bulbasaur',
  'squirtle',
  'eevee',
  'jigglypuff',
] as const;

export type AvatarId = (typeof AVATARS)[number];
