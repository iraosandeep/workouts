import {
  getExerciseById,
  getAllExercises,
  matchesExerciseQuery,
  type Exercise,
} from "@/lib/exercises";
import {
  addExerciseToWorkout,
  getWorkoutForDate,
  removeExerciseFromWorkout,
  setWorkout,
} from "@/lib/workouts";

const MAX_SEARCH_RESULTS = 10;

/** Gemini function-declaration definitions the chat agent can call to read
 * and edit the user's workout plan. Each one maps directly onto an existing
 * lib/workouts.ts or lib/exercises.ts function — no logic lives here beyond
 * argument parsing and result shaping. */
export const AGENT_TOOLS = [
  {
    name: "search_exercises",
    description:
      "Search the exercise catalog by name, body part, muscle, equipment, or tag. Returns exercise ids — use this before adding any exercise to a workout, never guess an id.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: 'Free-text search, e.g. "chest" or "kettlebell".',
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_workout",
    description: "Get the exercises currently planned for a given date.",
    parameters: {
      type: "OBJECT",
      properties: {
        date: { type: "STRING", description: "Date as YYYY-MM-DD." },
      },
      required: ["date"],
    },
  },
  {
    name: "set_workout",
    description:
      "Create or fully replace the workout plan for a date with a specific list of exercises.",
    parameters: {
      type: "OBJECT",
      properties: {
        date: { type: "STRING", description: "Date as YYYY-MM-DD." },
        exerciseIds: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Exercise ids returned by search_exercises.",
        },
      },
      required: ["date", "exerciseIds"],
    },
  },
  {
    name: "add_exercise_to_workout",
    description:
      "Add a single exercise to a date's existing plan without removing what's already there.",
    parameters: {
      type: "OBJECT",
      properties: {
        date: { type: "STRING", description: "Date as YYYY-MM-DD." },
        exerciseId: {
          type: "STRING",
          description: "Exercise id returned by search_exercises.",
        },
      },
      required: ["date", "exerciseId"],
    },
  },
  {
    name: "remove_exercise_from_workout",
    description: "Remove a single exercise from a date's plan.",
    parameters: {
      type: "OBJECT",
      properties: {
        date: { type: "STRING", description: "Date as YYYY-MM-DD." },
        exerciseId: { type: "STRING" },
      },
      required: ["date", "exerciseId"],
    },
  },
  {
    name: "delete_workout",
    description: "Clear the entire workout plan for a date.",
    parameters: {
      type: "OBJECT",
      properties: {
        date: { type: "STRING", description: "Date as YYYY-MM-DD." },
      },
      required: ["date"],
    },
  },
] as const;

function summarize(exercise: Exercise) {
  return {
    id: exercise.id,
    name: exercise.name,
    category: exercise.category,
    difficulty: exercise.difficulty,
    body_parts: exercise.body_parts,
  };
}

function resolveExerciseIds(exerciseIds: unknown) {
  const ids = Array.isArray(exerciseIds) ? exerciseIds : [];
  const found: Exercise[] = [];
  const missing: string[] = [];

  for (const id of ids) {
    const exercise = typeof id === "string" ? getExerciseById(id) : undefined;
    if (exercise) {
      found.push(exercise);
    } else {
      missing.push(String(id));
    }
  }

  return { found, missing };
}

/** Executes one tool call by name against the already-parsed `args` object
 * Gemini hands back for a functionCall, and returns a plain JSON-serializable
 * result — the caller is responsible for wrapping it into whatever shape the
 * model transport expects. */
export function runAgentTool(name: string, args: Record<string, unknown>): unknown {
  const date = typeof args.date === "string" ? args.date : undefined;

  switch (name) {
    case "search_exercises": {
      const query = typeof args.query === "string" ? args.query : "";
      const matches = getAllExercises()
        .filter((exercise) => matchesExerciseQuery(exercise, query))
        .slice(0, MAX_SEARCH_RESULTS)
        .map(summarize);
      return { matches };
    }

    case "get_workout": {
      if (!date) return { error: "Missing date." };
      const exercises = getWorkoutForDate(date).map(summarize);
      return { date, exercises };
    }

    case "set_workout": {
      if (!date) return { error: "Missing date." };
      const { found, missing } = resolveExerciseIds(args.exerciseIds);
      setWorkout(date, found);
      return {
        date,
        saved: found.map((exercise) => exercise.name),
        unknownIds: missing,
      };
    }

    case "add_exercise_to_workout": {
      const exerciseId =
        typeof args.exerciseId === "string" ? args.exerciseId : undefined;
      if (!date || !exerciseId) {
        return { error: "Missing date or exerciseId." };
      }
      const exercise = getExerciseById(exerciseId);
      if (!exercise) {
        return {
          error: `Unknown exercise id "${exerciseId}". Call search_exercises first.`,
        };
      }
      addExerciseToWorkout(date, exercise);
      return { date, added: exercise.name };
    }

    case "remove_exercise_from_workout": {
      const exerciseId =
        typeof args.exerciseId === "string" ? args.exerciseId : undefined;
      if (!date || !exerciseId) {
        return { error: "Missing date or exerciseId." };
      }
      removeExerciseFromWorkout(date, exerciseId);
      return { date, removed: exerciseId };
    }

    case "delete_workout": {
      if (!date) return { error: "Missing date." };
      setWorkout(date, []);
      return { date, cleared: true };
    }

    default:
      return { error: `Unknown tool "${name}".` };
  }
}
