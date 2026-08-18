import { useThemeColor } from "heroui-native";
import Markdown from "react-native-markdown-display";

type ChatMarkdownProps = {
  content: string;
};

/** Renders an assistant reply as markdown (bold, bullet/numbered lists,
 * headings) instead of showing raw "**Monday:**" asterisks as plain text —
 * colored to match the assistant bubble's text token in both themes. */
export function ChatMarkdown({ content }: ChatMarkdownProps) {
  const textColor = useThemeColor("surface-foreground");

  return (
    <Markdown
      style={{
        body: { color: textColor },
        paragraph: { marginTop: 0, marginBottom: 8 },
        heading1: { color: textColor, fontSize: 18, fontWeight: "800" },
        heading2: { color: textColor, fontSize: 16, fontWeight: "800" },
        heading3: { color: textColor, fontSize: 15, fontWeight: "700" },
        strong: { color: textColor, fontWeight: "800" },
        bullet_list: { marginVertical: 2 },
        ordered_list: { marginVertical: 2 },
        bullet_list_icon: { color: textColor },
        code_inline: {
          color: textColor,
          backgroundColor: "transparent",
          fontWeight: "600",
        },
      }}
    >
      {content}
    </Markdown>
  );
}
