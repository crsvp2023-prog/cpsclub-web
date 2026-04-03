import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

import { Text, View } from '@/components/Themed';
import { fetchJson } from '@/lib/api';
import type { SportsNewsItem, SportsNewsResponse } from '@/lib/types';
import { firestore } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import AppHeader from '@/components/AppHeader';

function NewsRow({ item }: { item: SportsNewsItem }) {
  const isValidUrl = (value?: string) => {
    if (!value) return false;
    if (value.trim() === '#' || value.trim().length === 0) return false;
    return /^https?:\/\//i.test(value.trim());
  };

  return (
    <Pressable
      style={styles.row}
      onPress={() => {
        if (!isValidUrl(item.url)) return;
        WebBrowser.openBrowserAsync(item.url as string).catch(() => {
          Linking.openURL(item.url as string);
        });
      }}>
      <Text style={styles.rowTitle}>{item.title ?? 'Untitled'}</Text>
      {!!item.source && <Text style={styles.rowMeta}>{item.source}</Text>}
      {!!item.publishedAt && <Text style={styles.rowMeta}>{item.publishedAt}</Text>}
    </Pressable>
  );
}

export default function NewsScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SportsNewsResponse | null>(null);
  const [cpscNews, setCpscNews] = useState<SportsNewsItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchJson<SportsNewsResponse>('/sports-news-data.json');
        if (!cancelled) setData(response);

        const snapshot = await getDocs(collection(firestore, 'cpsc-news'));
        const cpscItems: SportsNewsItem[] = [];
        snapshot.forEach((doc) => {
          const row = doc.data() as Record<string, any>;
          cpscItems.push({
            id: row.id || doc.id,
            title: row.title || 'CPSC News',
            url: row.url || undefined,
            source: row.source || 'CPSC Club News',
            publishedAt: row.date || row.publishedAt || '',
          });
        });
        if (!cancelled) setCpscNews(cpscItems);
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Failed to load news';
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
        <Text style={styles.muted}>Loading news…</Text>
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

  const items = [...(cpscNews ?? []), ...(data?.news ?? [])];

  return (
    <View style={styles.container}>
      <View style={styles.headerWrap}>
        <AppHeader title="News" />
      </View>
      {!!data?.message && items.length === 0 && (
        <View style={styles.banner}>
          <Text style={styles.bannerLabel}>Notice</Text>
          <Text style={styles.bannerText}>{data.message}</Text>
        </View>
      )}
      <FlatList
        data={items}
        keyExtractor={(item, idx) => String(item.id ?? item.url ?? idx)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <NewsRow item={item} />}
        ListEmptyComponent={<Text style={styles.muted}>No news available.</Text>}
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
  banner: {
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fff7ec',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(247,119,55,0.35)',
  },
  bannerLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F77737',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    opacity: 0.85,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  row: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0B1B3A',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 4,
    shadowColor: '#0B1B3A',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 4,
  },
  rowTitle: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rowMeta: {
    fontSize: 12,
    color: '#C7D7FF',
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
