import { AGENT_TOOLS, runAgentTool } from "@/lib/agent-tools";
import { toDateKey } from "@/lib/week";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

// Guards against a runaway tool-call loop if the model never settles on a
// plain-text reply.
const MAX_TOOL_ROUNDS = 4;

// Llama 3.3 occasionally emits a malformed "<function=...>" tool call instead
// of a structured one; Groq rejects it with a 400 tool_use_failed error.
// Resampling almost always produces a valid call, so retry a couple of times
// before surfacing an error.
const MAX_TOOL_USE_RETRIES = 2;

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

type GroqToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
};

type GroqMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: GroqToolCall[];
  tool_call_id?: string;
};

async function callGroq(messages: GroqMessage[]) {
  if (!GROQ_API_KEY) {
    throw new Error(
      "Missing EXPO_PUBLIC_GROQ_API_KEY. Add it to .env.local and restart the dev server.",
    );
  }

  for (let attempt = 0; attempt <= MAX_TOOL_USE_RETRIES; attempt++) {
    const response = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        tools: AGENT_TOOLS,
      }),
    });

    if (response.ok) {
      return response.json();
    }

    const errorText = await response.text();
    const isRetryableToolFailure =
      response.status === 400 && errorText.includes('"tool_use_failed"');

    if (!isRetryableToolFailure || attempt === MAX_TOOL_USE_RETRIES) {
      throw new Error(`Groq request failed (${response.status}): ${errorText}`);
    }
  }

  throw new Error("Groq request failed.");
}

/** Sends the conversation to Groq with workout tool access. Any tool calls
 * the model makes are resolved locally against lib/workouts.ts /
 * lib/exercises.ts and fed back until the model returns a plain reply. */
export async function sendChatMessage(
  messages: ChatMessage[],
): Promise<string> {
  const conversation: GroqMessage[] = [
    { role: "system", content: buildSystemPrompt() },
    ...messages,
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const data = await callGroq(conversation);
    const message = data.choices?.[0]?.message;
    if (!message) {
      throw new Error("Groq response did not include a message.");
    }

    const toolCalls: GroqToolCall[] = message.tool_calls ?? [];
    if (toolCalls.length === 0) {
      if (typeof message.content !== "string") {
        throw new Error("Groq response did not include a message.");
      }
      return message.content;
    }

    conversation.push({
      role: "assistant",
      content: message.content ?? null,
      tool_calls: toolCalls,
    });

    for (const toolCall of toolCalls) {
      conversation.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: runAgentTool(toolCall.function.name, toolCall.function.arguments),
      });
    }
  }

  throw new Error("The assistant took too many steps without finishing.");
}
