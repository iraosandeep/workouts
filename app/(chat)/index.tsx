import { Button, Input, TextField } from "heroui-native";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EmptyState } from "@/components/empty-state";
import { sendChatMessage, type ChatMessage } from "@/lib/ai";

type ChatEntry = ChatMessage & { id: string };

export default function Chat() {
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const nextId = useRef(0);
  const insets = useSafeAreaInsets();

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || isSending) return;

    const history = [
      ...messages,
      { id: String(nextId.current++), role: "user" as const, content },
    ];
    setMessages(history);
    setDraft("");
    setIsSending(true);

    try {
      const reply = await sendChatMessage(
        history.map(({ role, content }) => ({ role, content })),
      );
      setMessages((current) => [
        ...current,
        { id: String(nextId.current++), role: "assistant", content: reply },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: String(nextId.current++),
          role: "assistant",
          content:
            error instanceof Error ? error.message : "Something went wrong.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState
            icon="bubble.left.and.bubble.right"
            title="Ask your coach"
            description="Get advice, or ask it to plan, update, or clear a day's workout."
          />
        }
        renderItem={({ item }) => (
          <View
            className={`max-w-[85%] px-4 py-3 ${
              item.role === "user"
                ? "self-end bg-foreground"
                : "self-start bg-surface"
            }`}
          >
            <Text
              className={
                item.role === "user"
                  ? "text-background"
                  : "text-surface-foreground"
              }
            >
              {item.content}
            </Text>
          </View>
        )}
      />
      {isSending ? (
        <View className="px-4 pb-2">
          <ActivityIndicator />
        </View>
      ) : null}
      <View
        className="flex-row items-end gap-2 px-4 pt-2"
        style={{ paddingBottom: insets.bottom + 56 }}
      >
        <View className="flex-1">
          <TextField>
            <Input
              value={draft}
              onChangeText={setDraft}
              placeholder="Ask about your workout…"
              multiline
              onSubmitEditing={handleSend}
            />
          </TextField>
        </View>
        <Button onPress={handleSend} isDisabled={isSending || !draft.trim()}>
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
