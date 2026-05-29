/**
 * Tipi di dominio dell'app, allineati allo schema Supabase.
 * Tenere questo file come unica fonte di verità per le entità.
 */

export type Difficolta = 'facile' | 'medio' | 'difficile';

export interface Franchise {
  id: string;
  slug: string;
  nome: string;
  descrizione: string | null;
  immagineUrl: string | null;
  attivo: boolean;
  createdAt: string;
}

export interface Character {
  id: string;
  franchiseId: string;
  nomeIt: string;
  nomeOriginale: string | null;
  immagineUrl: string;
  tipo: string | null;
  difficolta: Difficolta;
  numeroOrdine: number | null;
  attivo: boolean;
}

export interface Profile {
  id: string;
  nickname: string;
  avatarId: string;
  createdAt: string;
}

export interface UserStats {
  id: string;
  userId: string;
  franchiseId: string;
  difficolta: Difficolta;
  partiteGiocate: number;
  risposteCorrette: number;
  recordPunteggio: number;
  updatedAt: string;
}

export interface CharacterError {
  id: string;
  userId: string;
  characterId: string;
  volteVisto: number;
  volteErrato: number;
}

/** Una singola domanda del quiz, pronta per la UI. */
export interface QuizQuestion {
  character: Character;
  opzioni: string[]; // 4 nomi, ordine già mescolato
  rispostaCorretta: string;
}

/** Esito di una singola risposta. */
export interface AnswerResult {
  questionIndex: number;
  characterId: string;
  scelto: string;
  corretto: boolean;
}

/** Configurazione scelta dall'utente prima di iniziare. */
export interface QuizConfig {
  franchiseId: string;
  difficolta: Difficolta;
  numeroDomante: number;
}
