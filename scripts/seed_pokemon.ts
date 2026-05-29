/**
 * Script di seed — una tantum.
 * Scarica i 151 Pokémon Gen 1 dalla PokéAPI, ne carica le immagini su
 * Supabase Storage e inserisce i record nella tabella `characters`.
 *
 * Eseguire con:  npm run seed
 * Richiede in .env: EXPO_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
 *
 * NB: usa la service_role key (bypassa RLS) — eseguire SOLO in locale,
 *     mai includere questa chiave nell'app.
 */
import { createClient } from '@supabase/supabase-js';
import { NOMI_ITALIANI } from './pokemon_it';
import { GEN1_COUNT } from '../constants/config';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const admin = createClient(url, serviceKey);

// Tipi PokéAPI → tipo italiano (mappa parziale di esempio).
const TIPI_IT: Record<string, string> = {
  fire: 'Fuoco', water: 'Acqua', grass: 'Erba', electric: 'Elettro',
  poison: 'Veleno', flying: 'Volante', bug: 'Coleottero', normal: 'Normale',
  ground: 'Terra', rock: 'Roccia', fighting: 'Lotta', psychic: 'Psico',
  ghost: 'Spettro', ice: 'Ghiaccio', dragon: 'Drago', fairy: 'Folletto',
  steel: 'Acciaio', dark: 'Buio',
};

// Difficoltà di base in funzione della "popolarità": gli starter e i
// leggendari più noti sono 'facile'; il resto 'medio'. Affinabile a mano.
const FACILI = new Set([1, 4, 7, 25, 6, 9, 3, 150, 151, 39, 52, 143]);

async function seedFranchise(): Promise<string> {
  const { data, error } = await admin
    .from('franchises')
    .upsert({ slug: 'pokemon', nome: 'Pokémon', attivo: true }, { onConflict: 'slug' })
    .select()
    .single();
  if (error) throw error;
  return data.id;
}

async function fetchPokemon(id: number) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) throw new Error(`PokéAPI ${id}: ${res.status}`);
  const data = await res.json();
  const artwork: string =
    data.sprites.other['official-artwork'].front_default ?? data.sprites.front_default;
  const tipoEn: string = data.types[0]?.type?.name ?? 'normal';
  return { artwork, tipo: TIPI_IT[tipoEn] ?? 'Normale' };
}

async function uploadImage(id: number, sourceUrl: string): Promise<string> {
  const img = await fetch(sourceUrl);
  const buffer = Buffer.from(await img.arrayBuffer());
  const path = `pokemon/${id}.png`;
  const { error } = await admin.storage
    .from('characters')
    .upload(path, buffer, { contentType: 'image/png', upsert: true });
  if (error) throw error;
  const { data } = admin.storage.from('characters').getPublicUrl(path);
  return data.publicUrl;
}

async function main() {
  console.log('Seed avviato…');
  const franchiseId = await seedFranchise();

  for (let id = 1; id <= GEN1_COUNT; id++) {
    const nomeIt = NOMI_ITALIANI[id];
    if (!nomeIt) {
      console.warn(`Nome italiano mancante per #${id}, salto.`);
      continue;
    }
    const { artwork, tipo } = await fetchPokemon(id);
    const immagineUrl = await uploadImage(id, artwork);

    const { error } = await admin.from('characters').upsert(
      {
        franchise_id: franchiseId,
        nome_it: nomeIt,
        nome_originale: nomeIt, // per Pokémon il nome IT coincide spesso con l'originale
        immagine_url: immagineUrl,
        tipo,
        difficolta: FACILI.has(id) ? 'facile' : 'medio',
        numero_ordine: id,
        attivo: true,
      },
      { onConflict: 'franchise_id,numero_ordine' }
    );
    if (error) throw error;
    console.log(`#${id} ${nomeIt} ✓`);
  }

  console.log('Seed completato.');
}

main().catch((e) => {
  console.error('Seed fallito:', e);
  process.exit(1);
});
