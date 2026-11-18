import { useState } from 'react';
import { Platform, View } from 'react-native';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type FieldProps = Omit<React.ComponentProps<typeof Input>, 'className'> & {
  label: string;
  hint?: string;
  error?: string;
  /** Rendered inside the field on the right, e.g. a show/hide password button. */
  trailing?: React.ReactNode;
};

/** A labelled text field with an optional hint or error message below it. */
export function Field({ label, hint, error, trailing, onFocus, onBlur, ...props }: FieldProps) {
  const [focused, setFocused] = useState(false);
  // The id links label and input. It is derived from the label instead of React's useId():
  // with server rendering on web, Expo Router 58 produces different useId values on the server
  // and in the browser (expo/expo#52249), which shows up as a hydration error. Labels must
  // therefore be unique within a screen.
  const id = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const labelId = `${id}-label`;

  return (
    <View className="gap-2">
      <Label
        nativeID={labelId}
        htmlFor={id}
        // font-normal: the label sets a font weight, but the weight comes from the font file
        className="font-sans-semibold text-sm font-normal">
        {label}
      </Label>

      <View className="justify-center">
        <Input
          id={id}
          aria-labelledby={labelId}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          // The md: variant overrides the smaller desktop font size of the Reusables input
          className={cn(
            'h-14 rounded-2xl border-border bg-card px-4 font-sans text-[17px] shadow-none sm:h-14 md:text-[17px] dark:bg-card',
            Platform.select({ web: 'focus-visible:ring-brand/20' }),
            focused && 'border-brand',
            error && 'border-destructive',
            trailing ? 'pr-14' : undefined
          )}
          {...props}
        />
        {trailing ? <View className="absolute right-1.5">{trailing}</View> : null}
      </View>

      {error ? (
        <Text className="font-sans text-[13px] leading-[18px] text-destructive">{error}</Text>
      ) : hint ? (
        <Text className="font-sans text-[13px] leading-[18px] text-muted-foreground">{hint}</Text>
      ) : null}
    </View>
  );
}
