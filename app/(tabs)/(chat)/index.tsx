import { Button, Input, TextField } from "heroui-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChatMarkdown } from "@/components/chat-markdown";
import { EmptyState } from "@/components/empty-state";
import { sendChatMessage } from "@/lib/ai";
import { appendChatMessage, useChatMessages } from "@/lib/chat";
import { createLogger } from "@/lib/logger";

const logger = createLogger("Chat");

export default function Chat() {
  const messages = useChatMessages();
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || isSending) return;

    const userEntry = appendChatMessage("user", content);
    const history = [...messages, userEntry];
    setDraft("");
    setIsSending(true);

    logger.log("sending message, history length:", history.length);

    try {
      const reply = await sendChatMessage(
        history.map(({ role, content }) => ({ role, content })),
      );
      logger.log("got reply:", reply);
      appendChatMessage("assistant", reply);
    } catch (error) {
      logger.error("send failed:", error);
      appendChatMessage(
        "assistant",
        error instanceof Error ? error.message : "Something went wrong.",
      );
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
            {item.role === "assistant" ? (
              <ChatMarkdown content={item.content} />
            ) : (
              <Text className="text-background">{item.content}</Text>
            )}
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
