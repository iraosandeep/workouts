import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export function GradientBackground({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <LinearGradient
      colors={["#1B7CF3", "#1660E0", "#0A3FAE"]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={[{ flex: 1 }, style]}
    >
      {children}
    </LinearGradient>
  );
}
