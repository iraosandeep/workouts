import "expo-sqlite/localStorage/install";

import { getAllExercises } from "@/lib/exercises";
import { getCurrentWeekDays, toDateKey } from "@/lib/week";
import { buildMockWeekWorkouts } from "@/lib/mock-workouts";

const STORAGE_KEY = "workouts_v2";

function main() {
  console.log("🏋️ Generating weekly workout plan...\n");

  const exercises = getAllExercises();
  const weekDays = getCurrentWeekDays();

  if (exercises.length === 0) {
    console.error("❌ No exercises found.");
    process.exit(1);
  }

  console.log(`📚 Exercises available: ${exercises.length}`);

  const plan = buildMockWeekWorkouts(exercises, weekDays);

  const workouts: Record<string, typeof exercises> = {};

  weekDays.forEach((weekDay) => {
    const dateKey = toDateKey(weekDay.date);
    const workout = plan[dateKey];

    workouts[dateKey] = workout ?? [];

    console.log(
      `${weekDay.day.padEnd(10)} → ${workout?.length ?? 0} exercises`,
    );

    workout?.forEach((exercise) => {
      console.log(`   • ${exercise.name}`);
    });

    console.log("");
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));

  console.log("✅ Workout plan saved!");
  console.log(`📦 Storage key: ${STORAGE_KEY}`);
}

main();
