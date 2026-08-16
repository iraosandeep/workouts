import { router } from "expo-router";
import { Button } from "heroui-native";
import { ScrollView, Text, View } from "react-native";

import { MonthProgress } from "@/components/month-progress";
import { WorkoutChecklist } from "@/components/workout-checklist";
import { getWorkout, useWorkouts } from "@/lib/workouts";
import { toDateKey } from "@/lib/week";

export default function Home() {
  const todayKey = toDateKey(new Date());
  const workouts = useWorkouts();
  const exercises = getWorkout(workouts, todayKey);
  const hasWorkout = exercises.length > 0;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
        <View className="gap-3">
          <Text className="text-2xl font-bold uppercase tracking-wide text-foreground">
            Today
          </Text>
          {hasWorkout ? (
            <WorkoutChecklist dateKey={todayKey} exercises={exercises} />
          ) : (
            <View className="gap-3 bg-surface p-4">
              <Text className="text-foreground">
                No workout planned for today.
              </Text>
              <Button
                size="sm"
                className="self-start"
                onPress={() =>
                  router.push({
                    pathname: "/picker",
                    params: { date: todayKey },
                  })
                }
              >
                Plan Today&apos;s Workout
              </Button>
            </View>
          )}
        </View>

        <MonthProgress />
      </ScrollView>
    </View>
  );
}
