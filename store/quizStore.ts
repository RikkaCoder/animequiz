/**
 * Store dello stato del quiz in corso (Zustand).
 * Gestisce solo lo stato volatile della partita; la persistenza delle
 * statistiche avviene altrove (hooks/useStats).
 */
import { create } from 'zustand';
import type { AnswerResult, QuizConfig, QuizQuestion } from '@/types';

interface QuizState {
  config: QuizConfig | null;
  questions: QuizQuestion[];
  currentIndex: number;
  risposte: AnswerResult[];

  // azioni
  initQuiz: (config: QuizConfig, questions: QuizQuestion[]) => void;
  answer: (scelto: string) => void;
  next: () => void;
  reset: () => void;

  // selettori derivati
  isFinished: () => boolean;
  punteggio: () => number;
  domandaCorrente: () => QuizQuestion | null;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  config: null,
  questions: [],
  currentIndex: 0,
  risposte: [],

  initQuiz: (config, questions) =>
    set({ config, questions, currentIndex: 0, risposte: [] }),

  answer: (scelto) => {
    const { questions, currentIndex, risposte } = get();
    const q = questions[currentIndex];
    if (!q) return;
    const result: AnswerResult = {
      questionIndex: currentIndex,
      characterId: q.character.id,
      scelto,
      corretto: scelto === q.rispostaCorretta,
    };
    set({ risposte: [...risposte, result] });
  },

  next: () => set((s) => ({ currentIndex: s.currentIndex + 1 })),

  reset: () =>
    set({ config: null, questions: [], currentIndex: 0, risposte: [] }),

  isFinished: () => {
    const { currentIndex, questions } = get();
    return questions.length > 0 && currentIndex >= questions.length;
  },

  punteggio: () => get().risposte.filter((r) => r.corretto).length,

  domandaCorrente: () => {
    const { questions, currentIndex } = get();
    return questions[currentIndex] ?? null;
  },
}));
