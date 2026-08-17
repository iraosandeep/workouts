import { useMemo } from "react";
import { FlatList, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { ExerciseCard } from "@/components/exercise-card";
import { ExerciseSearchHeader } from "@/components/exercise-search-header";
import { useExercise } from "@/hooks/useExercise";
import { getAllExercises } from "@/lib/exercises";

export default function Exercises() {
  const exercises = useMemo(() => getAllExercises(), []);

  const {
    activeCategory,
    categories,
    filtered,
    search,
    setSearch,
    bodyParts,
    selectedBodyParts,
    setSelectedBodyParts,
    selectedDifficulties,
    setSelectedDifficulties,
  } = useExercise({ data: exercises });

  return (
    <View className="flex-1 bg-background">
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={{ paddingTop: 16, gap: 12, flexGrow: 1 }}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
        removeClippedSubviews
        ListHeaderComponent={
          <View className="px-4">
            <ExerciseSearchHeader
              search={search}
              onSearchChange={setSearch}
              categories={categories}
              activeCategory={activeCategory}
              placeholder='Search exercises… e.g. "kettlebell" or "hamstrings"'
              bodyParts={bodyParts}
              selectedBodyParts={selectedBodyParts}
              onBodyPartsChange={setSelectedBodyParts}
              selectedDifficulties={selectedDifficulties}
              onDifficultiesChange={setSelectedDifficulties}
            />
          </View>
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
            <ExerciseCard exercise={item} />
          </View>
        )}
      />
    </View>
  );
}
