/**
 * Mapper tra i tipi del database (snake_case) e i tipi di dominio (camelCase).
 * Isola il resto dell'app dalla forma esatta delle tabelle Supabase.
 */
import type { Database } from '@/types/database';
import type { Character, Franchise, Profile, UserStats } from '@/types';

type CharacterRow = Database['public']['Tables']['characters']['Row'];
type FranchiseRow = Database['public']['Tables']['franchises']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type UserStatsRow = Database['public']['Tables']['user_stats']['Row'];

export function mapCharacter(row: CharacterRow): Character {
  return {
    id: row.id,
    franchiseId: row.franchise_id,
    nomeIt: row.nome_it,
    nomeOriginale: row.nome_originale,
    immagineUrl: row.immagine_url,
    tipo: row.tipo,
    difficolta: row.difficolta,
    numeroOrdine: row.numero_ordine,
    attivo: row.attivo,
  };
}

export function mapFranchise(row: FranchiseRow): Franchise {
  return {
    id: row.id,
    slug: row.slug,
    nome: row.nome,
    descrizione: row.descrizione,
    immagineUrl: row.immagine_url,
    attivo: row.attivo,
    createdAt: row.created_at,
  };
}

export function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    nickname: row.nickname,
    avatarId: row.avatar_id,
    createdAt: row.created_at,
  };
}

export function mapUserStats(row: UserStatsRow): UserStats {
  return {
    id: row.id,
    userId: row.user_id,
    franchiseId: row.franchise_id,
    difficolta: row.difficolta,
    partiteGiocate: row.partite_giocate,
    risposteCorrette: row.risposte_corrette,
    domandeTotali: row.domande_totali,
    recordPunteggio: row.record_punteggio,
    updatedAt: row.updated_at,
  };
}
