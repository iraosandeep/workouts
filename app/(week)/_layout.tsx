import { Stack } from "expo-router/stack";

export default function WeekLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="picker"
        options={{
          headerShown: true,
          presentation: "formSheet",
          sheetAllowedDetents: [0.9, 1],
          sheetGrabberVisible: true,
        }}
      />
    </Stack>
  );
}
