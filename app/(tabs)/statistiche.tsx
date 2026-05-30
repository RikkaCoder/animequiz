import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStats } from '@/hooks/useStats';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalStats } from '@/hooks/useGlobalStats';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { ClassificaEntry, PokemonDifficile } from '@/hooks/useGlobalStats';
import type { Difficolta, UserStats } from '@/types';

const LABEL_DIFFICOLTA: Record<Difficolta, string> = {
  facile: 'Facile',
  medio: 'Medio',
  difficile: 'Difficile',
  estremo: 'Estremo',
};

const AVATAR_EMOJI: Record<string, string> = {
  pikachu: '⚡',
  charmander: '🔥',
  bulbasaur: '🌿',
  squirtle: '💧',
  eevee: '🦊',
  jigglypuff: '🎵',
};

const MEDAL = ['🥇', '🥈', '🥉'];

interface TopErrore {
  characterId: string;
  nomeIt: string;
  errori: number;
  visti: number;
}

type Tab = 'personale' | 'globale';

export default function StatisticheScreen() {
  const { user } = useAuth();
  const { leggiStats, leggiTopErrori } = useStats();
  const { leggiClassifica, leggiPokemonPiuDifficili } = useGlobalStats();

  const [tab, setTab] = useState<Tab>('personale');

  const [stats, setStats] = useState<UserStats[]>([]);
  const [topErrori, setTopErrori] = useState<TopErrore[]>([]);
  const [loadingPersonale, setLoadingPersonale] = useState(true);

  const [classifica, setClassifica] = useState<ClassificaEntry[]>([]);
  const [pokemonDifficili, setPokemonDifficili] = useState<PokemonDifficile[]>([]);
  const [loadingGlobale, setLoadingGlobale] = useState(true);

  useEffect(() => {
    if (!user) { setLoadingPersonale(false); return; }
    Promise.all([leggiStats(), leggiTopErrori(5)])
      .then(([s, e]) => { setStats(s); setTopErrori(e); })
      .finally(() => setLoadingPersonale(false));
  }, [user]);

  useEffect(() => {
    if (!user) { setLoadingGlobale(false); return; }
    Promise.all([leggiClassifica(), leggiPokemonPiuDifficili(5)])
      .then(([c, p]) => { setClassifica(c); setPokemonDifficili(p); })
      .finally(() => setLoadingGlobale(false));
  }, [user]);

  const totPartite = stats.reduce((acc, s) => acc + s.partiteGiocate, 0);
  const totCorrette = stats.reduce((acc, s) => acc + s.risposteCorrette, 0);
  const totDomande = stats.reduce((acc, s) => acc + s.domandeTotali, 0);
  const pctGlobale = totDomande > 0 ? Math.round((totCorrette / totDomande) * 100) : null;

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Statistiche</Text>
          <Text style={styles.info}>Accedi per vedere le statistiche.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Statistiche</Text>

        {/* Tab selector */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'personale' && styles.tabBtnActive]}
            onPress={() => setTab('personale')}
          >
            <Text style={[styles.tabLabel, tab === 'personale' && styles.tabLabelActive]}>
              Le mie
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'globale' && styles.tabBtnActive]}
            onPress={() => setTab('globale')}
          >
            <Text style={[styles.tabLabel, tab === 'globale' && styles.tabLabelActive]}>
              Globale
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB PERSONALE */}
        {tab === 'personale' && (
          loadingPersonale ? (
            <ActivityIndicator color={Colors.giallo} style={{ marginTop: Spacing.xl }} />
          ) : stats.length === 0 ? (
            <Text style={styles.info}>Gioca la tua prima partita per vedere le statistiche!</Text>
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Riepilogo</Text>
                <View style={styles.row}>
                  <Stat label="Partite" value={String(totPartite)} />
                  <Stat label="% Corrette" value={pctGlobale !== null ? `${pctGlobale}%` : '—'} />
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Per difficoltà</Text>
                {(['facile', 'medio', 'difficile', 'estremo'] as Difficolta[]).map((d) => {
                  const s = stats.find((x) => x.difficolta === d);
                  if (!s) return null;
                  const pct = s.domandeTotali > 0
                    ? Math.round((s.risposteCorrette / s.domandeTotali) * 100)
                    : 0;
                  return (
                    <View key={d} style={styles.diffRow}>
                      <Text style={styles.diffLabel}>{LABEL_DIFFICOLTA[d]}</Text>
                      <Text style={styles.diffStat}>{s.partiteGiocate} partite</Text>
                      <Text style={styles.diffStat}>{pct}%</Text>
                      <Text style={styles.diffStat}>rec. {s.recordPunteggio}</Text>
                    </View>
                  );
                })}
              </View>

              {topErrori.length > 0 && (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Da ripassare</Text>
                  {topErrori.map((e) => {
                    const pctErr = e.visti > 0 ? Math.round((e.errori / e.visti) * 100) : 0;
                    return (
                      <View key={e.characterId} style={styles.erroreRow}>
                        <Text style={styles.erroreNome}>{e.nomeIt}</Text>
                        <Text style={styles.erroreDetail}>{e.errori} errori su {e.visti} ({pctErr}%)</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          )
        )}

        {/* TAB GLOBALE */}
        {tab === 'globale' && (
          loadingGlobale ? (
            <ActivityIndicator color={Colors.giallo} style={{ marginTop: Spacing.xl }} />
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>🏆 Classifica</Text>
                {classifica.length === 0 ? (
                  <Text style={styles.info}>Nessun dato ancora.</Text>
                ) : (
                  classifica.map((entry) => (
                    <View key={`${entry.userId}-${entry.difficolta}`} style={styles.classificaRow}>
                      <Text style={styles.classificaRank}>
                        {MEDAL[entry.rank - 1] ?? `#${entry.rank}`}
                      </Text>
                      <Text style={styles.classificaAvatar}>
                        {AVATAR_EMOJI[entry.avatarId] ?? '❓'}
                      </Text>
                      <Text style={styles.classificaNick} numberOfLines={1}>{entry.nickname}</Text>
                      <Text style={styles.classificaDiff}>{LABEL_DIFFICOLTA[entry.difficolta]}</Text>
                      <Text style={styles.classificaPunteggio}>{entry.recordPunteggio} pt</Text>
                    </View>
                  ))
                )}
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>💀 Pokémon più difficili</Text>
                {pokemonDifficili.length === 0 ? (
                  <Text style={styles.info}>Servono almeno 3 visualizzazioni per personaggio.</Text>
                ) : (
                  pokemonDifficili.map((p) => (
                    <View key={p.characterId} style={styles.erroreRow}>
                      <Text style={styles.erroreNome}>{p.nomeIt}</Text>
                      <Text style={styles.erroreDetail}>
                        {p.percentualeErrore}% di errori · {p.totaleVisti} tentativi
                      </Text>
                    </View>
                  ))
                )}
              </View>
            </>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bluNotte },
  content: { padding: Spacing.lg, gap: Spacing.md },
  title: { fontSize: Typography.sizes.h1, fontWeight: '800', color: Colors.giallo },
  info: { color: Colors.grigioMedio, marginTop: Spacing.sm },
  tabRow: { flexDirection: 'row', gap: Spacing.sm },
  tabBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.bianco,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: Colors.giallo },
  tabLabel: { fontWeight: '700', color: Colors.grigioMedio },
  tabLabelActive: { color: Colors.bluNotte },
  card: {
    backgroundColor: Colors.bianco,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardTitle: { fontSize: Typography.sizes.h3, fontWeight: '700', color: Colors.bluNotte },
  row: { flexDirection: 'row', gap: Spacing.md },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: Spacing.sm },
  statValue: { fontSize: Typography.sizes.h1, fontWeight: '800', color: Colors.rosso },
  statLabel: { fontSize: Typography.sizes.small, color: Colors.grigioMedio },
  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grigioChiaro,
  },
  diffLabel: { flex: 1, fontWeight: '600', color: Colors.grigioScuro },
  diffStat: { fontSize: Typography.sizes.small, color: Colors.grigioMedio, minWidth: 64, textAlign: 'right' },
  erroreRow: {
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grigioChiaro,
  },
  erroreNome: { fontWeight: '600', color: Colors.grigioScuro },
  erroreDetail: { fontSize: Typography.sizes.small, color: Colors.grigioMedio },
  classificaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grigioChiaro,
  },
  classificaRank: { fontSize: Typography.sizes.body, minWidth: 32 },
  classificaAvatar: { fontSize: 20 },
  classificaNick: { flex: 1, fontWeight: '600', color: Colors.grigioScuro },
  classificaDiff: { fontSize: Typography.sizes.tiny, color: Colors.grigioMedio, textTransform: 'capitalize' },
  classificaPunteggio: { fontWeight: '700', color: Colors.rosso, minWidth: 48, textAlign: 'right' },
});
