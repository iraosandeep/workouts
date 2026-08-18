import * as Clipboard from "expo-clipboard";
import { Button, Input, TextField, useToast } from "heroui-native";
import { useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import { getCurrentWeekDays, toDateKey } from "@/lib/week";
import {
  exportWorkoutsJson,
  importWorkoutsJson,
  useWorkouts,
} from "@/lib/workouts";
import { clearChatMessages } from "@/lib/chat";

export default function Profile() {
  const { toast } = useToast();
  const workouts = useWorkouts();
  const [importJson, setImportJson] = useState("");

  const exportJson = useMemo(
    () =>
      exportWorkoutsJson(
        getCurrentWeekDays().map((weekDay) => toDateKey(weekDay.date)),
      ),
    // Recompute whenever the workouts store changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workouts],
  );

  const handleCopyExport = async () => {
    await Clipboard.setStringAsync(exportJson);
    toast.show({ variant: "success", label: "Copied this week as JSON" });
  };

  const handleImport = () => {
    try {
      const { importedDays, skippedIds } = importWorkoutsJson(importJson);
      toast.show({
        variant: skippedIds.length > 0 ? "default" : "success",
        label: `Imported ${importedDays} day${importedDays === 1 ? "" : "s"}`,
        description:
          skippedIds.length > 0
            ? `Skipped unknown exercise ids: ${skippedIds.join(", ")}`
            : undefined,
      });
      setImportJson("");
    } catch {
      toast.show({
        variant: "danger",
        label: "Import failed",
        description: 'Expected a JSON object of "dateKey": [exerciseId, ...].',
      });
    }
  };

  const clearChat = () => {
    Alert.alert("Clear chat", "", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "default",
        onPress: () => {
          clearChatMessages();
          toast.show({
            variant: "success",
            label: "All chat messages deleted!",
          });
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 20 }}
      >
        <View className="gap-2">
          <Text className="font-semibold text-foreground">
            Export This Week
          </Text>
          <ScrollView
            className="max-h-40 border border-surface bg-surface p-3"
            nestedScrollEnabled
          >
            <Text
              selectable
              className="font-mono text-xs text-surface-foreground"
            >
              {exportJson}
            </Text>
          </ScrollView>
          <Button variant="secondary" onPress={handleCopyExport}>
            Copy as JSON
          </Button>
        </View>

        <View className="gap-2">
          <Text className="font-semibold text-foreground">
            Import Week Plan
          </Text>
          <TextField>
            <Input
              value={importJson}
              onChangeText={setImportJson}
              placeholder='{"2026-08-17": ["dumbbell-curl", ...]}'
              multiline
              numberOfLines={4}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </TextField>
          <Button onPress={handleImport} isDisabled={!importJson.trim()}>
            Import
          </Button>
        </View>
      </ScrollView>
      <Button onPress={clearChat} variant="danger">
        Clear chat
      </Button>
      <View className="flex-1" />
    </View>
  );
}
