import { FlatList, ScrollView, Text, View } from "react-native";

import { ExerciseCard } from "@/components/exercise-card";
import { GradientBackground } from "@/components/bg";
import { useFavorites } from "@/lib/favorites";
import { useExercise } from "@/hooks/useExercise";
import { Chip } from "@/components/chip";
import { Input } from "@/components/input";
import { useTheme } from "@/lib/theme";

export default function Favorites() {
  const theme = useTheme();
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
                    key={category}
                    isActive={isActive}
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
          <View
            style={{
              paddingTop: 80,
            }}
          >
            <Text
              style={{
                color: theme.text,
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
