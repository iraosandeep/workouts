import { Text, View } from "react-native";

import { colors } from "@/lib/theme";

type TagProps = {
  children: string | number | React.ReactNode;
};

export const Tag = ({ children }: TagProps) => {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: colors.light,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      {typeof children === "number" || typeof children === "string" ? (
        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.dark }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};
