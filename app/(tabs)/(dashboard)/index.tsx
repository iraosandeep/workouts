import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useThemeColor } from "heroui-native";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { MonthProgress } from "@/components/month-progress";
import { formatWeekDayDate, getCurrentWeekDays, toDateKey } from "@/lib/week";
import { getWorkout, useWorkouts } from "@/lib/workouts";

export default function Home() {
  const todayKey = toDateKey(new Date());
  const workouts = useWorkouts();
  const weekDays = useMemo(() => getCurrentWeekDays(), []);
  const todayIndex = weekDays.findIndex((weekDay) => weekDay.isToday);
  const today = weekDays[todayIndex] ?? weekDays[0];
  const exercises = getWorkout(workouts, today ? todayKey : "");
  const hasWorkout = exercises.length > 0;
  const foregroundColor = useThemeColor("foreground");
  const summary = hasWorkout
    ? `${exercises.length} exercise${exercises.length === 1 ? "" : "s"}: ${exercises
        .map((exercise) => exercise.name)
        .join(", ")}`
    : "No workout planned yet — tap to add one.";

  return (
    <View className="flex-1 gap-3 p-4 bg-background">
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View className="flex gap-3">
          <View className="flex-row justify-end">
            <Pressable onPress={() => router.push("/profile")} hitSlop={12}>
              <SymbolView name="person.crop.circle" tintColor={foregroundColor} size={28} />
            </Pressable>
          </View>
          <View className="flex-1 bg-surface p-4">
            <Pressable
              onPress={() => router.push("/today")}
              className={`gap-2 p-1`}
            >
              <Text className="text-4xl font-extrabold uppercase tracking-wide text-foreground">
                Today
              </Text>
              <Text className="text-sm text-muted">
                {today.day} {formatWeekDayDate(today.date)}
              </Text>
              <Text className="text-foreground" numberOfLines={2}>
                {summary}
              </Text>
            </Pressable>
          </View>
          <MonthProgress />
        </View>
      </ScrollView>
    </View>
  );
}
