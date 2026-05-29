/**
 * Data access layer per characters e franchises.
 * Tutte le query a queste tabelle passano da qui: un solo punto da
 * modificare se cambia lo schema o si aggiunge caching.
 */
import { supabase } from '@/lib/supabase';
import { mapCharacter, mapFranchise } from '@/lib/mappers';
import type { Character, Difficolta, Franchise } from '@/types';

export async function getFranchisesAttivi(): Promise<Franchise[]> {
  const { data, error } = await supabase
    .from('franchises')
    .select('*')
    .eq('attivo', true)
    .order('nome');

  if (error) throw error;
  return (data ?? []).map(mapFranchise);
}

export async function getCharactersByFranchise(
  franchiseId: string
): Promise<Character[]> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('franchise_id', franchiseId)
    .eq('attivo', true);

  if (error) throw error;
  return (data ?? []).map(mapCharacter);
}

/**
 * Restituisce i character di un franchise filtrati per difficoltà.
 * 'facile' = solo personaggi facili; 'medio'/'difficile' attingono a pool
 * più ampi (la logica di pesatura vive in utils/difficulty.ts).
 */
export async function getCharactersForQuiz(
  franchiseId: string,
  difficolta: Difficolta
): Promise<Character[]> {
  let query = supabase
    .from('characters')
    .select('*')
    .eq('franchise_id', franchiseId)
    .eq('attivo', true);

  if (difficolta === 'facile') {
    query = query.eq('difficolta', 'facile');
  }
  // medio e difficile usano tutti i personaggi; la selezione fine
  // dei distrattori avviene in fase di costruzione del quiz.

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapCharacter);
}
