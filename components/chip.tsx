import { Pressable, Text } from "react-native";

type ChipProps = {
  isActive: boolean;
} & React.ComponentProps<typeof Pressable>;

export const Chip = ({ isActive, ...props }: ChipProps) => {
  return (
    <Pressable
      {...props}
      style={{
        backgroundColor: isActive ? "#141414" : "#e9e9eb",
        paddingHorizontal: 14,
        paddingVertical: 8,
      }}
    >
      {typeof props.children === "number" ||
      typeof props.children === "string" ? (
        <Text
          style={{ fontWeight: "600", color: isActive ? "white" : "#1c1c1e" }}
        >
          {props.children}
        </Text>
      ) : (
        props.children
      )}
    </Pressable>
  );
};
