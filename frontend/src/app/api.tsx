import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { API_URL } from '@/lib/api';

type HealthStatus =
  | { state: 'loading' }
  | { state: 'success'; message: string }
  | { state: 'error'; error: string };

async function checkHealth(): Promise<HealthStatus> {
  try {
    const response = await fetch(`${API_URL}/api/health/`);
    if (!response.ok) {
      return { state: 'error', error: `HTTP ${response.status}` };
    }
    const data: { status: string; message: string } = await response.json();
    return { state: 'success', message: data.message };
  } catch (error) {
    // fetch throws on network errors, e.g. backend not running or blocked by CORS
    return { state: 'error', error: error instanceof Error ? error.message : String(error) };
  }
}

export default function ApiScreen() {
  const [status, setStatus] = useState<HealthStatus>({ state: 'loading' });

  useEffect(() => {
    // Ignore the result if the screen unmounts before the request finishes
    let ignore = false;
    checkHealth().then((result) => {
      if (!ignore) setStatus(result);
    });
    return () => {
      ignore = true;
    };
  }, []);

  async function retry() {
    setStatus({ state: 'loading' });
    setStatus(await checkHealth());
  }

  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Backend connection</CardTitle>
          <CardDescription>{API_URL}/api/health/</CardDescription>
        </CardHeader>
        <CardContent className="gap-4">
          {status.state === 'loading' && <Text>Checking...</Text>}
          {status.state === 'success' && (
            <Text className="font-semibold text-green-600">Connected: {status.message}</Text>
          )}
          {status.state === 'error' && (
            <Text className="font-semibold text-destructive">Failed: {status.error}</Text>
          )}
          <Button variant="outline" onPress={retry} disabled={status.state === 'loading'}>
            <Text>Check again</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
