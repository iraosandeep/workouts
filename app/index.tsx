import { useQuery } from "@tanstack/react-query";
import { FlatList, ScrollView, Text, View } from "react-native";

import { ExerciseCard } from "@/components/exercise-card";
import { fetchExercises } from "@/lib/videos";
import { GradientBackground } from "@/components/bg";
import { useExercise } from "@/hooks/useExercise";
import { Chip } from "@/components/chip";
import { Input } from "@/components/input";

export default function Index() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["exercises"],
    queryFn: fetchExercises,
  });

  const { activeCategory, categories, filtered, search, setSearch } =
    useExercise({ data: data ?? [] });

  return (
    <GradientBackground>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={filtered}
        keyExtractor={(item) => item.name}
        numColumns={1}
        contentContainerStyle={{ paddingTop: 16, padding: 0, gap: 0 }}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
        removeClippedSubviews
        ListHeaderComponent={
          <View>
            <Input
              clearButtonMode="always"
              value={search}
              onChangeText={setSearch}
              placeholder='Search exercises… e.g. "dumbbell row" or "chest"'
              autoCapitalize="none"
              autoCorrect={false}
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
                  <Chip
                    isActive={isActive}
                    key={category}
                    onPress={() => setSearch(isActive ? "" : category)}
                  >
                    {category}
                  </Chip>
                );
              })}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View style={{ paddingTop: 40, alignItems: "center" }}>
            <Text style={{ color: "#141414" }}>
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
