import {
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { ExerciseCard } from "@/components/exercise-card";
import { GradientBackground } from "@/components/bg";
import { useFavorites } from "@/lib/favorites";
import { useExercise } from "@/hooks/useExercise";

export default function Favorites() {
  const favorites = useFavorites();

  const { activeCategory, categories, filtered, search, setSearch } =
    useExercise({ data: favorites ?? [] });

  return (
    <GradientBackground>
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={filtered}
        keyExtractor={(item) => item.name}
        numColumns={1}
        contentContainerStyle={{ paddingTop: 16, padding: 0, gap: 0 }}
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
          <View
            style={{
              paddingTop: 80,
            }}
          >
            <Text
              style={{
                color: "#141414",
                textAlign: "center",
                paddingHorizontal: 20,
              }}
            >
              {search
                ? `No results for "${search}"`
                : "No favorites yet — tap the heart on any exercise to save it here."}
            </Text>
          </View>
        }
        renderItem={({ item }) => <ExerciseCard exercise={item} />}
      />
    </GradientBackground>
  );
}
