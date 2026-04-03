import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { fetchMatchesFromApi } from '@/lib/api';
import type { Match } from '@/lib/types';

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const matchId = useMemo(() => Number(id), [id]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMatchesFromApi();
        const found = (data ?? []).find((m: Match) => Number(m.id) === matchId) ?? null;
        if (!cancelled) setMatch(found);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load match';
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [matchId]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: match ? 'Match Details' : 'Match' }} />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : !match ? (
        <Text style={styles.muted}>Match not found.</Text>
      ) : (
        <View style={styles.card}>
          <Text style={styles.title}>{match.matchName}</Text>
          <View style={styles.metaPill}>
            <Text style={styles.metaLabel}>{match.category}</Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaPillAlt}>
              <Text style={styles.metaLabel}>{match.date}</Text>
            </View>
            <Text style={styles.dot}>•</Text>
            <View style={styles.metaPillAlt}>
              <Text style={styles.metaLabel}>{match.venue}</Text>
            </View>
          </View>
          <Text style={styles.status}>{(match.status ?? '').toUpperCase()}</Text>

          <View style={styles.divider} />

          <Text style={styles.section}>Teams</Text>
          <View style={styles.teamCard}>
            <Text style={styles.team}>{match.team1?.name}</Text>
            <Text style={styles.team}>{match.team2?.name}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F9FC',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0B1B3A',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 6,
    shadowColor: '#0B1B3A',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  metaLabel: {
    fontSize: 12,
    color: '#0B1B3A',
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FFD100',
  },
  metaPillAlt: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },
  dot: {
    fontSize: 12,
    color: '#9DB7FF',
    fontWeight: '800',
  },
  status: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '800',
    color: '#FFD100',
  },
  divider: {
    marginVertical: 10,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  section: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  teamCard: {
    marginTop: 6,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#122554',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 6,
  },
  team: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  muted: {
    fontSize: 12,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 12,
    opacity: 0.8,
  },
});
