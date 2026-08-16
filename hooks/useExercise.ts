import { useMemo, useState } from "react";

import type { Exercise } from "@/lib/exercises";

export const ALL_CATEGORIES = "All";

export const useExercise = ({ data }: { data: Exercise[] }) => {
  const [search, setSearch] = useState("");
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
        exercise.tags.some((tag) => tag.toLowerCase().includes(query)),
    );
  }, [data, search]);

  const activeCategory = categories.find(
    (category) => category.toLowerCase() === search.trim().toLowerCase(),
  );

  return {
    search,
    setSearch,
    categories,
    filtered,
    activeCategory,
  };
};
