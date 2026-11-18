import { View } from 'react-native';

import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';

/** The DrapeAI logo: the name followed by a small "AI" badge in the brand color. */
export function Wordmark() {
  return (
    <View accessible role="img" aria-label="DrapeAI" className="flex-row items-center gap-1.5">
      <Text className="font-sans-extrabold text-[22px] leading-7 tracking-[-0.5px]">Drape</Text>
      <Badge className="border-transparent bg-brand px-2 py-0.5">
        {/* font-normal: the badge sets a font weight, but the weight comes from the font file */}
        <Text className="font-sans-bold text-[11px] font-normal leading-4 tracking-[0.5px] text-brand-foreground">
          AI
        </Text>
      </Badge>
    </View>
  );
}
