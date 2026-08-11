import { TextInput } from "react-native";

import { colors } from "@/lib/theme";

type InputProps = React.ComponentProps<typeof TextInput>;

export const Input = ({ ...props }: InputProps) => {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.muted}
      style={{
        backgroundColor: colors.dark,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.light,
        marginBottom: 12,
      }}
    />
  );
};
