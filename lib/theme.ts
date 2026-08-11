import { useColorScheme } from "react-native";

// The only 4 colors used anywhere in this app. Light/dark themes are built
// by reassigning these same values to different roles — never introduce a
// new color here, only remap these.
const palette = {
  light: "#faf7f7",
  dark: "#141414",
  muted: "#807e7e",
  surface: "#e9e9eb",
} as const;

type Theme = {
  /** 3-stop gradient used by GradientBackground. */
  background: readonly [string, string, string];
  /** Text placed directly on top of `background` (not on a surface/accent). */
  text: string;
  /** Solid raised elements: buttons, active chip, card container. */
  accent: string;
  /** Text/icons on top of `accent`. */
  onAccent: string;
  /** Neutral secondary elements: inactive chip, video placeholder. */
  surface: string;
  /** Text/icons on top of `surface`. */
  onSurface: string;
  /** Gradient midpoint / secondary tone, same in both themes. */
  muted: string;
};

const light: Theme = {
  background: [palette.light, palette.muted, palette.dark],
  text: palette.dark,
  accent: palette.dark,
  onAccent: palette.light,
  surface: palette.surface,
  onSurface: palette.dark,
  muted: palette.muted,
};

const dark: Theme = {
  background: [palette.light, palette.muted, palette.dark],
  text: palette.dark,
  accent: palette.dark,
  onAccent: palette.light,
  surface: palette.surface,
  onSurface: palette.dark,
  muted: palette.muted,
};

// const dark: Theme = {
//   background: [palette.dark, palette.muted, palette.light],
//   text: palette.light,
//   accent: palette.light,
//   onAccent: palette.dark,
//   surface: palette.muted,
//   onSurface: palette.light,
//   muted: palette.muted,
// };

export const themes = { light, dark } as const;

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return themes[scheme === "dark" ? "dark" : "light"];
}
