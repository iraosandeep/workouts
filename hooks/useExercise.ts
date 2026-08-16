import { useMemo, useState } from "react";

import {
  matchesExerciseQuery,
  type BodyPart,
  type Difficulty,
  type Exercise,
} from "@/lib/exercises";

export const ALL_CATEGORIES = "All";

export const useExercise = ({ data }: { data: Exercise[] }) => {
  const [search, setSearch] = useState("");
  const [selectedBodyParts, setSelectedBodyParts] = useState<Set<BodyPart>>(
    () => new Set(),
  );
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    Set<Difficulty>
  >(() => new Set());

  const categories = useMemo(() => {
    if (!data) return [];
    return Array.from(
      new Set(data.map((exercise) => exercise.category)),
    ).sort();
  }, [data]);

  const bodyParts = useMemo(() => {
    if (!data) return [];
    return Array.from(
      new Set(data.flatMap((exercise) => exercise.body_parts)),
    ).sort();
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];

    return data.filter((exercise) => {
      const matchesQuery = matchesExerciseQuery(exercise, search);

      const matchesBodyParts =
        selectedBodyParts.size === 0 ||
        exercise.body_parts.some((bodyPart) =>
          selectedBodyParts.has(bodyPart),
        );

      const matchesDifficulty =
        selectedDifficulties.size === 0 ||
        selectedDifficulties.has(exercise.difficulty);

      return matchesQuery && matchesBodyParts && matchesDifficulty;
    });
  }, [data, search, selectedBodyParts, selectedDifficulties]);

  const activeCategory = categories.find(
    (category) => category.toLowerCase() === search.trim().toLowerCase(),
  );

  return {
    search,
    setSearch,
    categories,
    filtered,
    activeCategory,
    bodyParts,
    selectedBodyParts,
    setSelectedBodyParts,
    selectedDifficulties,
    setSelectedDifficulties,
  };
};
