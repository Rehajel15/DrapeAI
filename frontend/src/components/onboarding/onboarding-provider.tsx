import { createContext, useContext, useState } from 'react';

import type { Account } from '@/lib/auth';

type OnboardingContextValue = {
  name: string;
  setName: (name: string) => void;
  // Kept as the raw text of the input; converted to a number when the account is created
  age: string;
  setAge: (age: string) => void;
  // Set once the backend has created the account
  account: Account | null;
  setAccount: (account: Account) => void;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

/**
 * Holds the answers of the onboarding steps, so that each screen can read what the
 * previous ones collected and everything can be sent to the backend in one request.
 */
export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [account, setAccount] = useState<Account | null>(null);

  return (
    <OnboardingContext.Provider value={{ name, setName, age, setAge, account, setAccount }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used inside an OnboardingProvider');
  }
  return context;
}
