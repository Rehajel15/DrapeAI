import '@/global.css';

import { PlusJakartaSans_400Regular } from '@expo-google-fonts/plus-jakarta-sans/400Regular';
import { PlusJakartaSans_600SemiBold } from '@expo-google-fonts/plus-jakarta-sans/600SemiBold';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans/700Bold';
import { PlusJakartaSans_800ExtraBold } from '@expo-google-fonts/plus-jakarta-sans/800ExtraBold';
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { colorScheme as nativeWindColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { OnboardingProvider, useOnboarding } from '@/components/onboarding/onboarding-provider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NAV_THEME } from '@/lib/theme';

// The onboarding is the default screen of the root stack: Expo Router opens it when the app
// starts without an initial URL (possible on Android) and when the guard below redirects.
// Without an anchor it would use the first group in its own sort order, which is (tabs).
export const unstable_settings = {
  anchor: '(onboarding)',
};

// Keep the splash screen up until the fonts are ready, so no text flashes in a fallback font
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // The project hook, not React Native's: on web it reports "light" until the page has hydrated,
  // so the server-rendered HTML and the first browser render agree
  const colorScheme = useColorScheme();
  // The keys are the font family names used by the font-* classes in tailwind.config.js
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hide();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    // On native, NativeWind follows the system theme by itself. On web its dark mode only reacts
    // to a `dark` class on <html>, so mirror the system theme there.
    if (Platform.OS === 'web') {
      nativeWindColorScheme.set(colorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [colorScheme]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME[colorScheme === 'dark' ? 'dark' : 'light']}>
      <StatusBar style="auto" />
      {/* Holds the onboarding answers and the created account for the whole app session */}
      <OnboardingProvider>
        <RootStack />
      </OnboardingProvider>
      <PortalHost />
    </ThemeProvider>
  );
}

function RootStack() {
  const { account } = useOnboarding();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
      {/* The app behind the onboarding is only reachable after signing up. Until then Expo Router
          redirects every route into it to the anchor, however the app was opened. */}
      <Stack.Protected guard={account !== null}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
