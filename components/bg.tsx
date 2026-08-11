import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors } from "@/lib/theme";

export function GradientBackground({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <LinearGradient
      colors={[colors.light, colors.muted, colors.dark]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
}
