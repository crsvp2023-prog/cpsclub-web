import { Pressable, StyleSheet } from 'react-native';
import * as Linking from 'expo-linking';
import { Link } from 'expo-router';

import { Text, View } from '@/components/Themed';
import { contactConfig } from '@/lib/contact';
import { useAuth } from '@/lib/auth';
import AppHeader from '@/components/AppHeader';

function Row({ title, subtitle, onPress }: { title: string; subtitle?: string; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Text style={styles.rowTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.rowMeta}>{subtitle}</Text>}
    </Pressable>
  );
}

export default function MoreScreen() {
  const { firebaseUser, logout, isLoading } = useAuth();

  return (
    <View style={styles.container}>
      <AppHeader title="More" />
      <View style={styles.sectionCard}>
        <Text style={styles.heading}>Account</Text>
        {isLoading ? (
          <Text style={styles.muted}>Checking session…</Text>
        ) : firebaseUser ? (
          <>
            <Text style={styles.muted}>{firebaseUser.email ?? firebaseUser.uid}</Text>
            <Row title="Sign out" onPress={() => logout()} />
          </>
        ) : (
          <>
            <Text style={styles.muted}>Not signed in.</Text>
            <Link href="/login" asChild>
              <Pressable style={styles.row}>
                <Text style={styles.rowTitle}>Sign in</Text>
                <Text style={styles.rowMeta}>Email + password</Text>
              </Pressable>
            </Link>
          </>
        )}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.heading}>Contact</Text>
        <Row
          title="Email"
          subtitle={contactConfig.emails.info}
          onPress={() => Linking.openURL(`mailto:${contactConfig.emails.info}`)}
        />
        <Row
          title="Instagram"
          subtitle="@chatswoodpremiersportsclub"
          onPress={() => Linking.openURL(contactConfig.social.instagram)}
        />
        <Row
          title="Facebook"
          subtitle="chatswood.premier.sports.club"
          onPress={() => Linking.openURL(contactConfig.social.facebook)}
        />
      </View>
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
  sectionCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0B1B3A',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: 10,
    shadowColor: '#0B1B3A',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 16,
    elevation: 4,
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  muted: {
    fontSize: 12,
    color: '#C7D7FF',
  },
  row: {
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: '#122554',
    gap: 4,
  },
  rowTitle: {
    fontWeight: '800',
    color: '#FFFFFF',
  },
  rowMeta: {
    fontSize: 12,
    color: '#C7D7FF',
  },
});
