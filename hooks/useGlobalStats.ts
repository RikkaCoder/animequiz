import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Difficolta } from '@/types';

export interface ClassificaEntry {
  rank: number;
  userId: string;
  nickname: string;
  avatarId: string;
  difficolta: Difficolta;
  recordPunteggio: number;
  domandeTotali: number;
}

export interface PokemonDifficile {
  characterId: string;
  nomeIt: string;
  percentualeErrore: number;
  totaleVisti: number;
}

export function useGlobalStats() {
  const leggiClassifica = useCallback(
    async (difficolta?: Difficolta): Promise<ClassificaEntry[]> => {
      let query = supabase
        .from('user_stats')
        .select('user_id, difficolta, record_punteggio, domande_totali')
        .order('record_punteggio', { ascending: false })
        .limit(10);

      if (difficolta) query = query.eq('difficolta', difficolta);

      const { data: stats, error } = await query;
      if (error || !stats?.length) return [];

      const userIds = [...new Set(stats.map((s) => s.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nickname, avatar_id')
        .in('id', userIds);

      const profileMap = new Map(
        (profiles ?? []).map((p) => [p.id, { nickname: p.nickname, avatarId: p.avatar_id }])
      );

      return stats.map((s, i) => ({
        rank: i + 1,
        userId: s.user_id,
        nickname: profileMap.get(s.user_id)?.nickname ?? '—',
        avatarId: profileMap.get(s.user_id)?.avatarId ?? '',
        difficolta: s.difficolta as Difficolta,
        recordPunteggio: s.record_punteggio,
        domandeTotali: s.domande_totali,
      }));
    },
    []
  );

  const leggiPokemonPiuDifficili = useCallback(
    async (limit = 5): Promise<PokemonDifficile[]> => {
      const { data: errors } = await supabase
        .from('character_errors')
        .select('character_id, volte_errato, volte_visto');

      if (!errors?.length) return [];

      // Aggrega per personaggio su tutti gli utenti
      const aggregate = new Map<string, { errato: number; visto: number }>();
      for (const row of errors) {
        const existing = aggregate.get(row.character_id) ?? { errato: 0, visto: 0 };
        aggregate.set(row.character_id, {
          errato: existing.errato + row.volte_errato,
          visto: existing.visto + row.volte_visto,
        });
      }

      // Almeno 3 visualizzazioni per essere significativo
      const candidati = [...aggregate.entries()]
        .filter(([, v]) => v.visto >= 3)
        .map(([characterId, v]) => ({
          characterId,
          percentualeErrore: Math.round((v.errato / v.visto) * 100),
          totaleVisti: v.visto,
        }))
        .sort((a, b) => b.percentualeErrore - a.percentualeErrore)
        .slice(0, limit);

      if (!candidati.length) return [];

      const ids = candidati.map((c) => c.characterId);
      const { data: chars } = await supabase
        .from('characters')
        .select('id, nome_it')
        .in('id', ids);

      const nameMap = new Map(chars?.map((c) => [c.id, c.nome_it]) ?? []);

      return candidati.map((c) => ({
        ...c,
        nomeIt: nameMap.get(c.characterId) ?? '—',
      }));
    },
    []
  );

  return { leggiClassifica, leggiPokemonPiuDifficili };
}
