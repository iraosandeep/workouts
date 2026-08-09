import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { ExerciseCard } from "@/components/exercise-card";
import { fetchExercises } from "@/lib/videos";
import { GradientBackground } from "@/components/bg";

export default function Index() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });

  const categories = useMemo(() => {
    if (!data) return [];
    return Array.from(
      new Set(data.map((exercise) => exercise.category)),
    ).sort();
  }, [data]);

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

  const activeCategory = categories.find(
    (category) => category.toLowerCase() === search.trim().toLowerCase(),
  );

  return (
    <GradientBackground>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={filtered}
        keyExtractor={(item) => item.name}
        numColumns={1}
        contentContainerStyle={{ paddingTop: 16, padding: 6, gap: 12 }}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
        removeClippedSubviews
        ListHeaderComponent={
          <View>
            <TextInput
              clearButtonMode="always"
              value={search}
              onChangeText={setSearch}
              placeholder='Search exercises… e.g. "dumbbell row" or "chest"'
              placeholderTextColor="#cacae8"
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                backgroundColor: "#055bf0",
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: "white",
                marginBottom: 12,
                borderRadius: 99,
              }}
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 8,
                paddingHorizontal: 6,
                paddingBottom: 16,
              }}
            >
              {categories.map((category) => {
                const isActive = category === activeCategory;
                return (
                  <Pressable
                    key={category}
                    onPress={() => setSearch(isActive ? "" : category)}
                    style={{
                      backgroundColor: isActive ? "#055bf0" : "#e9e9eb",
                      borderRadius: 99,
                      paddingHorizontal: 14,
                      paddingVertical: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: isActive ? "white" : "#1c1c1e",
                      }}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
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
    </GradientBackground>
  );
}
