import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type TextProps = React.ComponentProps<typeof Text>;

/** The heading of a screen. */
export function Title({ className, ...props }: TextProps) {
  return (
    <Text
      role="heading"
      aria-level={1}
      className={cn(
        'font-sans-extrabold text-[31px] leading-[38px] tracking-[-0.6px]',
        className
      )}
      {...props}
    />
  );
}

/** The supporting sentence below a heading. */
export function Subtitle({ className, ...props }: TextProps) {
  return (
    <Text
      className={cn('mt-2 font-sans text-base leading-6 text-muted-foreground', className)}
      {...props}
    />
  );
}
