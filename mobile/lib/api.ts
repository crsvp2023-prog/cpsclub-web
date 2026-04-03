import { Platform } from 'react-native';

function defaultBaseUrl() {
  // When running a local Next.js dev server:
  // - iOS simulator can use localhost
  // - Android emulator uses 10.0.2.2
  // - Physical devices need your LAN IP (set EXPO_PUBLIC_WEB_BASE_URL)
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  return 'http://localhost:3000';
}

export function getWebBaseUrl() {
  const env = process.env.EXPO_PUBLIC_WEB_BASE_URL;
  return (env && env.trim().length > 0 ? env.trim().replace(/\/$/, '') : defaultBaseUrl());
}

export async function fetchJson<T>(path: string): Promise<T> {
  const url = `${getWebBaseUrl()}${path.startsWith('/') ? '' : '/'}${path}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} when fetching ${path}`);
  }
  return (await res.json()) as T;
}

type MatchesApiResponse =
  | { success: true; data: { matches?: any[] } }
  | { success: false; error?: string };

export async function fetchMatchesFromApi() {
  const api = await fetchJson<MatchesApiResponse>('/api/update-matches');
  if (api && api.success && api.data && Array.isArray(api.data.matches)) {
    return api.data.matches;
  }
  return [];
}
