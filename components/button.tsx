import { Pressable } from "react-native";

import { colors } from "@/lib/theme";

type ButtonProps = React.ComponentProps<typeof Pressable>;

export const Button = ({ ...props }: ButtonProps) => {
  return (
    <Pressable
      {...props}
      style={{
        backgroundColor: colors.dark,
        paddingHorizontal: 8,
        paddingVertical: 8,
      }}
    />
  );
};
