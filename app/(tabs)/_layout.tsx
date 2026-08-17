import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { useThemeColor } from "heroui-native";

export const unstable_settings = {
  anchor: "(dashboard)",
};

export default function AppTabs() {
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
      <NativeTabs.Trigger name="(chat)">
        <Icon sf="bubble.left.and.bubble.right.fill" />
        <Label>Chat</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
