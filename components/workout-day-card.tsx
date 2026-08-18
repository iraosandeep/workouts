import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { ExerciseCard } from "@/components/exercise-card";
import type { WorkoutCardData } from "@/lib/ai";
import { getExerciseById } from "@/lib/exercises";
import {
  formatWeekDayDate,
  getDayColorClassName,
  getMondayIndexedWeekday,
} from "@/lib/week";

/** Renders a tool result from the chat agent (get/set/add/remove/delete
 * workout) as a card matching the Week tab's day panel — same background
 * color, same bold day name, plain exercise list. Tapping a row expands it
 * into the same ExerciseCard used elsewhere (video + details) — video isn't
 * shown by default so a multi-day reply doesn't turn into a wall of video
 * players. The row Pressable and the expanded ExerciseCard are siblings,
 * not nested, same as workout-checklist.tsx. */
export function WorkoutDayCard({ dateKey, exercises }: WorkoutCardData) {
  const [expandedId, setExpandedId] = useState<string | undefined>();
  const date = new Date(`${dateKey}T00:00:00`);
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const dayColorClassName = getDayColorClassName(getMondayIndexedWeekday(date));

  return (
    <View className={`gap-2 p-4 ${dayColorClassName}`}>
      <Pressable
        onPress={() =>
          router.push({ pathname: "/today", params: { date: dateKey } })
        }
      >
        <Text className="text-lg font-extrabold uppercase tracking-wide text-foreground">
          {dayName}
        </Text>
        <Text className="text-xs text-muted">{formatWeekDayDate(date)}</Text>
      </Pressable>
      {exercises.length > 0 ? (
        <View className="gap-1">
          {exercises.map((exercise) => {
            const isExpanded = expandedId === exercise.id;
            const fullExercise = isExpanded
              ? getExerciseById(exercise.id)
              : undefined;

            return (
              <View key={exercise.id}>
                <Pressable
                  onPress={() =>
                    setExpandedId((current) =>
                      current === exercise.id ? undefined : exercise.id,
                    )
                  }
                >
                  <Text className="text-foreground" numberOfLines={1}>
                    • {exercise.name}
                  </Text>
                </Pressable>
                {fullExercise ? (
                  <View className="pt-2">
                    <ExerciseCard exercise={fullExercise} />
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      ) : (
        <Text className="text-foreground">No exercises planned</Text>
      )}
    </View>
  );
}
