import { Pressable } from "react-native";

type ButtonProps = React.ComponentProps<typeof Pressable>;

export const Button = ({ ...props }: ButtonProps) => {
  return (
    <Pressable
      {...props}
      style={{
        backgroundColor: "#141414",
        paddingHorizontal: 8,
        paddingVertical: 8,
      }}
    />
  );
};
