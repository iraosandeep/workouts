import { Pressable, Text } from "react-native";

import { colors } from "@/lib/theme";

type ChipProps = {
  isActive: boolean;
} & React.ComponentProps<typeof Pressable>;

export const Chip = ({ isActive, ...props }: ChipProps) => {
  return (
    <Pressable
      {...props}
      style={{
        backgroundColor: isActive ? colors.dark : colors.surface,
        paddingHorizontal: 14,
        paddingVertical: 8,
      }}
    >
      {typeof props.children === "number" ||
      typeof props.children === "string" ? (
        <Text
          style={{
            fontWeight: "600",
            color: isActive ? colors.light : colors.dark,
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
