import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { Text, View } from '@/components/Themed';
import { fetchMatchesFromApi } from '@/lib/api';
import type { Match } from '@/lib/types';
import { firestore } from '@/lib/firebase';
import { useAuth } from '@/lib/auth';
import AppHeader from '@/components/AppHeader';

type AvailabilityChoice = 'playing' | 'maybe' | 'not_playing';

export default function PollsScreen() {
  const { firebaseUser, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [publishedTeam, setPublishedTeam] = useState<string[]>([]);

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

  const nextMatch = useMemo(() => {
    return matches.find((m) => (m.status ?? '').toUpperCase() === 'UPCOMING') ?? matches[0] ?? null;
  }, [matches]);

  const getSydneyParts = () => {
    const dtf = new Intl.DateTimeFormat('en-AU', {
      timeZone: 'Australia/Sydney',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const parts = dtf.formatToParts(new Date());
    const weekday = parts.find((p) => p.type === 'weekday')?.value ?? '';
    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? '0');
    const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? '0');
    return { weekday, hour, minute };
  };

  const pollIsOpen = () => {
    const { weekday, hour } = getSydneyParts();
    if (['Mon', 'Tue', 'Wed'].includes(weekday)) return true;
    if (weekday === 'Thu') return hour < 23;
    return false;
  };

  const isFriday = () => getSydneyParts().weekday === 'Fri';

  useEffect(() => {
    if (!nextMatch || !isFriday()) return;
    let cancelled = false;
    (async () => {
      try {
        const teamRef = doc(firestore, 'matchTeams', String(nextMatch.id));
        const snap = await getDoc(teamRef);
        if (!snap.exists()) return;
        const data = snap.data() as { players?: string[] };
        if (!cancelled) setPublishedTeam(data.players ?? []);
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [nextMatch]);

  const submitVote = async (choice: AvailabilityChoice) => {
    if (!firebaseUser || !nextMatch) return;
    if (!pollIsOpen()) return;
    const voteId = `${nextMatch.id}_${firebaseUser.uid}`;
    const voteRef = doc(collection(firestore, 'matchPollVotes'), voteId);
    await setDoc(voteRef, {
      matchId: nextMatch.id,
      matchName: nextMatch.matchName,
      date: nextMatch.date,
      venue: nextMatch.venue,
      team1: nextMatch.team1?.name || '',
      team2: nextMatch.team2?.name || '',
      userId: firebaseUser.uid,
      userEmail: firebaseUser.email || '',
      choice,
      createdAt: serverTimestamp(),
    });
    setSubmitted(true);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.muted}>Loading poll…</Text>
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
      <AppHeader title="Match Poll" />
      <Text style={styles.heading}>Match Poll</Text>
      {!firebaseUser && !authLoading ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign in required</Text>
          <Text style={styles.cardMeta}>Only members can vote. Results are private.</Text>
          <Link href="/login" asChild>
            <Pressable style={styles.signInButton}>
              <Text style={styles.signInText}>Sign In</Text>
            </Pressable>
          </Link>
        </View>
      ) : !nextMatch ? (
        <Text style={styles.muted}>No upcoming match found.</Text>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{nextMatch.matchName}</Text>
          <Text style={styles.cardMeta}>{nextMatch.date}</Text>
          <Text style={styles.cardMeta}>{nextMatch.venue}</Text>

          {!pollIsOpen() ? (
            <View style={styles.confirmPill}>
              <Text style={styles.confirmText}>Poll closed • Team publishes Friday</Text>
            </View>
          ) : submitted ? (
            <View style={styles.confirmPill}>
              <Text style={styles.confirmText}>✅ Vote submitted</Text>
            </View>
          ) : (
            <View style={styles.buttonRow}>
              <Pressable style={[styles.choiceButton, styles.choiceYes]} onPress={() => submitVote('playing')}>
                <Text style={styles.choiceText}>Playing</Text>
              </Pressable>
              <Pressable style={[styles.choiceButton, styles.choiceMaybe]} onPress={() => submitVote('maybe')}>
                <Text style={styles.choiceText}>Maybe</Text>
              </Pressable>
              <Pressable style={[styles.choiceButton, styles.choiceNo]} onPress={() => submitVote('not_playing')}>
                <Text style={styles.choiceText}>Not Playing</Text>
              </Pressable>
            </View>
          )}

          {isFriday() && (
            <View style={styles.teamSection}>
              <Text style={styles.teamLabel}>Published Team</Text>
              {publishedTeam.length === 0 ? (
                <Text style={styles.cardMeta}>Team not published yet.</Text>
              ) : (
                <Text style={styles.teamList}>{publishedTeam.join(', ')}</Text>
              )}
            </View>
          )}

          <Text style={styles.cardFootnote}>Votes are private and visible only to admins.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
    backgroundColor: '#F7F9FC',
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B1B3A',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0B1B3A',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardMeta: {
    fontSize: 12,
    color: '#C7D7FF',
  },
  cardFootnote: {
    marginTop: 8,
    fontSize: 11,
    color: '#9DB7FF',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  choiceButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  choiceYes: {
    backgroundColor: '#22C55E',
  },
  choiceMaybe: {
    backgroundColor: '#F59E0B',
  },
  choiceNo: {
    backgroundColor: '#EF4444',
  },
  choiceText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  confirmPill: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#1E293B',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  confirmText: {
    color: '#E6EEFF',
    fontWeight: '800',
    fontSize: 12,
  },
  signInButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: '#22C55E',
  },
  signInText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  teamSection: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.18)',
  },
  teamLabel: {
    fontSize: 11,
    color: '#FFD100',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  teamList: {
    fontSize: 12,
    color: '#E6EEFF',
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  muted: {
    fontSize: 12,
    color: '#5B6B8C',
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
  },
});
