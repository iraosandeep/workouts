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

/** OpenAI/Groq-compatible tool definitions the chat agent can call to read
 * and edit the user's workout plan. Each one maps directly onto an existing
 * lib/workouts.ts or lib/exercises.ts function — no logic lives here beyond
 * argument parsing and result shaping. */
export const AGENT_TOOLS = [
  {
    type: "function",
    function: {
      name: "search_exercises",
      description:
        "Search the exercise catalog by name, body part, muscle, equipment, or tag. Returns exercise ids — use this before adding any exercise to a workout, never guess an id.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: 'Free-text search, e.g. "chest" or "kettlebell".',
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_workout",
      description: "Get the exercises currently planned for a given date.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date as YYYY-MM-DD." },
        },
        required: ["date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_workout",
      description:
        "Create or fully replace the workout plan for a date with a specific list of exercises.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date as YYYY-MM-DD." },
          exerciseIds: {
            type: "array",
            items: { type: "string" },
            description: "Exercise ids returned by search_exercises.",
          },
        },
        required: ["date", "exerciseIds"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "add_exercise_to_workout",
      description:
        "Add a single exercise to a date's existing plan without removing what's already there.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date as YYYY-MM-DD." },
          exerciseId: {
            type: "string",
            description: "Exercise id returned by search_exercises.",
          },
        },
        required: ["date", "exerciseId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "remove_exercise_from_workout",
      description: "Remove a single exercise from a date's plan.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date as YYYY-MM-DD." },
          exerciseId: { type: "string" },
        },
        required: ["date", "exerciseId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "delete_workout",
      description: "Clear the entire workout plan for a date.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date as YYYY-MM-DD." },
        },
        required: ["date"],
      },
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

/** Executes one tool call by name against the parsed JSON `arguments` string
 * a tool-calling model returns, and gives back a JSON string suitable for a
 * `tool` role message's content. */
export function runAgentTool(name: string, rawArgs: string): string {
  let args: Record<string, unknown>;
  try {
    args = rawArgs ? JSON.parse(rawArgs) : {};
  } catch {
    return JSON.stringify({ error: "Malformed tool arguments." });
  }

  const date = typeof args.date === "string" ? args.date : undefined;

  switch (name) {
    case "search_exercises": {
      const query = typeof args.query === "string" ? args.query : "";
      const matches = getAllExercises()
        .filter((exercise) => matchesExerciseQuery(exercise, query))
        .slice(0, MAX_SEARCH_RESULTS)
        .map(summarize);
      return JSON.stringify({ matches });
    }

    case "get_workout": {
      if (!date) return JSON.stringify({ error: "Missing date." });
      const exercises = getWorkoutForDate(date).map(summarize);
      return JSON.stringify({ date, exercises });
    }

    case "set_workout": {
      if (!date) return JSON.stringify({ error: "Missing date." });
      const { found, missing } = resolveExerciseIds(args.exerciseIds);
      setWorkout(date, found);
      return JSON.stringify({
        date,
        saved: found.map((exercise) => exercise.name),
        unknownIds: missing,
      });
    }

    case "add_exercise_to_workout": {
      const exerciseId =
        typeof args.exerciseId === "string" ? args.exerciseId : undefined;
      if (!date || !exerciseId) {
        return JSON.stringify({ error: "Missing date or exerciseId." });
      }
      const exercise = getExerciseById(exerciseId);
      if (!exercise) {
        return JSON.stringify({
          error: `Unknown exercise id "${exerciseId}". Call search_exercises first.`,
        });
      }
      addExerciseToWorkout(date, exercise);
      return JSON.stringify({ date, added: exercise.name });
    }

    case "remove_exercise_from_workout": {
      const exerciseId =
        typeof args.exerciseId === "string" ? args.exerciseId : undefined;
      if (!date || !exerciseId) {
        return JSON.stringify({ error: "Missing date or exerciseId." });
      }
      removeExerciseFromWorkout(date, exerciseId);
      return JSON.stringify({ date, removed: exerciseId });
    }

    case "delete_workout": {
      if (!date) return JSON.stringify({ error: "Missing date." });
      setWorkout(date, []);
      return JSON.stringify({ date, cleared: true });
    }

    default:
      return JSON.stringify({ error: `Unknown tool "${name}".` });
  }
}
