import Constants from 'expo-constants';

const BACKEND_PORT = 8000;

function resolveApiUrl(): string {
  // Explicit override from frontend/.env, e.g. for a deployed backend
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // During development, hostUri is "<dev machine IP>:<Metro port>", i.e. the address the
  // phone used to reach the Expo dev server. Django runs on the same machine, so reuse that host.
  // On web there is no hostUri, so fall back to localhost.
  const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? '127.0.0.1';
  return `http://${host}:${BACKEND_PORT}`;
}

export const API_URL = resolveApiUrl();
