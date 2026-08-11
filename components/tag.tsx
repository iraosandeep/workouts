import { Text, View } from "react-native";

import { useTheme } from "@/lib/theme";

type TagProps = {
  children: string | number | React.ReactNode;
};

export const Tag = ({ children }: TagProps) => {
  const theme = useTheme();
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: theme.onAccent,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      {typeof children === "number" || typeof children === "string" ? (
        <Text style={{ fontSize: 12, fontWeight: "600", color: theme.accent }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};
