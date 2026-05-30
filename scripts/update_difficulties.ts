/**
 * Aggiorna le difficoltà dei Pokémon Gen 1 nel DB in base ai dati reali
 * di riconoscimento (fonte: JetPunk quiz stats).
 *
 * Fascia:
 *   >= 75% → facile
 *   60-74% → medio
 *   50-59% → difficile
 *   < 50%  → estremo
 *
 * Eseguire con: npm run update-difficulties
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceKey);

// numero_pokedex → difficolta
const DIFFICULTY: Record<number, 'facile' | 'medio' | 'difficile' | 'estremo'> = {
  // Facile (>= 75%)
  1:'facile',2:'facile',3:'facile',4:'facile',5:'facile',6:'facile',7:'facile',
  8:'facile',9:'facile',10:'facile',11:'facile',12:'facile',13:'facile',14:'facile',
  15:'facile',16:'facile',17:'facile',18:'facile',19:'facile',
  23:'facile',24:'facile',25:'facile',26:'facile',27:'facile',
  37:'facile',39:'facile',52:'facile',54:'facile',
  // Medio (60-74%)
  20:'medio',21:'medio',22:'medio',
  28:'medio',29:'medio',30:'medio',31:'medio',32:'medio',33:'medio',34:'medio',35:'medio',36:'medio',
  38:'medio',40:'medio',41:'medio',42:'medio',43:'medio',44:'medio',
  46:'medio',47:'medio',48:'medio',49:'medio',50:'medio',51:'medio',
  53:'medio',55:'medio',56:'medio',57:'medio',58:'medio',59:'medio',60:'medio',61:'medio',
  63:'medio',64:'medio',65:'medio',66:'medio',67:'medio',68:'medio',69:'medio',
  72:'medio',73:'medio',74:'medio',75:'medio',76:'medio',77:'medio',78:'medio',
  79:'medio',80:'medio',81:'medio',
  83:'medio',84:'medio',88:'medio',89:'medio',
  92:'medio',93:'medio',94:'medio',95:'medio',97:'medio',100:'medio',
  104:'medio',106:'medio',122:'medio',129:'medio',132:'medio',133:'medio',
  // Difficile (50-59%)
  45:'difficile',62:'difficile',70:'difficile',71:'difficile',82:'difficile',
  85:'difficile',86:'difficile',87:'difficile',90:'difficile',91:'difficile',
  96:'difficile',98:'difficile',99:'difficile',101:'difficile',105:'difficile',
  107:'difficile',108:'difficile',109:'difficile',110:'difficile',111:'difficile',
  112:'difficile',113:'difficile',114:'difficile',116:'difficile',118:'difficile',
  120:'difficile',121:'difficile',123:'difficile',124:'difficile',126:'difficile',
  128:'difficile',130:'difficile',131:'difficile',134:'difficile',135:'difficile',
  136:'difficile',137:'difficile',144:'difficile',145:'difficile',147:'difficile',
  149:'difficile',150:'difficile',151:'difficile',
  // Estremo (< 50%)
  102:'estremo',103:'estremo',115:'estremo',117:'estremo',119:'estremo',
  125:'estremo',127:'estremo',138:'estremo',139:'estremo',140:'estremo',
  141:'estremo',142:'estremo',146:'estremo',148:'estremo',
};

async function main() {
  const { data: franchise } = await supabase
    .from('franchises')
    .select('id')
    .eq('slug', 'pokemon')
    .single();

  if (!franchise) { console.error('Franchise pokemon non trovato'); process.exit(1); }

  const groups = { facile: [] as number[], medio: [] as number[], difficile: [] as number[], estremo: [] as number[] };
  for (const [num, diff] of Object.entries(DIFFICULTY)) {
    groups[diff].push(Number(num));
  }

  let updated = 0;
  for (const [diff, numeri] of Object.entries(groups)) {
    const { error, data } = await supabase
      .from('characters')
      .update({ difficolta: diff })
      .eq('franchise_id', franchise.id)
      .in('numero_ordine', numeri)
      .select('id');
    const count = data?.length;

    if (error) { console.error(`Errore su ${diff}:`, error.message); continue; }
    console.log(`${diff}: ${count ?? '?'} aggiornati`);
    updated += count ?? 0;
  }

  console.log(`\nTotale aggiornati: ${updated}/151`);
}

main().catch(console.error);
