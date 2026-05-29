# Anime Quiz

App mobile quiz a tema anime (beta), costruita con Expo + React Native e Supabase.
Architettura **multi-franchise**: pensata per espandersi a Dragon Ball, Naruto e altri
universi semplicemente aggiungendo dati al database.

## Stack

- **Expo / React Native** — app cross-platform iOS/Android
- **Expo Router** — routing file-based
- **Supabase** — database PostgreSQL, autenticazione, storage immagini
- **Zustand** — state management dello stato di gioco
- **TypeScript** — tipizzazione end-to-end (DB → dominio → UI)

## Struttura del progetto

```
animequiz/
├── app/                  # schermate (Expo Router)
│   ├── (tabs)/           # Home, Statistiche, Profilo
│   ├── auth/             # Login / registrazione
│   ├── impostazioni.tsx  # Scelta difficoltà + lunghezza
│   ├── quiz.tsx          # Schermata di gioco
│   └── risultato.tsx     # Punteggio + ripasso errori
├── components/           # CharacterCard, OptionButton, PixelButton
├── lib/                  # client Supabase, data access, mappers
├── hooks/                # useAuth, useStats, useSound
├── store/                # quizStore (Zustand)
├── utils/                # difficulty, random (logica pura)
├── constants/            # theme, config
├── types/                # tipi di dominio + tipi database
├── scripts/              # schema.sql, seed_pokemon.ts, pokemon_it.ts
└── assets/               # suoni, font
```

### Principi di design del codice

- **Separazione netta tra dati e UI**: i componenti non chiamano mai Supabase
  direttamente; passano da `lib/`.
- **Logica pura testabile**: `utils/difficulty.ts` e `utils/random.ts` non hanno
  side effect, quindi sono facili da testare in isolamento.
- **Mapping snake_case → camelCase** in `lib/mappers.ts`: l'app non dipende dalla
  forma esatta delle tabelle.
- **Multi-franchise dal giorno 1**: nessun riferimento hardcoded ai franchise nella
  logica; tutto passa da `franchise_id`.

## Setup

1. Installa le dipendenze:
   ```bash
   npm install
   ```
2. Crea un progetto su [supabase.com](https://supabase.com) ed esegui
   `scripts/schema.sql` nell'SQL Editor.
3. Crea un bucket Storage pubblico chiamato `characters`.
4. Copia `.env.example` in `.env` e inserisci le tue credenziali.
5. Popola i dati del franchise:
   ```bash
   npm run seed
   ```
6. Avvia l'app:
   ```bash
   npm start
   ```

## Stato attuale (beta)

- [x] Scheletro del progetto e architettura
- [x] Schema database + RLS
- [x] Client Supabase + auth
- [x] Logica quiz (difficoltà, distrattori)
- [x] Schermate principali (home, impostazioni, quiz, risultato)
- [x] Script di seed da PokéAPI (Pokémon Gen 1)
- [x] Completare i 151 nomi italiani (`scripts/pokemon_it.ts`)
- [x] Onboarding profilo (nickname + avatar)
- [x] Schermata statistiche con dati reali
- [x] Asset audio (WAV generati via script)
- [ ] Animazioni

## Espansione futura

Per aggiungere un franchise (es. Dragon Ball):
1. Inserire una riga in `franchises`.
2. Popolare `characters` con i personaggi (script dedicato o inserimento manuale).
3. Caricare le immagini nel bucket `characters/<franchise>/`.

Nessuna modifica al codice dell'app è necessaria.
