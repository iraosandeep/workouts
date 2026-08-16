import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { BottomSheet, Button, Checkbox, useToast } from "heroui-native";
import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { ExerciseCard } from "@/components/exercise-card";
import { ExerciseSearchHeader } from "@/components/exercise-search-header";
import { useExercise } from "@/hooks/useExercise";
import { getAllExercises } from "@/lib/exercises";
import { getWorkout, setWorkout, useWorkouts } from "@/lib/workouts";

type WorkoutPickerSheetProps = {
  /** The date being edited, or undefined when the sheet should be closed. */
  dateKey: string | undefined;
  onClose: () => void;
};

/** Exercise picker for a day's workout, rendered as an in-app bottom sheet (not a separate
 * modal route) — avoids the react-native-screens formSheet + FlatList interaction that was
 * dropping content. Reuses the same search/filter/card UI as the Exercises directory. */
export function WorkoutPickerSheet({
  dateKey,
  onClose,
}: WorkoutPickerSheetProps) {
  const { toast } = useToast();
  const exercises = useMemo(() => getAllExercises(), []);
  const { activeCategory, categories, filtered, search, setSearch } =
    useExercise({ data: exercises });

  const workouts = useWorkouts();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!dateKey) return;
    const existing = getWorkout(workouts, dateKey);
    setSelectedIds(new Set(existing.map((exercise) => exercise.id)));
    // Only reseed selection when the sheet opens for a (possibly new) date.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  const toggle = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSave = () => {
    if (!dateKey) return;
    const selected = exercises.filter((exercise) =>
      selectedIds.has(exercise.id),
    );
    setWorkout(dateKey, selected);
    onClose();
    toast.show({
      variant: "success",
      label: selected.length > 0 ? "Workout saved" : "Workout cleared",
    });
  };

  return (
    <BottomSheet
      isOpen={dateKey !== undefined}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={["92%"]}
          enableOverDrag={false}
          enableDynamicSizing={false}
          contentContainerClassName="h-full"
        >
          <View className="flex-row items-center justify-between pb-2">
            <BottomSheet.Title>Add Exercises</BottomSheet.Title>
            <Button size="sm" variant="ghost" onPress={handleSave}>
              Save
            </Button>
          </View>
          <BottomSheetFlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 12 }}
            ListHeaderComponent={
              <ExerciseSearchHeader
                search={search}
                onSearchChange={setSearch}
                categories={categories}
                activeCategory={activeCategory}
                placeholder='Search exercises… e.g. "kettlebell" or "hamstrings"'
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="magnifyingglass"
                title="No matches"
                description={`Nothing found for "${search}". Try a different search term or category.`}
              />
            }
            renderItem={({ item }) => (
              <View>
                <ExerciseCard exercise={item} />
                <View className="absolute left-3 top-3">
                  <Checkbox
                    isSelected={selectedIds.has(item.id)}
                    onSelectedChange={() => toggle(item.id)}
                    className="border-2 border-background bg-background"
                  />
                </View>
              </View>
            )}
          />
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
