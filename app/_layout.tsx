import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { HeroUINativeProvider, useThemeColor } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "../global.css";

const ONE_WEEK = 1000 * 60 * 60 * 24 * 7; // 7 days

export const unstable_settings = {
  anchor: "(dashboard)",
};

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
    <GestureHandlerRootView>
      <HeroUINativeProvider>
        <QueryClientProvider client={queryClient}>
          <AppTabs />
        </QueryClientProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}

function AppTabs() {
  const accent = useThemeColor("accent");
  return (
    <NativeTabs tintColor={accent} labelVisibilityMode="unlabeled">
      <NativeTabs.Trigger name="(dashboard)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(week)">
        <Icon sf="calendar" />
        <Label>Week</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(exercises)">
        <Icon sf="list.bullet" />
        <Label>Exercises</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(chat)">
        <Icon sf="bubble.left.and.bubble.right.fill" />
        <Label>Chat</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
