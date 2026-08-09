import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";

import { ExerciseCard } from "@/components/exercise-card";
import { fetchExercises } from "@/lib/videos";

export default function Index() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const query = search.trim().toLowerCase();
    if (!query) return data;
    return data.filter(
      (exercise) =>
        exercise.title.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query),
    );
  }, [data, search]);

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      data={filtered}
      keyExtractor={(item) => item.name}
      numColumns={1}
      contentContainerStyle={{ padding: 16, gap: 16 }}
      initialNumToRender={4}
      maxToRenderPerBatch={4}
      windowSize={3}
      removeClippedSubviews
      ListHeaderComponent={
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder='Search exercises… e.g. "dumbbell row" or "chest"'
          placeholderTextColor="#8e8e93"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            backgroundColor: "#e9e9eb",
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: "#1c1c1e",
            marginBottom: 16,
          }}
        />
      }
      ListEmptyComponent={
        <View style={{ paddingTop: 40, alignItems: "center" }}>
          <Text style={{ color: "#8e8e93" }}>
            {isLoading
              ? "Loading exercises…"
              : isError
                ? "Couldn't load exercises. Pull to retry."
                : `No results for "${search}"`}
          </Text>
        </View>
      }
      onRefresh={refetch}
      refreshing={isLoading}
      renderItem={({ item }) => <ExerciseCard exercise={item} />}
    />
  );
}
