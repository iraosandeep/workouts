import { router } from "expo-router";
import { Button } from "heroui-native";
import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";

import { WorkoutChecklist } from "@/components/workout-checklist";
import { formatWeekDayDate, getCurrentWeekDays, toDateKey } from "@/lib/week";
import { getWorkout, useWorkouts } from "@/lib/workouts";

export default function Today() {
  const weekDays = useMemo(() => getCurrentWeekDays(), []);
  const todayIndex = Math.max(
    weekDays.findIndex((weekDay) => weekDay.isToday),
    0,
  );
  const today = weekDays[todayIndex];
  const dateKey = toDateKey(today.date);

  const workouts = useWorkouts();
  const exercises = getWorkout(workouts, dateKey);

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
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
