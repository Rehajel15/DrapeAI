import { Redirect, useRouter } from 'expo-router';
import { ArrowRight, Check } from 'lucide-react-native';
import { View } from 'react-native';

import { PrimaryButton } from '@/components/onboarding/buttons';
import { useOnboarding } from '@/components/onboarding/onboarding-provider';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { Reveal } from '@/components/onboarding/reveal';
import { Subtitle, Title } from '@/components/onboarding/typography';
import { Icon } from '@/components/ui/icon';

// Step 4: confirms that the account exists and lets the user into the app.
export default function ReadyScreen() {
  const router = useRouter();
  const { account } = useOnboarding();

  // Only reachable after a successful sign-up
  if (!account) {
    return <Redirect href="/" />;
  }

  return (
    <OnboardingScreen
      align="center"
      // replace instead of push: the onboarding should not stay behind the app in the history
      footer={
        <PrimaryButton label="Let’s go" icon={ArrowRight} onPress={() => router.replace('/home')} />
      }>
      <Reveal className="items-center">
        <View className="h-[76px] w-[76px] items-center justify-center rounded-full bg-brand">
          <Icon as={Check} strokeWidth={2.5} className="size-[38px] text-brand-foreground" />
        </View>
      </Reveal>

      <Reveal order={1} className="mt-7 items-center">
        <Title className="text-center">You’re all set, {account.name}!</Title>
        <Subtitle className="text-center">Your wardrobe is ready for its first pieces.</Subtitle>
      </Reveal>
    </OnboardingScreen>
  );
}
