import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import type { ExerciseCategory } from "@/lib/exercises";
import { getMonthGridDays, toDateKey } from "@/lib/week";
import { getWorkout, useWorkouts } from "@/lib/workouts";

const WEEKDAY_INITIALS = ["M", "T", "W", "T", "F", "S", "S"];
const MAX_VISIBLE_BARS = 3;
const CELL_WIDTH = "14.2857%";

// One color per exercise category — a literal Record (not a template-literal
// className) so uniwind's static scanner can find every class name.
const CATEGORY_BAR_CLASSNAMES: Record<ExerciseCategory, string> = {
  strength: "bg-green-500",
  cardio: "bg-red-500",
  mobility: "bg-blue-500",
  stretching: "bg-orange-500",
  plyometric: "bg-purple-500",
  rehabilitation: "bg-cyan-500",
};

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default function Calendar() {
  const [viewedMonth, setViewedMonth] = useState(() => startOfMonth(new Date()));
  const workouts = useWorkouts();

  const days = useMemo(() => getMonthGridDays(viewedMonth), [viewedMonth]);
  const monthLabel = viewedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goToMonth = (offset: number) => {
    setViewedMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 16, gap: 16 }}
      >
        <View className="flex-row items-center justify-between">
          <Pressable onPress={() => goToMonth(-1)} hitSlop={12} className="p-2">
            <Text className="text-2xl text-foreground">‹</Text>
          </Pressable>
          <Text className="text-xl font-bold uppercase tracking-wide text-foreground">
            {monthLabel}
          </Text>
          <Pressable onPress={() => goToMonth(1)} hitSlop={12} className="p-2">
            <Text className="text-2xl text-foreground">›</Text>
          </Pressable>
        </View>

        <View className="flex-row">
          {WEEKDAY_INITIALS.map((label, index) => (
            <View
              key={index}
              style={{ width: CELL_WIDTH }}
              className="items-center py-1"
            >
              <Text className="text-xs font-semibold text-muted">
                {label}
              </Text>
            </View>
          ))}
        </View>

        <View className="flex-row flex-wrap">
          {days.map((day) => {
            const dateKey = toDateKey(day.date);
            const exercises = getWorkout(workouts, dateKey);
            const visibleExercises = exercises.slice(0, MAX_VISIBLE_BARS);
            const overflowCount = exercises.length - visibleExercises.length;

            return (
              <Pressable
                key={dateKey}
                onPress={() =>
                  router.push({ pathname: "/today", params: { date: dateKey } })
                }
                style={{ width: CELL_WIDTH, minHeight: 74 }}
                className={`gap-1 border p-1 ${
                  day.isCurrentMonth ? "bg-surface" : "bg-surface/40"
                } ${day.isToday ? "border-foreground" : "border-background"}`}
              >
                <Text
                  className={
                    day.isCurrentMonth ? "text-foreground" : "text-muted"
                  }
                >
                  {day.date.getDate()}
                </Text>
                <View className="gap-0.5">
                  {visibleExercises.map((exercise) => (
                    <View
                      key={exercise.id}
                      className={`h-1.5 w-full ${CATEGORY_BAR_CLASSNAMES[exercise.category]}`}
                    />
                  ))}
                </View>
                {overflowCount > 0 ? (
                  <Text className="text-right text-[10px] font-semibold text-muted">
                    +{overflowCount}
                  </Text>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
