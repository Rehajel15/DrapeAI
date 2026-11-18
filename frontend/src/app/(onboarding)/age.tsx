import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';

import { PrimaryButton } from '@/components/onboarding/buttons';
import { Field } from '@/components/onboarding/field';
import { useOnboarding } from '@/components/onboarding/onboarding-provider';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { Reveal } from '@/components/onboarding/reveal';
import { Subtitle, Title } from '@/components/onboarding/typography';
import { MAX_AGE, MIN_AGE } from '@/lib/auth';

// Step 2: asks for the user's age.
export default function AgeScreen() {
  const router = useRouter();
  const { name, age, setAge } = useOnboarding();
  const [error, setError] = useState<string>();

  // Opened without the previous step (e.g. a page reload on web): start over
  if (!name) {
    return <Redirect href="/" />;
  }

  function handleChange(text: string) {
    // Digits only, whatever the keyboard or a paste delivers
    setAge(text.replace(/\D/g, ''));
    setError(undefined);
  }

  function handleContinue() {
    const value = Number(age);
    if (!age || value < MIN_AGE || value > MAX_AGE) {
      setError(`Please enter an age between ${MIN_AGE} and ${MAX_AGE}.`);
      return;
    }
    router.push('/signup');
  }

  return (
    <OnboardingScreen
      step={2}
      onBack={() => router.back()}
      footer={<PrimaryButton label="Continue" disabled={!age} onPress={handleContinue} />}>
      <Reveal>
        <Title>Nice to meet you, {name}!</Title>
        <Subtitle>How old are you?</Subtitle>
      </Reveal>

      <Reveal order={1} className="mt-8">
        <Field
          label="Your age"
          value={age}
          onChangeText={handleChange}
          error={error}
          placeholder="e.g. 28"
          keyboardType="number-pad"
          inputMode="numeric"
          maxLength={3}
          returnKeyType="done"
          onSubmitEditing={handleContinue}
          autoFocus
        />
      </Reveal>
    </OnboardingScreen>
  );
}
