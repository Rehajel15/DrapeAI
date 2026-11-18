import type { LucideIcon } from 'lucide-react-native';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type PrimaryButtonProps = Omit<ButtonProps, 'children' | 'variant' | 'size'> & {
  label: string;
  /** Shown after the label, e.g. an arrow. */
  icon?: LucideIcon;
};

/** The main action of a screen: a full-width pill button. */
export function PrimaryButton({ label, icon, className, ...props }: PrimaryButtonProps) {
  return (
    <Button className={cn('h-14 rounded-full sm:h-14', className)} {...props}>
      {/* font-normal: the button sets a font weight, but the weight comes from the font file */}
      <Text className="font-sans-semibold text-base font-normal">{label}</Text>
      {/* The size class also stops the Reusables button from shrinking the icon to 16px on web */}
      {icon ? <Icon as={icon} className="size-5" /> : null}
    </Button>
  );
}

type IconButtonProps = Omit<ButtonProps, 'children' | 'variant' | 'size'> & {
  icon: LucideIcon;
  /** Read out by screen readers, since the button shows no text. */
  label: string;
  variant?: 'outline' | 'ghost';
};

/** A round button that only shows an icon, e.g. "back" or "show password". */
export function IconButton({ icon, label, variant = 'outline', className, ...props }: IconButtonProps) {
  return (
    <Button
      variant={variant}
      size="icon"
      aria-label={label}
      hitSlop={8}
      className={cn(
        'h-11 w-11 rounded-full sm:h-11 sm:w-11',
        variant === 'outline' && 'bg-card dark:bg-card',
        className
      )}
      {...props}>
      <Icon as={icon} className="size-[22px] text-foreground" />
    </Button>
  );
}
