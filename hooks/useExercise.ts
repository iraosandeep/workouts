import { useMemo, useState } from "react";
import type { Exercise } from "@/lib/videos";

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
        exercise.title.toLowerCase().includes(query) ||
        exercise.category.toLowerCase().includes(query),
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
