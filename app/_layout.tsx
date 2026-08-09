import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7; // 7 days

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_WEEK,
      gcTime: ONE_WEEK,
      retry: 2,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <NativeTabs tintColor="#141414">
        <NativeTabs.Trigger name="index">
          <Icon sf="list.bullet" />
          <Label>Exercises</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="favorites" role="favorites">
          <Icon sf={{ default: "heart", selected: "heart.fill" }} />
          <Label>Favorites</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </QueryClientProvider>
  );
}
