/**
 * Tipi delle tabelle Supabase (snake_case, come nel DB).
 * In un progetto reale questo file si genera con:
 *   npx supabase gen types typescript --project-id XXX > types/database.ts
 * Qui è scritto a mano come riferimento per la beta.
 */

export type Difficolta = 'facile' | 'medio' | 'difficile';

export interface Database {
  public: {
    Tables: {
      franchises: {
        Row: {
          id: string;
          slug: string;
          nome: string;
          descrizione: string | null;
          immagine_url: string | null;
          attivo: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          nome: string;
          descrizione?: string | null;
          immagine_url?: string | null;
          attivo?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['franchises']['Insert']>;
        Relationships: [];
      };
      characters: {
        Row: {
          id: string;
          franchise_id: string;
          nome_it: string;
          nome_originale: string | null;
          immagine_url: string;
          tipo: string | null;
          difficolta: Difficolta;
          numero_ordine: number | null;
          attivo: boolean;
        };
        Insert: {
          id?: string;
          franchise_id: string;
          nome_it: string;
          nome_originale?: string | null;
          immagine_url: string;
          tipo?: string | null;
          difficolta: Difficolta;
          numero_ordine?: number | null;
          attivo?: boolean;
        };
        Update: Partial<Database['public']['Tables']['characters']['Insert']>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          nickname: string;
          avatar_id: string;
          created_at: string;
        };
        Insert: {
          id: string;
          nickname: string;
          avatar_id: string;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      user_stats: {
        Row: {
          id: string;
          user_id: string;
          franchise_id: string;
          difficolta: Difficolta;
          partite_giocate: number;
          risposte_corrette: number;
          record_punteggio: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          franchise_id: string;
          difficolta: Difficolta;
          partite_giocate?: number;
          risposte_corrette?: number;
          record_punteggio?: number;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['user_stats']['Insert']>;
        Relationships: [];
      };
      character_errors: {
        Row: {
          id: string;
          user_id: string;
          character_id: string;
          volte_visto: number;
          volte_errato: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          character_id: string;
          volte_visto?: number;
          volte_errato?: number;
        };
        Update: Partial<Database['public']['Tables']['character_errors']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
