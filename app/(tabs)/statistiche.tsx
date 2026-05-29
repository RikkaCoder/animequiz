import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStats } from '@/hooks/useStats';
import { useAuth } from '@/hooks/useAuth';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import type { Difficolta, UserStats } from '@/types';

const LABEL_DIFFICOLTA: Record<Difficolta, string> = {
  facile: 'Facile',
  medio: 'Medio',
  difficile: 'Difficile',
};

interface TopErrore {
  characterId: string;
  nomeIt: string;
  errori: number;
  visti: number;
}

export default function StatisticheScreen() {
  const { user } = useAuth();
  const { leggiStats, leggiTopErrori } = useStats();
  const [stats, setStats] = useState<UserStats[]>([]);
  const [topErrori, setTopErrori] = useState<TopErrore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    Promise.all([leggiStats(), leggiTopErrori(5)])
      .then(([s, e]) => { setStats(s); setTopErrori(e); })
      .finally(() => setLoading(false));
  }, [user]);

  const totPartite = stats.reduce((acc, s) => acc + s.partiteGiocate, 0);
  const totCorrette = stats.reduce((acc, s) => acc + s.risposteCorrette, 0);
  const totDomande = stats.reduce(
    (acc, s) => acc + s.partiteGiocate * 10, // stima basata su 10 domande default
    0
  );
  const pctGlobale = totDomande > 0 ? Math.round((totCorrette / totDomande) * 100) : null;

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Statistiche</Text>
          <Text style={styles.info}>Accedi per vedere le tue statistiche.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Statistiche</Text>

        {loading ? (
          <ActivityIndicator color={Colors.giallo} style={{ marginTop: Spacing.xl }} />
        ) : stats.length === 0 ? (
          <Text style={styles.info}>Gioca la tua prima partita per vedere le statistiche!</Text>
        ) : (
          <>
            {/* Riepilogo globale */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Riepilogo</Text>
              <View style={styles.row}>
                <Stat label="Partite" value={String(totPartite)} />
                <Stat label="% Corrette" value={pctGlobale !== null ? `${pctGlobale}%` : '—'} />
              </View>
            </View>

            {/* Per difficoltà */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Per difficoltà</Text>
              {(['facile', 'medio', 'difficile'] as Difficolta[]).map((d) => {
                const s = stats.find((x) => x.difficolta === d);
                if (!s) return null;
                const pct = s.partiteGiocate > 0
                  ? Math.round((s.risposteCorrette / (s.partiteGiocate * 10)) * 100)
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

            {/* Top errori */}
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
  info: { color: Colors.grigioMedio, marginTop: Spacing.md },
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
});
