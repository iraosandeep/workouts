import { TextInput } from "react-native";

import { useTheme } from "@/lib/theme";

type InputProps = React.ComponentProps<typeof TextInput>;

export const Input = ({ ...props }: InputProps) => {
  const theme = useTheme();
  return (
    <TextInput
      {...props}
      placeholderTextColor={theme.muted}
      style={{
        backgroundColor: theme.accent,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: theme.onAccent,
        marginBottom: 12,
      }}
    />
  );
};
