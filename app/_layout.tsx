import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

export default function RootLayout() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading || profileLoading) return;

    const inAuth = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';

    if (!isAuthenticated) {
      if (!inAuth) router.replace('/auth/login');
    } else if (!profile) {
      if (!inOnboarding) router.replace('/onboarding');
    } else {
      if (inAuth || inOnboarding) router.replace('/');
    }
  }, [isAuthenticated, authLoading, profile, profileLoading, segments, router]);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="impostazioni" options={{ presentation: 'card' }} />
        <Stack.Screen name="quiz" options={{ gestureEnabled: false }} />
        <Stack.Screen name="risultato" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}
