import { View } from 'react-native';

import { cn } from '@/lib/utils';

// Fabric color, length and width of each garment, from left to right
const GARMENTS = [
  { color: 'bg-swatch-camel', length: 'h-[144px]', width: 'w-[46px]' },
  { color: 'bg-swatch-navy', length: 'h-[170px]', width: 'w-[40px]' },
  { color: 'bg-swatch-ecru', length: 'h-[122px]', width: 'w-[50px]' },
  { color: 'bg-swatch-rust', length: 'h-[156px]', width: 'w-[42px]' },
  { color: 'bg-swatch-olive', length: 'h-[134px]', width: 'w-[44px]' },
  { color: 'bg-swatch-blush', length: 'h-[112px]', width: 'w-[38px]' },
];

/** Decorative illustration: garments in fabric colors hanging on a clothing rail. */
export function ClothingRail({ className }: { className?: string }) {
  return (
    <View
      aria-hidden
      className={cn('h-60 items-center overflow-hidden rounded-[28px] bg-secondary', className)}>
      {/* Sized by the garments, so the rail always spans exactly the row of garments */}
      <View className="mt-[30px]">
        {/* The rail, slightly longer than the row */}
        <View className="absolute -left-3 -right-3 top-2.5 h-1 rounded-full bg-foreground" />

        <View className="flex-row gap-1">
          {GARMENTS.map((garment, index) => (
            <View key={index} className={cn('items-center', garment.width)}>
              {/* Hanger hook: a small arch over the rail */}
              <View className="-mb-0.5 h-4 w-3 rounded-t-full border-[3px] border-b-0 border-foreground" />
              <View
                className={cn(
                  'w-full rounded-b-[18px] rounded-t-[10px] shadow-sm shadow-black/10',
                  garment.color,
                  garment.length
                )}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
