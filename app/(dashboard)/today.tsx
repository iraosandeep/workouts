import { router, useLocalSearchParams } from "expo-router";
import { Button } from "heroui-native";
import { ScrollView, Text, View } from "react-native";

import { WorkoutChecklist } from "@/components/workout-checklist";
import { formatWeekDayDate, toDateKey } from "@/lib/week";
import { getWorkout, useWorkouts } from "@/lib/workouts";

/** Day-detail view — defaults to today (from the Home card) but also renders
 * any date passed via `?date=YYYY-MM-DD` (from the Calendar). */
export default function DayDetail() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const dateKey = date ?? toDateKey(new Date());
  const day = new Date(`${dateKey}T00:00:00`);
  const isToday = dateKey === toDateKey(new Date());

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
            {isToday
              ? "Today"
              : day.toLocaleDateString("en-US", { weekday: "long" })}
          </Text>
          <Text className="text-sm text-muted">{formatWeekDayDate(day)}</Text>
        </View>

        {exercises.length > 0 ? (
          <>
            <WorkoutChecklist dateKey={dateKey} exercises={exercises} />
            {isToday ? (
              <Button onPress={() => router.push("/workout-session")}>
                Start Workout
              </Button>
            ) : null}
          </>
        ) : (
          <Text className="text-foreground">No workout planned yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}
