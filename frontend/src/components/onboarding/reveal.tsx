import { Platform, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { cn } from '@/lib/utils';

const STAGGER_MS = 150;
// Web counterpart of the stagger: animation-delay classes from tailwindcss-animate
const WEB_DELAYS = ['', 'delay-150', 'delay-300'];

type RevealProps = {
  /** Position in the entrance sequence; later blocks start slightly after earlier ones. */
  order?: 0 | 1 | 2;
  className?: string;
  children: React.ReactNode;
};

/** Lets a block of content fade and slide in when its screen appears. */
export function Reveal({ order = 0, className, children }: RevealProps) {
  if (Platform.OS === 'web') {
    // On web a CSS animation does the job
    return (
      <View
        className={cn(
          'duration-700 animate-in fade-in slide-in-from-bottom-2 fill-mode-both',
          WEB_DELAYS[order],
          className
        )}>
        {children}
      </View>
    );
  }

  // On native, Reanimated runs the entrance animation
  return (
    <Animated.View entering={FadeInDown.duration(600).delay(order * STAGGER_MS)}>
      <View className={className}>{children}</View>
    </Animated.View>
  );
}
