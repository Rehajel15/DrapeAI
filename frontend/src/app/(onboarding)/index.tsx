import { useRouter } from 'expo-router';

import { PrimaryButton } from '@/components/onboarding/buttons';
import { ClothingRail } from '@/components/onboarding/clothing-rail';
import { Field } from '@/components/onboarding/field';
import { useOnboarding } from '@/components/onboarding/onboarding-provider';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { Reveal } from '@/components/onboarding/reveal';
import { Subtitle, Title } from '@/components/onboarding/typography';
import { Wordmark } from '@/components/onboarding/wordmark';

// Step 1: the first thing a new user sees. Greets them and asks for their name.
export default function WelcomeScreen() {
  const router = useRouter();
  const { name, setName } = useOnboarding();
  const trimmedName = name.trim();

  function handleContinue() {
    if (!trimmedName) return;
    setName(trimmedName);
    router.push('/age');
  }

  return (
    <OnboardingScreen
      footer={<PrimaryButton label="Continue" disabled={!trimmedName} onPress={handleContinue} />}>
      <Reveal>
        <Wordmark />
        <ClothingRail className="mt-5" />
      </Reveal>

      <Reveal order={1} className="mt-7">
        <Title>Welcome to DrapeAI</Title>
        <Subtitle>Outfit ideas from the clothes you already own. Let’s start with your name.</Subtitle>
      </Reveal>

      <Reveal order={2} className="mt-6">
        <Field
          label="Your name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Alex"
          autoCapitalize="words"
          autoComplete="given-name"
          autoCorrect={false}
          textContentType="givenName"
          maxLength={50}
          returnKeyType="next"
          onSubmitEditing={handleContinue}
        />
      </Reveal>
    </OnboardingScreen>
  );
}
