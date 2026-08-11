import { Pressable } from "react-native";

import { useTheme } from "@/lib/theme";

type ButtonProps = React.ComponentProps<typeof Pressable>;

export const Button = ({ ...props }: ButtonProps) => {
  const theme = useTheme();
  return (
    <Pressable
      {...props}
      style={{
        backgroundColor: theme.accent,
        paddingHorizontal: 8,
        paddingVertical: 8,
      }}
    />
  );
};
