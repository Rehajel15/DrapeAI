import { API_URL } from '@/lib/api';

const REQUEST_TIMEOUT_MS = 10_000;

// These mirror the backend rules (accounts/models.py and Django's password validators),
// so obvious mistakes are caught before a request is sent. The backend stays the authority.
export const MIN_AGE = 1;
export const MAX_AGE = 120;
export const MIN_PASSWORD_LENGTH = 8;

export type SignupData = {
  name: string;
  age: number;
  email: string;
  password: string;
};

export type Account = {
  id: number;
  name: string;
  age: number;
  email: string;
};

type SignupField = keyof SignupData;
const SIGNUP_FIELDS: SignupField[] = ['name', 'age', 'email', 'password'];

export type SignupResult =
  | { ok: true; account: Account }
  // fieldErrors: one message per rejected field. formError: a problem not tied to a field.
  | { ok: false; fieldErrors: Partial<Record<SignupField, string>>; formError?: string };

const UNREACHABLE: SignupResult = {
  ok: false,
  fieldErrors: {},
  formError: 'We could not reach the server. Check your connection and try again.',
};

const UNEXPECTED: SignupResult = {
  ok: false,
  fieldErrors: {},
  formError: 'Something went wrong on our side. Please try again.',
};

export async function signUp(data: SignupData): Promise<SignupResult> {
  // fetch has no timeout of its own, so give up manually if the server does not answer
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/auth/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
  } catch {
    // fetch throws when there is no answer at all: server down, wrong network or timeout
    return UNREACHABLE;
  } finally {
    clearTimeout(timeout);
  }

  try {
    if (response.status === 201) {
      return { ok: true, account: await response.json() };
    }
    if (response.status === 400) {
      // Django REST Framework reports validation errors as { field: ["message", ...] }
      const errors: Record<string, string[] | undefined> = await response.json();
      const fieldErrors: Partial<Record<SignupField, string>> = {};
      for (const field of SIGNUP_FIELDS) {
        const messages = errors[field];
        if (messages?.length) {
          fieldErrors[field] = messages.join(' ');
        }
      }
      if (Object.keys(fieldErrors).length > 0) {
        return { ok: false, fieldErrors };
      }
    }
  } catch {
    // The answer was not the JSON we expect
  }
  return UNEXPECTED;
}
