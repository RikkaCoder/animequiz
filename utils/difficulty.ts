/**
 * Logica di costruzione del quiz.
 * Sceglie i personaggi da indovinare e genera i distrattori (opzioni
 * sbagliate) in base alla difficoltà. Funzioni pure: nessuna chiamata di rete.
 */
import { OPTIONS_PER_QUESTION } from '@/constants/config';
import { pickRandom, shuffle } from '@/utils/random';
import type { Character, Difficolta, QuizQuestion } from '@/types';

/**
 * Sceglie i distrattori per un personaggio in base alla difficoltà:
 * - facile: distrattori qualsiasi (più facili da escludere)
 * - medio: preferisce personaggi dello stesso tipo
 * - difficile: forza personaggi dello stesso tipo quando possibile
 */
function pickDistrattori(
  target: Character,
  pool: Character[],
  difficolta: Difficolta
): Character[] {
  const altri = pool.filter((c) => c.id !== target.id);
  const needed = OPTIONS_PER_QUESTION - 1;

  if (difficolta === 'facile') {
    return pickRandom(altri, needed);
  }

  const stessoTipo = altri.filter((c) => c.tipo && c.tipo === target.tipo);
  const resto = altri.filter((c) => c.tipo !== target.tipo);

  if (difficolta === 'difficile') {
    // Massimizza i distrattori dello stesso tipo
    const simili = pickRandom(stessoTipo, needed);
    if (simili.length >= needed) return simili;
    return [...simili, ...pickRandom(resto, needed - simili.length)];
  }

  // medio: mix bilanciato (almeno 1 dello stesso tipo se disponibile)
  const unoSimile = stessoTipo.length > 0 ? pickRandom(stessoTipo, 1) : [];
  const riempimento = pickRandom(
    altri.filter((c) => !unoSimile.includes(c)),
    needed - unoSimile.length
  );
  return [...unoSimile, ...riempimento];
}

/**
 * Costruisce una lista di domande a partire dal pool di personaggi.
 * @param pool   personaggi disponibili per il franchise/difficoltà
 * @param numero quante domande generare
 */
export function buildQuiz(
  pool: Character[],
  numero: number,
  difficolta: Difficolta
): QuizQuestion[] {
  const targets = pickRandom(pool, numero);

  return targets.map((target) => {
    const distrattori = pickDistrattori(target, pool, difficolta);
    const opzioni = shuffle([
      target.nomeIt,
      ...distrattori.map((d) => d.nomeIt),
    ]);

    return {
      character: target,
      opzioni,
      rispostaCorretta: target.nomeIt,
    };
  });
}

/** Verifica che il pool sia sufficiente per costruire il quiz. */
export function poolSufficiente(pool: Character[]): boolean {
  return pool.length >= OPTIONS_PER_QUESTION;
}
