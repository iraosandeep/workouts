import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { useTheme } from "@/lib/theme";

export function GradientBackground({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const theme = useTheme();
  return (
    <LinearGradient
      colors={theme.background}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
}
