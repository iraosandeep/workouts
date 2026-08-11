import { TextInput } from "react-native";

type InputProps = React.ComponentProps<typeof TextInput>;

export const Input = ({ ...props }: InputProps) => {
  return (
    <TextInput
      {...props}
      placeholderTextColor="#faf7f7"
      style={{
        backgroundColor: "#141414",
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: "white",
        marginBottom: 12,
      }}
    />
  );
};
