import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Checkbox } from "heroui-native";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { ExerciseCard } from "@/components/exercise-card";
import { ExerciseSearchHeader } from "@/components/exercise-search-header";
import { useExercise } from "@/hooks/useExercise";
import { getAllExercises } from "@/lib/exercises";
import { getWorkout, setWorkout, useWorkouts } from "@/lib/workouts";

export default function WorkoutPicker() {
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date: string }>();
  const exercises = useMemo(() => getAllExercises(), []);

  const { activeCategory, categories, filtered, search, setSearch } =
    useExercise({ data: exercises });

  const workouts = useWorkouts();
  const existing = useMemo(() => getWorkout(workouts, date), [workouts, date]);
  const [selectedIds, setSelectedIds] = useState(
    () => new Set(existing.map((exercise) => exercise.id)),
  );

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
    const selected = exercises.filter((exercise) =>
      selectedIds.has(exercise.id),
    );
    setWorkout(date, selected);
    router.back();
  };

  return (
    <View className="flex-1 bg-foreground">
      <Stack.Screen
        options={{
          title: "Add Exercises",
          headerRight: () => (
            <Button size="sm" variant="ghost" onPress={handleSave}>
              Save
            </Button>
          ),
        }}
      />
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, gap: 12, flexGrow: 1 }}
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
          <View className="px-4">
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
          </View>
        )}
      />
    </View>
  );
}
