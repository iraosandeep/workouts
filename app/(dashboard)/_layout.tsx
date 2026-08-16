import { Stack } from "expo-router/stack";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="today"
        options={{
          presentation: "pageSheet",
        }}
      />
      <Stack.Screen
        name="workout-session"
        options={{
          presentation: "fullScreenModal",
          gestureEnabled: false,
          animation: "fade",
        }}
      />
    </Stack>
  );
}
