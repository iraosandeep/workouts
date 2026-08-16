import { useMemo } from "react";
import { Text, View } from "react-native";

import { getDayCompletion, useSessions } from "@/lib/sessions";
import { getCurrentMonthDays, toDateKey } from "@/lib/week";
import { getWorkout, useWorkouts } from "@/lib/workouts";

const MONTH_NAME = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
  new Date(),
);

export function MonthProgress() {
  const monthDays = useMemo(() => getCurrentMonthDays(), []);
  const workouts = useWorkouts();
  const sessions = useSessions();

  const days = useMemo(
    () =>
      monthDays.map((monthDay) => {
        const dateKey = toDateKey(monthDay.date);
        const exercises = getWorkout(workouts, dateKey);
        const completion = getDayCompletion(sessions, dateKey, exercises);
        const isFuture =
          monthDay.date.getTime() > Date.now() && !monthDay.isToday;
        return {
          dateKey,
          isPlanned: exercises.length > 0,
          isFuture,
          ...completion,
        };
      }),
    [monthDays, workouts, sessions],
  );

  const plannedDays = days.filter((day) => day.isPlanned && !day.isFuture);
  const completedDays = plannedDays.filter((day) => day.isComplete);
  const percent =
    plannedDays.length > 0
      ? Math.round((completedDays.length / plannedDays.length) * 100)
      : 0;

  return (
    <View className="gap-3 bg-surface p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-foreground">{MONTH_NAME}</Text>
        <Text className="text-lg font-bold text-foreground">{percent}%</Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {days.map((day) => (
          <View
            key={day.dateKey}
            className={
              day.isComplete
                ? "h-7 w-7 bg-foreground"
                : "h-7 w-7 bg-foreground/20"
            }
          />
        ))}
      </View>
    </View>
  );
}
