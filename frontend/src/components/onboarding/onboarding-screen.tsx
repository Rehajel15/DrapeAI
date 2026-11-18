import { ChevronLeft } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Progress } from '@/components/ui/progress';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

import { IconButton } from './buttons';

// Name, age and account; the final screen is not counted
const TOTAL_STEPS = 3;

type OnboardingScreenProps = {
  /** Position in the sign-up steps (1-based). Shows the back button and the progress bar. */
  step?: number;
  /** Called by the back button. Without it the button is hidden. */
  onBack?: () => void;
  /** "center" places the content in the middle of the screen, e.g. for the final screen. */
  align?: 'top' | 'center';
  /** Pinned to the bottom edge, above the keyboard. Usually the primary button. */
  footer: React.ReactNode;
  children: React.ReactNode;
};

/** The shared page frame of the onboarding flow. */
export function OnboardingScreen({
  step,
  onBack,
  align = 'top',
  footer,
  children,
}: OnboardingScreenProps) {
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);

  // The fields sit at the end of the content. While the keyboard is open, keep that end in view.
  function revealFields() {
    if (Keyboard.isVisible()) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }

  useEffect(() => {
    const subscription = Keyboard.addListener('keyboardDidShow', () => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Android no longer resizes the window for the keyboard, so pad the content instead */}
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        {/* A phone-wide column, centered on larger screens */}
        <View className="w-full max-w-md flex-1 self-center px-6">
          {step ? (
            <View className="flex-row items-center gap-4 pt-2">
              {/* The placeholder keeps the bar in place while the button is hidden */}
              {onBack ? (
                <IconButton icon={ChevronLeft} label="Go back" onPress={onBack} />
              ) : (
                <View className="h-11 w-11" />
              )}
              <Progress
                value={(step / TOTAL_STEPS) * 100}
                className="h-1.5 flex-1 bg-border"
                indicatorClassName="bg-brand"
              />
              <Text className="w-11 text-right font-sans-semibold text-[13px] text-muted-foreground">
                {step} of {TOTAL_STEPS}
              </Text>
            </View>
          ) : null}

          <ScrollView
            ref={scrollRef}
            className="flex-1"
            contentContainerClassName={cn(
              'grow pb-6',
              step ? 'pt-8' : 'pt-3',
              align === 'center' && 'justify-center'
            )}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            // The keyboard event can arrive before the layout has shrunk, and an error message can
            // push the fields down afterwards. So also react when either size changes.
            onLayout={revealFields}
            onContentSizeChange={revealFields}>
            {children}
          </ScrollView>

          <View className="pb-4 pt-3">{footer}</View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
