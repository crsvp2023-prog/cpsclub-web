import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { fetchMatchesFromApi } from '@/lib/api';
import type { Match } from '@/lib/types';
import AppHeader from '@/components/AppHeader';

function MatchRow({ match, tint }: { match: Match; tint: string }) {
  const status = (match.status ?? '').toUpperCase();
  const statusTheme =
    status === 'UPCOMING'
      ? { bg: '#EAF7EE', text: '#166534' }
      : status === 'LIVE'
      ? { bg: '#FEF2F2', text: '#B91C1C' }
      : { bg: '#E9F0FF', text: tint };
  return (
    <Link href={`/matches/${match.id}`} asChild>
      <Pressable style={styles.row}>
        <Text style={styles.rowTitle}>{match.matchName}</Text>
        <Text style={styles.rowMeta}>{match.date}</Text>
        <Text style={styles.rowMeta}>{match.venue}</Text>
        <View style={[styles.statusPill, { backgroundColor: statusTheme.bg }]}>
          <Text style={[styles.statusText, { color: statusTheme.text }]}>{status}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

export default function MatchesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const tint = Colors[colorScheme].tint;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMatchesFromApi();
        if (!cancelled) setMatches(data as Match[]);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load matches';
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Loading matches…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <AppHeader title="Matches" />
      </View>
      <FlatList
        data={matches}
        keyExtractor={(m) => String(m.id)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <MatchRow match={item} tint={tint} />}
        ListEmptyComponent={<Text style={styles.muted}>No matches available.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  headerWrap: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  row: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,27,58,0.08)',
    gap: 4,
    shadowColor: '#0B1B3A',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 4,
  },
  rowTitle: {
    fontWeight: '800',
    color: '#0B1B3A',
  },
  rowMeta: {
    fontSize: 12,
    color: '#5B6B8A',
  },
  statusPill: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
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
