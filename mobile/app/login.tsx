import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import { Text, View } from '@/components/Themed';
import { useAuth } from '@/lib/auth';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { login, signup, loginWithGoogle, firebaseUser, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expoClientId = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || expoClientId;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || expoClientId;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  const [request, response, promptAsync] = Google.useAuthRequest({
    responseType: 'id_token',
    scopes: ['profile', 'email'],
    clientId: expoClientId,
    iosClientId,
    androidClientId,
    webClientId,
  });

  const googleConfigured = Boolean(expoClientId || iosClientId || androidClientId || webClientId);

  useEffect(() => {
    if (!response) return;
    if (response.type === 'error') {
      const errorMessage =
        (response as any)?.params?.error_description ||
        (response as any)?.params?.error ||
        'Google sign-in failed';
      setError(errorMessage);
      return;
    }
    if (response.type !== 'success') return;
    const { id_token, access_token } = response.params as { id_token?: string; access_token?: string };
    (async () => {
      try {
        setSubmitting(true);
        setError(null);
        await loginWithGoogle(id_token, access_token);
        router.replace('/(tabs)/more');
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Google sign-in failed');
      } finally {
        setSubmitting(false);
      }
    })();
  }, [response, loginWithGoogle, router]);

  const disabled = useMemo(() => isLoading || submitting, [isLoading, submitting]);

  if (firebaseUser) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Signed In' }} />
        <Text style={styles.title}>You’re signed in</Text>
        <Text style={styles.muted}>{firebaseUser.email ?? firebaseUser.uid}</Text>
        <Pressable style={styles.secondaryButton} onPress={() => router.replace('/(tabs)/more')}>
          <Text style={styles.secondaryButtonText}>Go to More</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Sign In' }} />

      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.muted}>Use your existing website account.</Text>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        placeholder="you@example.com"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        placeholder="••••••••"
      />

      <Pressable
        style={({ pressed }) => [styles.primaryButton, pressed && { opacity: 0.9 }]}
        disabled={disabled}
        onPress={async () => {
          try {
            setSubmitting(true);
            setError(null);
            await login(email, password);
            router.replace('/(tabs)/more');
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Login failed');
          } finally {
            setSubmitting(false);
          }
        }}>
        <Text style={styles.primaryButtonText}>{submitting ? 'Signing in…' : 'Sign In'}</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.secondaryButton, pressed && { opacity: 0.9 }]}
        disabled={disabled}
        onPress={async () => {
          try {
            setSubmitting(true);
            setError(null);
            await signup(email, password);
            router.replace('/(tabs)/more');
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Sign up failed');
          } finally {
            setSubmitting(false);
          }
        }}>
        <Text style={styles.secondaryButtonText}>Create Account</Text>
      </Pressable>

      <Text style={styles.smallPrint}>
        Google sign-in uses your CPSC Google account.
      </Text>
      {!googleConfigured && (
        <Text style={styles.warningText}>
          Google sign-in needs OAuth client IDs in .env.
        </Text>
      )}

      <Pressable
        style={({ pressed }) => [styles.googleButton, pressed && { opacity: 0.9 }]}
        disabled={!request || disabled || !googleConfigured}
        onPress={() => promptAsync()}
      >
        <Text style={styles.googleButtonText}>Continue with Google</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.75,
    marginTop: 6,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.25)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  primaryButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#0066FF',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '800',
  },
  secondaryButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.25)',
  },
  secondaryButtonText: {
    fontWeight: '800',
  },
  muted: {
    fontSize: 12,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 12,
    color: '#b00020',
  },
  smallPrint: {
    marginTop: 8,
    fontSize: 11,
    opacity: 0.65,
  },
  warningText: {
    marginTop: 4,
    fontSize: 11,
    color: '#b00020',
  },
  googleButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  googleButtonText: {
    fontWeight: '800',
    color: '#0B1B3A',
  },
});
