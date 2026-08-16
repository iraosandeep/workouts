import { SymbolView } from "expo-symbols";
import {
  Accordion,
  AccordionLayoutTransition,
  Button,
  Chip,
  useThemeColor,
} from "heroui-native";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import Animated from "react-native-reanimated";

import { WorkoutChecklist } from "@/components/workout-checklist";
import { WorkoutPickerSheet } from "@/components/workout-picker-sheet";
import { formatWeekDayDate, getCurrentWeekDays, toDateKey } from "@/lib/week";
import { getWorkout, useWorkouts } from "@/lib/workouts";

export default function Week() {
  const weekDays = useMemo(() => getCurrentWeekDays(), []);
  const todayDay =
    weekDays.find((weekDay) => weekDay.isToday)?.day ?? weekDays[0].day;

  const [expandedDay, setExpandedDay] = useState<string | undefined>(todayDay);
  const [pickerDateKey, setPickerDateKey] = useState<string | undefined>();

  const workouts = useWorkouts();
  const accentForeground = useThemeColor("accent-foreground");

  return (
    <View className="flex-1 bg-background">
      <Animated.ScrollView
        layout={AccordionLayoutTransition}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Accordion
          selectionMode="single"
          value={expandedDay}
          onValueChange={setExpandedDay}
          classNames={{
            container: "bg-surface",
            separator: "bg-separator",
          }}
        >
          {weekDays.map((weekDay) => {
            const dateKey = toDateKey(weekDay.date);
            const exercises = getWorkout(workouts, dateKey);
            const hasWorkout = exercises.length > 0;

            return (
              <Accordion.Item key={weekDay.day} value={weekDay.day}>
                <Accordion.Trigger className="px-5 py-6">
                  <View className="flex-1 gap-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-5xl font-extrabold uppercase tracking-wide text-surface-foreground">
                        {weekDay.day}
                      </Text>
                      {weekDay.isToday ? (
                        <Chip size="sm" variant="soft" color="accent">
                          Today
                        </Chip>
                      ) : null}
                    </View>
                    {weekDay.isToday && (
                      <Text className="text-sm text-muted">
                        {formatWeekDayDate(weekDay.date)}
                      </Text>
                    )}
                  </View>
                </Accordion.Trigger>
                <Accordion.Content className="gap-3 pb-5">
                  {hasWorkout ? (
                    <WorkoutChecklist dateKey={dateKey} exercises={exercises} />
                  ) : null}
                  <Button size="sm" onPress={() => setPickerDateKey(dateKey)}>
                    <SymbolView
                      name={hasWorkout ? "pencil" : "plus"}
                      tintColor={accentForeground}
                      size={14}
                      fallback={
                        <Text style={{ color: accentForeground }}>
                          {hasWorkout ? "✎" : "+"}
                        </Text>
                      }
                    />
                    <Button.Label>
                      {hasWorkout ? "Update Workout" : "Create Workout"}
                    </Button.Label>
                  </Button>
                </Accordion.Content>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Animated.ScrollView>
      <WorkoutPickerSheet
        dateKey={pickerDateKey}
        onClose={() => setPickerDateKey(undefined)}
      />
    </View>
  );
}
