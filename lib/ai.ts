import {
  AGENT_TOOLS,
  runAgentTool,
  type ExerciseSummary,
} from "@/lib/agent-tools";
import { createLogger } from "@/lib/logger";
import { toDateKey } from "@/lib/week";

const logger = createLogger("AI");

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type WorkoutCardData = {
  dateKey: string;
  exercises: ExerciseSummary[];
};

export type ChatReply = {
  text: string;
  cards: WorkoutCardData[];
};

/** Tool results shaped `{ date, exercises }` (get_workout, set_workout,
 * add/remove_exercise_to_workout, delete_workout) double as day-card data —
 * this is the only shape check needed to spot them. */
function asWorkoutCard(result: unknown): WorkoutCardData | undefined {
  if (typeof result !== "object" || result === null) return undefined;
  const { date, exercises } = result as Record<string, unknown>;
  if (typeof date !== "string" || !Array.isArray(exercises)) return undefined;
  return { dateKey: date, exercises: exercises as ExerciseSummary[] };
}

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Tried in order. If the first is under sustained "high demand" (503s that
// don't clear up after retrying), fall back to the second rather than
// failing the whole chat.
const GEMINI_MODELS = ["gemini-flash-lite-latest", "gemini-flash-latest"];

function urlFor(model: string) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

// Guards against a runaway tool-call loop if the model never settles on a
// plain-text reply. Generous because a request like "build a plan for every
// day this week" needs roughly a search + set call per day (14+ round trips).
const MAX_TOOL_ROUNDS = 25;

// Gemini occasionally answers with a transient 503 ("high demand") or 429
// (rate limited) — both usually clear up within a couple seconds, so retry
// with a short backoff before falling back to the next model.
const RETRYABLE_STATUS_CODES = new Set([429, 503]);
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildSystemPrompt(): string {
  const today = new Date();
  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });

  return [
    "You are a concise, encouraging fitness coach inside a workout tracking app.",
    "Keep replies short and practical.",
    `Today is ${weekday}, ${toDateKey(today)}. Dates are always YYYY-MM-DD.`,
    "You can read and edit the user's workout plan with the provided tools.",
    "Always call search_exercises to find a real exercise id before adding one — never guess an id.",
  ].join(" ");
}

type FunctionCallPart = {
  functionCall: { name: string; args: Record<string, unknown> };
};

type GeminiPart =
  { text: string } | FunctionCallPart | { functionResponse: unknown };

type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};

function isFunctionCallPart(part: GeminiPart): part is FunctionCallPart {
  return "functionCall" in part;
}

async function callGemini(contents: GeminiContent[]) {
  if (!GEMINI_API_KEY) {
    logger.error("missing EXPO_PUBLIC_GEMINI_API_KEY");
    throw new Error(
      "Missing EXPO_PUBLIC_GEMINI_API_KEY. Add it to .env.local and restart the dev server.",
    );
  }

  const body = JSON.stringify({
    contents,
    systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
    tools: [{ functionDeclarations: AGENT_TOOLS }],
  });

  let lastError: unknown = new Error("Gemini request failed.");

  for (const model of GEMINI_MODELS) {
    const url = urlFor(model);

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      logger.log(
        `POST ${url} (${contents.length} turns, attempt ${attempt + 1}/${MAX_RETRIES + 1})`,
      );

      let response: Response;
      try {
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY,
          },
          body,
        });
      } catch (error) {
        lastError = error;
        if (attempt < MAX_RETRIES) {
          logger.warn(
            `fetch threw before a response was received, retrying in ${RETRY_DELAY_MS}ms:`,
            error,
          );
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        logger.warn(`${model} unreachable after retries, trying next model`);
        break;
      }

      logger.log("response status", response.status);

      if (response.ok) {
        return response.json();
      }

      const errorText = await response.text();
      lastError = new Error(
        `Gemini request failed (${response.status}): ${errorText}`,
      );

      if (!RETRYABLE_STATUS_CODES.has(response.status)) {
        logger.error("Gemini returned an error body:", errorText);
        throw lastError;
      }

      if (attempt < MAX_RETRIES) {
        logger.warn(
          `Gemini returned ${response.status}, retrying in ${RETRY_DELAY_MS}ms:`,
          errorText,
        );
        await sleep(RETRY_DELAY_MS);
        continue;
      }

      logger.warn(
        `${model} still ${response.status} after retries, trying next model`,
      );
    }
  }

  logger.error("all models failed:", lastError);
  throw lastError;
}

/** Sends the conversation to Gemini with workout tool access. Any function
 * calls the model makes are resolved locally against lib/workouts.ts /
 * lib/exercises.ts and fed back until the model returns a plain reply.
 * Along the way, any tool result shaped like a day's plan is collected into
 * `cards` so the chat UI can render it as a workout card, not just text. */
export async function sendChatMessage(
  messages: ChatMessage[],
): Promise<ChatReply> {
  const contents: GeminiContent[] = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  const cardsByDate = new Map<string, WorkoutCardData>();

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    logger.log(`round ${round + 1}/${MAX_TOOL_ROUNDS}`);
    const data = await callGemini(contents);
    const parts: GeminiPart[] = data.candidates?.[0]?.content?.parts ?? [];
    const functionCalls = parts.filter(isFunctionCallPart);

    if (functionCalls.length === 0) {
      const text = parts
        .map((part) => ("text" in part ? part.text : ""))
        .join("")
        .trim();
      if (!text) {
        logger.error("no text and no function calls in response:", data);
        throw new Error("Gemini response did not include a message.");
      }
      const cards = [...cardsByDate.values()].sort((a, b) =>
        a.dateKey.localeCompare(b.dateKey),
      );
      return { text, cards };
    }

    logger.log(
      "tool calls:",
      functionCalls.map(({ functionCall }) => functionCall.name).join(", "),
    );

    contents.push({ role: "model", parts: functionCalls });

    contents.push({
      role: "user",
      parts: functionCalls.map(({ functionCall }) => {
        const result = runAgentTool(functionCall.name, functionCall.args);
        const card = asWorkoutCard(result);
        if (card) cardsByDate.set(card.dateKey, card);

        return {
          functionResponse: {
            name: functionCall.name,
            response: { name: functionCall.name, content: result },
          },
        };
      }),
    });
  }

  throw new Error("The assistant took too many steps without finishing.");
}
