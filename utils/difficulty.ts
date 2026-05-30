import { OPTIONS_PER_QUESTION } from '@/constants/config';
import { pickRandom, shuffle } from '@/utils/random';
import type { Character, Difficolta, QuizQuestion } from '@/types';

// Peso dei target per difficoltà: i pokemon di livello inferiore possono
// apparire come target ma con probabilità ridotta.
const TARGET_WEIGHTS: Record<Difficolta, Partial<Record<Difficolta, number>>> = {
  facile:    { facile: 1.0 },
  medio:     { medio: 0.80, facile: 0.20 },
  difficile: { difficile: 0.70, medio: 0.20, facile: 0.10 },
  estremo:   { estremo: 0.65, difficile: 0.20, medio: 0.10, facile: 0.05 },
};

function selectTargets(pool: Character[], numero: number, difficolta: Difficolta): Character[] {
  const weights = TARGET_WEIGHTS[difficolta];
  const total = Math.min(numero, pool.length);
  const used = new Set<string>();
  const selected: Character[] = [];

  for (const [diff, weight] of Object.entries(weights) as [Difficolta, number][]) {
    const bucket = pool.filter((c) => c.difficolta === diff && !used.has(c.id));
    const count = Math.round(total * weight);
    const picked = pickRandom(bucket, count);
    picked.forEach((c) => { used.add(c.id); selected.push(c); });
  }

  // Riempie eventuali slot rimasti (dovuti ad arrotondamenti o bucket piccoli)
  const remaining = total - selected.length;
  if (remaining > 0) {
    const rest = pool.filter((c) => !used.has(c.id));
    selected.push(...pickRandom(rest, remaining));
  }

  return shuffle(selected);
}

function pickDistrattori(target: Character, pool: Character[], difficolta: Difficolta): Character[] {
  const altri = pool.filter((c) => c.id !== target.id);
  const needed = OPTIONS_PER_QUESTION - 1;

  if (difficolta === 'facile') return pickRandom(altri, needed);

  const stessoTipo = altri.filter((c) => c.tipo && c.tipo === target.tipo);
  const resto = altri.filter((c) => c.tipo !== target.tipo);

  if (difficolta === 'difficile' || difficolta === 'estremo') {
    const simili = pickRandom(stessoTipo, needed);
    if (simili.length >= needed) return simili;
    return [...simili, ...pickRandom(resto, needed - simili.length)];
  }

  // medio: almeno 1 dello stesso tipo se disponibile
  const unoSimile = stessoTipo.length > 0 ? pickRandom(stessoTipo, 1) : [];
  return [...unoSimile, ...pickRandom(
    altri.filter((c) => !unoSimile.includes(c)),
    needed - unoSimile.length
  )];
}

export function buildQuiz(pool: Character[], numero: number, difficolta: Difficolta): QuizQuestion[] {
  const targets = selectTargets(pool, numero, difficolta);

  return targets.map((target) => {
    const distrattori = pickDistrattori(target, pool, difficolta);
    const opzioni = shuffle([target.nomeIt, ...distrattori.map((d) => d.nomeIt)]);
    return { character: target, opzioni, rispostaCorretta: target.nomeIt };
  });
}

export function poolSufficiente(pool: Character[]): boolean {
  return pool.length >= OPTIONS_PER_QUESTION;
}
