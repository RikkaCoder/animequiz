import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { mapUserStats } from '@/lib/mappers';
import type { AnswerResult, Difficolta, UserStats } from '@/types';

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

interface SaveResultArgs {
  franchiseId: string;
  difficolta: Difficolta;
  risposte: AnswerResult[];
  punteggio: number;
}

export function useStats() {
  const salvaPartita = useCallback(
    async ({ franchiseId, difficolta, risposte, punteggio }: SaveResultArgs) => {
      const userId = await currentUserId();
      if (!userId) return;

      const { data: existing } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('franchise_id', franchiseId)
        .eq('difficolta', difficolta)
        .maybeSingle();

      const corrette = risposte.filter((r) => r.corretto).length;

      if (existing) {
        await supabase
          .from('user_stats')
          .update({
            partite_giocate: existing.partite_giocate + 1,
            risposte_corrette: existing.risposte_corrette + corrette,
            record_punteggio: Math.max(existing.record_punteggio, punteggio),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('user_stats').insert({
          user_id: userId,
          franchise_id: franchiseId,
          difficolta,
          partite_giocate: 1,
          risposte_corrette: corrette,
          record_punteggio: punteggio,
        });
      }

      for (const r of risposte) {
        const { data: ce } = await supabase
          .from('character_errors')
          .select('*')
          .eq('user_id', userId)
          .eq('character_id', r.characterId)
          .maybeSingle();

        if (ce) {
          await supabase
            .from('character_errors')
            .update({
              volte_visto: ce.volte_visto + 1,
              volte_errato: ce.volte_errato + (r.corretto ? 0 : 1),
            })
            .eq('id', ce.id);
        } else {
          await supabase.from('character_errors').insert({
            user_id: userId,
            character_id: r.characterId,
            volte_visto: 1,
            volte_errato: r.corretto ? 0 : 1,
          });
        }
      }
    },
    []
  );

  const leggiStats = useCallback(async (): Promise<UserStats[]> => {
    const userId = await currentUserId();
    if (!userId) return [];
    const { data } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    return (data ?? []).map(mapUserStats);
  }, []);

  const leggiTopErrori = useCallback(
    async (limit = 5): Promise<{ characterId: string; nomeIt: string; errori: number; visti: number }[]> => {
      const userId = await currentUserId();
      if (!userId) return [];

      const { data: errors } = await supabase
        .from('character_errors')
        .select('character_id, volte_errato, volte_visto')
        .eq('user_id', userId)
        .gt('volte_errato', 0)
        .order('volte_errato', { ascending: false })
        .limit(limit);

      if (!errors?.length) return [];

      const ids = errors.map((e) => e.character_id);
      const { data: chars } = await supabase
        .from('characters')
        .select('id, nome_it')
        .in('id', ids);

      const nameMap = new Map(chars?.map((c) => [c.id, c.nome_it]) ?? []);

      return errors.map((row) => ({
        characterId: row.character_id,
        nomeIt: nameMap.get(row.character_id) ?? '—',
        errori: row.volte_errato,
        visti: row.volte_visto,
      }));
    },
    []
  );

  return { salvaPartita, leggiStats, leggiTopErrori };
}
