import { useQuery } from "@tanstack/react-query";
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
import { useExercise } from "@/hooks/useExercise";

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
            <TextInput
              clearButtonMode="always"
              value={search}
              onChangeText={setSearch}
              placeholder='Search exercises… e.g. "dumbbell row" or "chest"'
              placeholderTextColor="#faf7f7"
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                backgroundColor: "#141414",
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 16,
                color: "white",
                marginBottom: 12,
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
                      backgroundColor: isActive ? "#141414" : "#e9e9eb",
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
