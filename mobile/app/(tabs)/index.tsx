import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, ScrollView, StyleSheet, View as RNView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { SvgXml } from 'react-native-svg';
import { BlurView } from 'expo-blur';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { fetchMatchesFromApi } from '@/lib/api';
import type { Match } from '@/lib/types';
import { CPSC_LOGO_XML } from '@/assets/images/cpscLogo';
import { JICS_LOGO_XML } from '@/assets/images/sponsors';
import AppHeader from '@/components/AppHeader';
import RemoteLottie from '@/components/RemoteLottie';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const tint = Colors[colorScheme].tint;
  const tintTextColor = colorScheme === 'dark' ? '#000' : '#fff';

  const glowAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const sponsorAnim = useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [countdown, setCountdown] = useState<string>('');

  const lottieHeroUrl = process.env.EXPO_PUBLIC_LOTTIE_HOME_URL ?? '';

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

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1400, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1400, useNativeDriver: false }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(cardAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(cardAnim, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(shimmerAnim, { toValue: 1, duration: 2600, useNativeDriver: true })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(sponsorAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(sponsorAnim, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    ).start();
  }, [glowAnim, cardAnim, shimmerAnim, sponsorAnim]);

  const nextMatch = useMemo(() => {
    return matches.find((m) => (m.status ?? '').toUpperCase() === 'UPCOMING') ?? matches[0] ?? null;
  }, [matches]);

  const isFriday = new Date().getDay() === 5;

  useEffect(() => {
    if (!nextMatch) return;

    const parseStart = () => {
      if ((nextMatch as any).startDateTime) {
        const d = new Date((nextMatch as any).startDateTime);
        if (!Number.isNaN(d.getTime())) return d;
      }

      const rawDate = nextMatch.date;
      const rawTime = (nextMatch as any).time;
      if (rawDate && rawTime && rawTime !== 'TBC') {
        const d = new Date(`${rawDate} ${rawTime}`);
        if (!Number.isNaN(d.getTime())) return d;
      }

      const fallback = new Date(rawDate || '');
      return Number.isNaN(fallback.getTime()) ? null : fallback;
    };

    const target = parseStart();
    if (!target) {
      setCountdown('TBC');
      return;
    }

    const tick = () => {
      const now = new Date().getTime();
      const diff = target.getTime() - now;
      if (diff <= 0) {
        setCountdown('Live');
        return;
      }
      const totalMinutes = Math.floor(diff / 60000);
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = totalMinutes % 60;
      const parts = [
        days > 0 ? `${days}d` : null,
        `${hours}h`,
        `${minutes}m`,
      ].filter(Boolean);
      setCountdown(parts.join(' '));
    };

    tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, [nextMatch]);

  return (
    <View style={styles.container}>
      <View style={styles.bgCirclePrimary} />
      <View style={styles.bgCircleAccent} />
      <View style={styles.bgCircleSoft} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AppHeader title="Home" />

        <View style={styles.logoRow}>
          <View style={styles.logoBadge}>
            <SvgXml xml={CPSC_LOGO_XML} width={28} height={28} />
          </View>
          <View>
            <Text style={styles.clubName}>CPSC</Text>
            <Text style={styles.clubTag}>Cricket • Community</Text>
          </View>
        </View>

        <Animated.View
          style={[
            styles.cardWrap,
            {
              borderColor: tint,
              backgroundColor: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(11,27,58,0.65)', 'rgba(16,48,107,0.65)'],
              }),
            },
          ]}
        >
          <BlurView intensity={18} tint="dark" style={[styles.glassCard, styles.heroCard]}>
            <Text style={styles.title}>Chatswood Premier Sports Club</Text>
            <Text style={styles.subtitle}>One Team, One Dream</Text>
            <Text style={styles.heroMeta}>Sydney • Cricket • Community</Text>
          </BlurView>
        </Animated.View>

        {!!lottieHeroUrl && (
          <RemoteLottie uri={lottieHeroUrl} style={styles.lottieHero} />
        )}

        <View style={styles.topNav}>
          <Link href="/(tabs)/matches" asChild>
            <Pressable style={[styles.topNavButton, { backgroundColor: tint }]}
            >
              <Text style={[styles.topNavText, { color: tintTextColor }]}>Matches</Text>
            </Pressable>
          </Link>
          <Link href="/(tabs)/news" asChild>
            <Pressable style={[styles.topNavButton, { backgroundColor: '#0B1B3A' }]}
            >
              <Text style={[styles.topNavText, { color: '#fff' }]}>News</Text>
            </Pressable>
          </Link>
          <Link href="/(tabs)/more" asChild>
            <Pressable style={[styles.topNavButton, { backgroundColor: '#F77737' }]}
            >
              <Text style={[styles.topNavText, { color: '#fff' }]}>More</Text>
            </Pressable>
          </Link>
        </View>

        {isFriday && nextMatch && (
          <View style={styles.fridayBanner}>
            <Text style={styles.fridayLabel}>Friday Match</Text>
            <Text style={styles.fridayTeams}>{nextMatch.team1?.name} vs {nextMatch.team2?.name}</Text>
          </View>
        )}

        <Pressable onPress={() => router.push('/(tabs)/polls')} style={styles.cardPressable}>
          <Animated.View
            style={[
              styles.cardWrap,
              {
                transform: [
                  {
                    scale: cardAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.015],
                    }),
                  },
                ],
              },
            ]}
          >
            <BlurView intensity={16} tint="dark" style={[styles.glassCard, styles.card]}> 
              <Animated.View
                style={[
                  styles.cardShimmer,
                  {
                    transform: [
                      {
                        translateX: shimmerAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-120, 260],
                        }),
                      },
                      { rotate: '-15deg' },
                    ],
                  },
                ]}
              />
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Next Match</Text>
                <View style={[styles.badge, { backgroundColor: tint }]}
                >
                  <Text style={[styles.badgeText, { color: tintTextColor }]}>Upcoming</Text>
                </View>
              </View>
              {loading ? (
                <ActivityIndicator />
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : nextMatch ? (
                <>
                  <Text style={styles.matchName}>{nextMatch.matchName}</Text>
                  <Text style={styles.muted}>{nextMatch.date}</Text>
                  <Text style={styles.muted}>{nextMatch.venue}</Text>
                  <View style={styles.countdownPill}>
                    <Text style={styles.countdownLabel}>Starts in</Text>
                    <Text style={styles.countdownValue}>{countdown || '—'}</Text>
                  </View>
                  <Link href={`/matches/${nextMatch.id}`} asChild>
                    <Pressable style={[styles.button, { backgroundColor: tint }]}
                    >
                      <Text style={[styles.buttonText, { color: tintTextColor }]}>View Details</Text>
                    </Pressable>
                  </Link>
                </>
              ) : (
                <Text style={styles.muted}>No matches available.</Text>
              )}
            </BlurView>
          </Animated.View>
        </Pressable>

        <View style={styles.quickLinks}>
          <Link href="/(tabs)/matches" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkButtonText}>Matches</Text>
            </Pressable>
          </Link>
          <Link href="/(tabs)/news" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkButtonText}>News</Text>
            </Pressable>
          </Link>
          <Link href="/(tabs)/more" asChild>
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkButtonText}>More</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.bentoGrid}>
          <RNView style={styles.bentoColumn}>
            <View style={[styles.cardWrap, styles.predictionWrap]}>
              <BlurView intensity={18} tint="light" style={[styles.glassCard, styles.predictionCard]}>
                <Text style={styles.predictionLabel}>Match Prediction</Text>
                <Text style={styles.predictionTitle}>Who wins the next match?</Text>
                <View style={styles.predictionRow}>
                  <Pressable style={[styles.predictionChip, styles.predictionChipHome]}>
                    <Text style={styles.predictionChipText}>{nextMatch?.team1?.name || 'Team A'}</Text>
                  </Pressable>
                  <Pressable style={[styles.predictionChip, styles.predictionChipAway]}>
                    <Text style={styles.predictionChipText}>{nextMatch?.team2?.name || 'Team B'}</Text>
                  </Pressable>
                </View>
                <Text style={styles.predictionNote}>Vote is private. Results announced Friday.</Text>
              </BlurView>
            </View>
          </RNView>

          <RNView style={[styles.bentoColumn, styles.bentoColumnLast]}>
            <Animated.View
              style={[
                styles.cardWrap,
                styles.sponsorWrap,
                {
                  transform: [
                    {
                      translateY: sponsorAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -4],
                      }),
                    },
                  ],
                  shadowOpacity: sponsorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.08, 0.16],
                  }),
                },
              ]}
            >
              <BlurView intensity={18} tint="light" style={[styles.glassCard, styles.sponsorCard]}>
                <Text style={styles.sponsorLabel}>Proudly powered by</Text>
                <View style={styles.sponsorRow}>
                  <View style={styles.sponsorPill}>
                    <View style={styles.sponsorLogoWrap}>
                      <SvgXml xml={JICS_LOGO_XML} width={44} height={24} />
                    </View>
                    <Text style={styles.sponsorText}>JICS Migration</Text>
                  </View>
                  <View style={styles.sponsorPill}>
                    <Image source={require('../../assets/images/sponsors/Reach.png')} style={styles.sponsorLogo} />
                    <Text style={styles.sponsorText}>Reach Property</Text>
                  </View>
                  <View style={styles.sponsorPill}>
                    <Image source={require('../../assets/images/sponsors/Chatswood-RSL.png')} style={styles.sponsorLogo} />
                    <Text style={styles.sponsorText}>Chatswood RSL</Text>
                  </View>
                  <View style={styles.sponsorPill}>
                    <Image source={require('../../assets/images/sponsors/Cricket mantra.png')} style={styles.sponsorLogo} />
                    <Text style={styles.sponsorText}>Cricket Mantra</Text>
                  </View>
                  <View style={styles.sponsorPill}>
                    <Image source={require('../../assets/images/sponsors/KRIDA.png')} style={styles.sponsorLogo} />
                    <Text style={styles.sponsorText}>KRIDA</Text>
                  </View>
                </View>
              </BlurView>
            </Animated.View>
          </RNView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
    backgroundColor: '#F7F9FC',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 32,
  },
  bgCirclePrimary: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(0,102,255,0.12)',
  },
  bgCircleAccent: {
    position: 'absolute',
    bottom: -90,
    left: -70,
    width: 240,
    height: 240,
    borderRadius: 999,
    backgroundColor: 'rgba(247,119,55,0.12)',
  },
  bgCircleSoft: {
    position: 'absolute',
    top: 120,
    left: -80,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: 'rgba(99,102,241,0.1)',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  logoBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066FF',
  },
  clubName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B1B3A',
  },
  clubTag: {
    fontSize: 11,
    opacity: 0.65,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#E6EEFF',
  },
  heroMeta: {
    marginTop: 6,
    fontSize: 12,
    color: '#C7D7FF',
  },
  cardWrap: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#0B1B3A',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 6,
    overflow: 'hidden',
  },
  glassCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroCard: {
    padding: 18,
    backgroundColor: 'rgba(12,22,48,0.45)',
  },
  lottieHero: {
    height: 120,
  },
  card: {
    backgroundColor: 'rgba(11,27,58,0.45)',
    gap: 6,
    minHeight: 170,
  },
  cardPressable: {
    borderRadius: 16,
  },
  cardShimmer: {
    position: 'absolute',
    top: -40,
    left: -120,
    width: 140,
    height: 220,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  matchName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  muted: {
    fontSize: 12,
    color: '#E6EEFF',
  },
  errorText: {
    fontSize: 12,
    opacity: 0.8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  countdownPill: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  countdownLabel: {
    fontSize: 10,
    color: '#DCE6FF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  countdownValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '800',
    marginTop: 2,
  },
  button: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontWeight: '700',
  },
  quickLinks: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  topNav: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  topNavButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  topNavText: {
    fontSize: 12,
    fontWeight: '700',
  },
  linkButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.08)',
    shadowColor: '#0B1B3A',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 2,
  },
  linkButtonText: {
    fontWeight: '700',
  },
  fridayBanner: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFD100',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  fridayLabel: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: '#0B1B3A',
    letterSpacing: 0.5,
  },
  fridayTeams: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '800',
    color: '#0B1B3A',
  },
  predictionCard: {
    gap: 10,
    minHeight: 170,
    borderLeftWidth: 4,
    borderLeftColor: '#F77737',
  },
  predictionWrap: {
    backgroundColor: 'rgba(255,247,237,0.55)',
  },
  predictionLabel: {
    fontSize: 11,
    color: '#F77737',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  predictionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B1B3A',
  },
  predictionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  predictionChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  predictionChipHome: {
    backgroundColor: '#0066FF',
  },
  predictionChipAway: {
    backgroundColor: '#F77737',
  },
  predictionChipText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  predictionNote: {
    fontSize: 11,
    color: '#64748B',
  },
  sponsorCard: {
    gap: 12,
    minHeight: 170,
    borderLeftWidth: 4,
    borderLeftColor: '#0066FF',
  },
  sponsorWrap: {
    backgroundColor: 'rgba(239,246,255,0.55)',
  },
  bentoGrid: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bentoColumn: {
    flex: 1,
    marginRight: 12,
  },
  bentoColumnLast: {
    marginRight: 0,
  },
  sponsorLabel: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sponsorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sponsorPill: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5FF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,27,58,0.08)',
    minWidth: 140,
    alignItems: 'center',
    gap: 6,
  },
  sponsorLogoWrap: {
    width: 44,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sponsorLogo: {
    width: 44,
    height: 24,
    resizeMode: 'contain',
  },
  sponsorText: {
    color: '#0B1B3A',
    fontWeight: '700',
    fontSize: 12,
  },
});
