import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, BackHandler, ScrollView, Text, View } from "react-native";
import { Button, useToast } from "heroui-native";

import { WorkoutChecklist } from "@/components/workout-checklist";
import { formatWeekDayDate, getCurrentWeekDays, toDateKey } from "@/lib/week";
import { getWorkout, useWorkouts } from "@/lib/workouts";

/** "125:00:07" / "07:32" — hours only shown once a session runs past an hour. */
function formatElapsed(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}

/** Full-screen, locked-in workout session — presented as a fullScreenModal (see
 * (dashboard)/_layout.tsx) so the tab bar is covered and swipe-to-dismiss is disabled.
 * The only way out is the explicit "Finish Workout" button below. */
export default function WorkoutSession() {
  const { toast } = useToast();
  const weekDays = useMemo(() => getCurrentWeekDays(), []);
  const todayIndex = Math.max(
    weekDays.findIndex((weekDay) => weekDay.isToday),
    0,
  );
  const today = weekDays[todayIndex];
  const dateKey = toDateKey(today.date);

  const workouts = useWorkouts();
  const exercises = getWorkout(workouts, dateKey);

  // Elapsed time since the session screen mounted. Derived from a fixed start
  // timestamp each tick (not a naive incrementing counter) so it stays correct
  // even if the interval is throttled while the app is backgrounded.
  const startTimeRef = useRef(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Block the Android hardware back button while a session is active —
  // exiting is only allowed via "Finish Workout" below.
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => true,
      );
      return () => subscription.remove();
    }, []),
  );

  const finish = () => {
    Alert.alert("Finsih Workout", "", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Finish",
        style: "default",
        onPress: () => {
          toast.show({
            variant: "success",
            label: "Workout finished",
            description: `${formatElapsed(elapsedSeconds)} workout time`,
          });
          router.back();
        },
      },
    ]);
  };

  return (
    <View className={`flex-1 bg-background`}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16, flexGrow: 1 }}
      >
        <View className="gap-1">
          <Text className="text-sm font-semibold uppercase tracking-wide text-muted">
            Workout In Progress
          </Text>
          <Text className="text-4xl font-extrabold uppercase tracking-wide text-foreground">
            {today.day}
          </Text>
          <Text className="text-sm text-muted">
            {formatWeekDayDate(today.date)}
          </Text>
        </View>

        <Text
          className="text-center text-6xl font-extrabold text-foreground"
          style={{ fontVariant: ["tabular-nums"] }}
          selectable
        >
          {formatElapsed(elapsedSeconds)}
        </Text>

        <WorkoutChecklist dateKey={dateKey} exercises={exercises} />

        <Button onPress={finish}>Finish Workout</Button>
      </ScrollView>
    </View>
  );
}
