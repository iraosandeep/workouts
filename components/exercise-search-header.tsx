import { SearchField, Tabs } from "heroui-native";
import { View } from "react-native";

import { MultiSelectFilter } from "@/components/multi-select-filter";
import { ALL_CATEGORIES } from "@/hooks/useExercise";
import {
  DIFFICULTIES,
  humanize,
  type BodyPart,
  type Difficulty,
  type ExerciseCategory,
} from "@/lib/exercises";

type ExerciseSearchHeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
  categories: ExerciseCategory[];
  activeCategory: ExerciseCategory | undefined;
  placeholder: string;
  bodyParts: BodyPart[];
  selectedBodyParts: Set<BodyPart>;
  onBodyPartsChange: (next: Set<BodyPart>) => void;
  selectedDifficulties: Set<Difficulty>;
  onDifficultiesChange: (next: Set<Difficulty>) => void;
};

/** Search box + category/muscle-group/difficulty filters shared by the Exercises
 * directory and the workout picker. */
export function ExerciseSearchHeader({
  search,
  onSearchChange,
  categories,
  activeCategory,
  placeholder,
  bodyParts,
  selectedBodyParts,
  onBodyPartsChange,
  selectedDifficulties,
  onDifficultiesChange,
}: ExerciseSearchHeaderProps) {
  return (
    <View className="gap-3 pb-2">
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

      <View className="flex-row gap-2">
        <View className="flex-1">
          <MultiSelectFilter
            label="Muscle Groups"
            options={bodyParts}
            selected={selectedBodyParts}
            onSelectedChange={onBodyPartsChange}
            formatOption={humanize}
          />
        </View>
        <View className="flex-1">
          <MultiSelectFilter
            label="Difficulty"
            options={DIFFICULTIES}
            selected={selectedDifficulties}
            onSelectedChange={onDifficultiesChange}
            formatOption={humanize}
          />
        </View>
      </View>
    </View>
  );
}
