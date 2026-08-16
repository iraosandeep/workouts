import { SearchField, Tabs } from "heroui-native";
import { View } from "react-native";

import { ALL_CATEGORIES } from "@/hooks/useExercise";
import { humanize, type ExerciseCategory } from "@/lib/exercises";

type ExerciseSearchHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  categories: ExerciseCategory[];
  activeCategory: ExerciseCategory | undefined;
  placeholder: string;
};

/** Search box + category filter row shared by the Exercises directory and the workout picker. */
export function ExerciseSearchHeader({
  search,
  onSearchChange,
  categories,
  activeCategory,
  placeholder,
}: ExerciseSearchHeaderProps) {
  return (
    <View className="gap-3 px-4 pb-2">
      <SearchField value={search} onChange={onSearchChange}>
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input
            placeholder={placeholder}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <Tabs
        value={activeCategory ?? ALL_CATEGORIES}
        onValueChange={(value) =>
          onSearchChange(value === ALL_CATEGORIES ? "" : value)
        }
      >
        <Tabs.List>
          <Tabs.ScrollView>
            <Tabs.Indicator />
            <Tabs.Trigger value={ALL_CATEGORIES}>
              <Tabs.Label>{ALL_CATEGORIES}</Tabs.Label>
            </Tabs.Trigger>
            {categories.map((category) => (
              <Tabs.Trigger key={category} value={category}>
                <Tabs.Label>{humanize(category)}</Tabs.Label>
              </Tabs.Trigger>
            ))}
          </Tabs.ScrollView>
        </Tabs.List>
      </Tabs>
    </View>
  );
}
