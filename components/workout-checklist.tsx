import { SymbolView } from "expo-symbols";
import { Checkbox, useThemeColor } from "heroui-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { ExerciseCard } from "@/components/exercise-card";
import type { Exercise } from "@/lib/exercises";
import {
  isExerciseCompleted,
  toggleExerciseCompleted,
  useSessions,
} from "@/lib/sessions";

type WorkoutChecklistProps = {
  dateKey: string;
  exercises: Exercise[];
};

/** Per-exercise checklist for a day's workout: check off completion, tap the row to expand the
 * full card. Uses the `surface`/`surface-foreground` token pair so it reads correctly in both
 * light and dark theme — the checkbox and expand-row are separate tap targets (siblings, not
 * nested pressables) to avoid gesture/layout conflicts. */
export function WorkoutChecklist({
  dateKey,
  exercises,
}: WorkoutChecklistProps) {
  const sessions = useSessions();
  const [expandedId, setExpandedId] = useState<string | undefined>();

  return (
    <View className="gap-2">
      {exercises.map((exercise) => {
        const isCompleted = isExerciseCompleted(sessions, dateKey, exercise.id);
        const isExpanded = expandedId === exercise.id;

        return (
          <View key={exercise.id} className="overflow-hidden bg-surface">
            <View className="flex-row items-center pl-3">
              <Checkbox
                isSelected={isCompleted}
                onSelectedChange={() =>
                  toggleExerciseCompleted(dateKey, exercise.id)
                }
                className="border-2 border-surface-foreground"
              />
              <Pressable
                onPress={() =>
                  setExpandedId((current) =>
                    current === exercise.id ? undefined : exercise.id,
                  )
                }
                className="flex-1 flex-row items-center justify-between gap-2 px-3 py-3"
              >
                <Text
                  className="flex-1 font-semibold text-surface-foreground"
                  numberOfLines={1}
                >
                  {exercise.name}
                </Text>
              </Pressable>
            </View>
            {isExpanded ? <ExerciseCard exercise={exercise} /> : null}
          </View>
        );
      })}
    </View>
  );
}
