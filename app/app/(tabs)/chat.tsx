import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { streamChat } from "../../lib/api";
import { theme } from "../../lib/theme";

interface Message {
  id: string;
  role: "user" | "tutor";
  text: string;
}

const GREETING: Message = {
  id: "greeting",
  role: "tutor",
  text: "Hi! I'm your ASL tutor. Ask me about any sign, handshape, grammar, or Deaf culture. 🤟",
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  function scrollToEnd() {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }

  async function onSend() {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", text };
    const tutorId = `t-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: tutorId, role: "tutor", text: "" },
    ]);
    setInput("");
    setSending(true);
    scrollToEnd();

    try {
      await streamChat(text, (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tutorId ? { ...m, text: m.text + chunk } : m
          )
        );
        scrollToEnd();
      });
    } catch (e: any) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tutorId
            ? {
                ...m,
                text:
                  m.text ||
                  `⚠️ Couldn't reach the tutor: ${e?.message ?? e}. Is the backend and Ollama running?`,
              }
            : m
        )
      );
    } finally {
      setSending(false);
      scrollToEnd();
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        onContentSizeChange={scrollToEnd}
        renderItem={({ item }) => {
          const isUser = item.role === "user";
          return (
            <View
              style={[
                styles.bubble,
                isUser ? styles.userBubble : styles.tutorBubble,
              ]}
            >
              <Text style={[styles.bubbleText, isUser && styles.userText]}>
                {item.text || "…"}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about a sign…"
          placeholderTextColor={theme.colors.muted}
          multiline
          editable={!sending}
          onSubmitEditing={onSend}
        />
        <Pressable
          onPress={onSend}
          disabled={sending || !input.trim()}
          style={[
            styles.sendBtn,
            (sending || !input.trim()) && styles.sendBtnDisabled,
          ]}
        >
          {sending ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.sendText}>Send</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  list: { padding: theme.spacing(2), gap: theme.spacing(1.25) },
  bubble: {
    maxWidth: "85%",
    padding: theme.spacing(1.5),
    borderRadius: theme.radius,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  tutorBubble: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { color: theme.colors.text, lineHeight: 21 },
  userText: { color: "#fff" },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    padding: theme.spacing(1.5),
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
  },
  sendBtn: {
    paddingHorizontal: 18,
    height: 44,
    borderRadius: theme.radius,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendText: { color: "#fff", fontWeight: "700" },
});
