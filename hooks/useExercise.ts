import { useMemo, useState } from "react";

import type { BodyPart, Difficulty, Exercise } from "@/lib/exercises";

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
    const query = search.trim().toLowerCase();

    return data.filter((exercise) => {
      const matchesQuery =
        !query ||
        exercise.name.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query) ||
        exercise.equipment.some((equipment) =>
          equipment.toLowerCase().includes(query),
        ) ||
        exercise.primary_muscles.some((muscle) =>
          muscle.toLowerCase().includes(query),
        ) ||
        exercise.body_parts.some((bodyPart) =>
          bodyPart.toLowerCase().includes(query),
        ) ||
        exercise.tags.some((tag) => tag.toLowerCase().includes(query));

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
