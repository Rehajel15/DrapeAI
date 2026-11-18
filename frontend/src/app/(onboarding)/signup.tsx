import { Redirect, useRouter } from 'expo-router';
import { Eye, EyeOff } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Keyboard, type TextInput } from 'react-native';

import { IconButton, PrimaryButton } from '@/components/onboarding/buttons';
import { Field } from '@/components/onboarding/field';
import { useOnboarding } from '@/components/onboarding/onboarding-provider';
import { OnboardingScreen } from '@/components/onboarding/onboarding-screen';
import { Reveal } from '@/components/onboarding/reveal';
import { Subtitle, Title } from '@/components/onboarding/typography';
import { Text } from '@/components/ui/text';
import { MIN_PASSWORD_LENGTH, signUp } from '@/lib/auth';

// Deliberately loose: it only catches obvious typos, the backend does the real validation
const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

type FormErrors = { email?: string; password?: string; form?: string };

// Step 3: asks for email and password, then creates the account on the backend.
export default function SignupScreen() {
  const router = useRouter();
  const { name, age, setAccount } = useOnboarding();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  // Opened without the previous steps (e.g. a page reload on web): start over
  if (!name || !age) {
    return <Redirect href="/" />;
  }

  async function handleSubmit() {
    if (submitting) return;

    const trimmedEmail = email.trim();
    const localErrors: FormErrors = {};
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      localErrors.email = 'Please enter a valid email address.';
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      localErrors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    setErrors(localErrors);
    if (localErrors.email || localErrors.password) return;

    Keyboard.dismiss();
    setSubmitting(true);
    const result = await signUp({ name, age: Number(age), email: trimmedEmail, password });

    if (result.ok) {
      setAccount(result.account);
      // Close the earlier steps so nothing leads back into the form, then show the last page
      router.dismissAll();
      router.replace('/ready');
      return;
    }

    setSubmitting(false);
    setErrors({
      email: result.fieldErrors.email,
      password: result.fieldErrors.password,
      // Name and age were entered on earlier pages, so their errors go into the general message
      form: result.formError ?? result.fieldErrors.name ?? result.fieldErrors.age,
    });
  }

  return (
    <OnboardingScreen
      step={3}
      onBack={submitting ? undefined : () => router.back()}
      footer={
        <PrimaryButton
          label={submitting ? 'Creating account…' : 'Create account'}
          disabled={submitting || !email || !password}
          onPress={handleSubmit}
        />
      }>
      <Reveal>
        <Title>Create your account</Title>
        <Subtitle>Just an email and a password, and you’re in.</Subtitle>
      </Reveal>

      <Reveal order={1} className="mt-8 gap-5">
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          editable={!submitting}
          placeholder="you@example.com"
          keyboardType="email-address"
          inputMode="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          textContentType="emailAddress"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          submitBehavior="submit"
          autoFocus
        />
        <Field
          ref={passwordRef}
          label="Password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
          editable={!submitting}
          placeholder="Create a password"
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          autoComplete="new-password"
          autoCorrect={false}
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          trailing={
            <IconButton
              variant="ghost"
              icon={passwordVisible ? EyeOff : Eye}
              label={passwordVisible ? 'Hide password' : 'Show password'}
              onPress={() => setPasswordVisible((visible) => !visible)}
            />
          }
        />
        {errors.form ? (
          <Text className="font-sans text-[13px] leading-[18px] text-destructive">{errors.form}</Text>
        ) : null}
      </Reveal>
    </OnboardingScreen>
  );
}
