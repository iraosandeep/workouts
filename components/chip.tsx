import { Pressable, Text } from "react-native";

import { useTheme } from "@/lib/theme";

type ChipProps = {
  isActive: boolean;
} & React.ComponentProps<typeof Pressable>;

export const Chip = ({ isActive, ...props }: ChipProps) => {
  const theme = useTheme();
  return (
    <Pressable
      {...props}
      style={{
        backgroundColor: isActive ? theme.accent : theme.surface,
        paddingHorizontal: 14,
        paddingVertical: 8,
      }}
    >
      {typeof props.children === "number" ||
      typeof props.children === "string" ? (
        <Text
          style={{
            fontWeight: "600",
            color: isActive ? theme.onAccent : theme.onSurface,
          }}
        >
          {props.children}
        </Text>
      ) : (
        props.children
      )}
    </Pressable>
  );
};
