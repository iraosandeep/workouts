import type { Exercise } from "@/lib/exercises";
import { toDateKey, type WeekDay } from "@/lib/week";

type WorkoutFocus =
  | "push"
  | "pull"
  | "legs"
  | "upper"
  | "lower"
  | "full_body"
  | "conditioning"
  | "recovery";

const WORKOUTS: Record<
  WorkoutFocus,
  {
    exercises: string[];
    count: number;
  }
> = {
  push: {
    exercises: [
      "machine-chest-press",
      "machine-front-military-press",
      "machine-cable-v-bar-push-downs",
      "dumbbell-lateral-raise",
    ],
    count: 4,
  },

  pull: {
    exercises: [
      "machine-neutral-row",
      "machine-pulldown",
      "machine-face-pulls",
      "dumbbell-curl",
    ],
    count: 4,
  },

  legs: {
    exercises: [
      "machine-leg-press",
      "dumbbell-bulgarian-split-squat",
      "machine-leg-extension",
      "dumbbell-leg-curl",
    ],
    count: 4,
  },

  upper: {
    exercises: [
      "dumbbell-bench-press",
      "machine-neutral-row",
      "machine-front-military-press",
      "machine-face-pulls",
    ],
    count: 4,
  },

  lower: {
    exercises: [
      "machine-leg-press",
      "dumbbell-alternating-forward-lunge",
      "machine-45-degree-back-extension",
      "dumbbell-leg-curl",
    ],
    count: 4,
  },

  full_body: {
    exercises: [
      "machine-leg-press",
      "machine-chest-press",
      "machine-neutral-row",
      "dumbbell-thruster",
    ],
    count: 4,
  },

  conditioning: {
    exercises: ["burpee", "dumbbell-thruster", "cable-wood-chopper"],
    count: 3,
  },

  recovery: {
    exercises: [
      "abdominals-stretch-variation-one",
      "abdominals-stretch-variation-two",
      "abdominals-stretch-variation-three",
    ],
    count: 3,
  },
};

const WEEK_PLAN: WorkoutFocus[] = [
  "push",
  "pull",
  "legs",
  "upper",
  "lower",
  "full_body",
  "recovery",
];

function createExerciseMap(exercises: Exercise[]) {
  return new Map(exercises.map((exercise) => [exercise.id, exercise]));
}

/**
 * Builds a structured weekly workout plan instead of randomly
 * distributing exercises across the week.
 *
 * Goal:
 * - Fat loss
 * - Maintain/build lean muscle
 * - Improve strength
 * - Improve conditioning
 * - Keep workouts simple
 */
export function buildMockWeekWorkouts(
  exercises: Exercise[],
  weekDays: WeekDay[],
): Record<string, Exercise[]> {
  if (exercises.length === 0 || weekDays.length === 0) {
    return {};
  }

  const exerciseMap = createExerciseMap(exercises);

  return Object.fromEntries(
    weekDays.map((weekDay, dayIndex) => {
      const focus = WEEK_PLAN[dayIndex % WEEK_PLAN.length];

      const workout = WORKOUTS[focus].exercises
        .map((id) => exerciseMap.get(id))
        .filter((exercise): exercise is Exercise => Boolean(exercise));

      return [toDateKey(weekDay.date), workout];
    }),
  );
}
