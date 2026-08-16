import type { SFSymbol } from "expo-symbols";
import { SymbolView } from "expo-symbols";
import { useThemeColor } from "heroui-native";
import { Text, View } from "react-native";

type EmptyStateProps = {
  icon: SFSymbol;
  title: string;
  description?: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  const mutedColor = useThemeColor("muted");

  return (
    <View className="flex-1 items-center justify-center gap-3 px-10 pb-16 pt-10">
      <SymbolView
        name={icon}
        tintColor={mutedColor}
        size={40}
        fallback={<Text style={{ fontSize: 32, color: mutedColor }}>·</Text>}
      />
      <Text className="text-center text-lg font-semibold text-foreground">
        {title}
      </Text>
      {description ? (
        <Text className="text-center text-muted">{description}</Text>
      ) : null}
    </View>
  );
}
