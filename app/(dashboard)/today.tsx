import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Button, useThemeColor } from "heroui-native";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { WorkoutChecklist } from "@/components/workout-checklist";
import {
  formatWeekDayDate,
  getCurrentWeekDays,
  getDayColorClassName,
  toDateKey,
} from "@/lib/week";
import { getWorkout, useWorkouts } from "@/lib/workouts";

export default function Today() {
  const weekDays = useMemo(() => getCurrentWeekDays(), []);
  const todayIndex = Math.max(
    weekDays.findIndex((weekDay) => weekDay.isToday),
    0,
  );
  const today = weekDays[todayIndex];
  const dayColorClassName = getDayColorClassName(todayIndex);
  const dateKey = toDateKey(today.date);

  const workouts = useWorkouts();
  const exercises = getWorkout(workouts, dateKey);
  const foreground = useThemeColor("foreground");

  return (
    <View className={`flex-1 ${dayColorClassName}`}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          className="flex-row items-center gap-1 self-start"
        >
          <SymbolView
            name="chevron.left"
            tintColor={foreground}
            size={16}
            fallback={<Text style={{ color: foreground }}>‹</Text>}
          />
          <Text className="text-foreground">Back</Text>
        </Pressable>

        <View className="gap-1">
          <Text className="text-4xl font-extrabold uppercase tracking-wide text-foreground">
            {today.day}
          </Text>
          <Text className="text-sm text-muted">
            {formatWeekDayDate(today.date)}
          </Text>
        </View>

        {exercises.length > 0 ? (
          <>
            <WorkoutChecklist dateKey={dateKey} exercises={exercises} />
            <Button onPress={() => router.push("/workout-session")}>
              Start Workout
            </Button>
          </>
        ) : (
          <Text className="text-foreground">No workout planned yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}
