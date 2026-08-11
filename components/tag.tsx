import { Text, View } from "react-native";

type TagProps = {
  children: string | number | React.ReactNode;
};

export const Tag = ({ children }: TagProps) => {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: "#faf7f7",
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}
    >
      {typeof children === "number" || typeof children === "string" ? (
        <Text style={{ fontSize: 12, fontWeight: "600", color: "#141414" }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};
