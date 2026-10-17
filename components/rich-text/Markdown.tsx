import ThemedText from "@/components/ui/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useCallback } from "react";
import { Linking, StyleSheet, View } from "react-native";
import {
  parseMarkdown,
  type Inline,
  type MarkdownDoc,
} from "@/lib/markdown";

interface MarkdownProps {
  source: string;
}

export function Markdown({ source }: MarkdownProps) {
  const { theme } = useTheme();
  const doc = parseMarkdown(source);

  return (
    <View>
      {doc.map((block, idx) => (
        <BlockNode key={idx} block={block} theme={theme} />
      ))}
    </View>
  );
}

function BlockNode({
  block,
  theme,
}: {
  block: MarkdownDoc[number];
  theme: ReturnType<typeof useTheme>["theme"];
}) {
  switch (block.kind) {
    case "heading": {
      const sizes: Record<number, { size: number; line: number; weight: "600" | "700" | "800"; mb: number; mt: number }> = {
        1: { size: 26, line: 32, weight: "800", mb: 12, mt: 16 },
        2: { size: 22, line: 28, weight: "700", mb: 10, mt: 14 },
        3: { size: 19, line: 26, weight: "700", mb: 8, mt: 12 },
        4: { size: 17, line: 24, weight: "700", mb: 8, mt: 10 },
        5: { size: 16, line: 22, weight: "700", mb: 6, mt: 8 },
        6: { size: 15, line: 20, weight: "700", mb: 6, mt: 8 },
      };
      const s = sizes[block.level] ?? sizes[3];
      return (
        <View style={{ marginTop: s.mt, marginBottom: s.mb }}>
          <InlineNodes
            nodes={block.inline}
            theme={theme}
            size={s.size}
            lineHeight={s.line}
            fontWeight={s.weight}
          />
        </View>
      );
    }
    case "paragraph":
      return (
        <View style={styles.paragraph}>
          <InlineNodes
            nodes={block.inline}
            theme={theme}
            size={15}
            lineHeight={24}
          />
        </View>
      );
    case "code":
      return (
        <View
          style={[
            styles.codeBlock,
            {
              backgroundColor: theme.secondaryBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <ThemedText
            size={13}
            lineHeight={20}
            color={theme.foreground}
            style={styles.codeText}
          >
            {block.value}
          </ThemedText>
        </View>
      );
    case "quote":
      return (
        <View
          style={[
            styles.quote,
            { borderLeftColor: theme.border },
          ]}
        >
          {block.blocks.map((b, idx) => (
            <BlockNode key={idx} block={b} theme={theme} />
          ))}
        </View>
      );
    case "list":
      return (
        <View style={styles.list}>
          {block.items.map((item, idx) => (
            <View key={idx} style={styles.listItem}>
              <ThemedText
                size={15}
                lineHeight={24}
                color={theme.foreground}
                style={styles.listMarker}
              >
                {block.ordered ? `${idx + 1}.` : "•"}
              </ThemedText>
              <View style={styles.listItemBody}>
                {item.blocks.map((b, bIdx) => (
                  <BlockNode key={bIdx} block={b} theme={theme} />
                ))}
              </View>
            </View>
          ))}
        </View>
      );
    case "divider":
      return (
        <View
          style={[
            styles.divider,
            { backgroundColor: theme.border },
          ]}
        />
      );
    case "blank":
      return null;
  }
}

function InlineNodes({
  nodes,
  theme,
  size,
  lineHeight,
  fontWeight,
}: {
  nodes: Inline[];
  theme: ReturnType<typeof useTheme>["theme"];
  size: number;
  lineHeight: number;
  fontWeight?: "400" | "500" | "600" | "700" | "800";
}) {
  return (
    <ThemedText
      size={size}
      lineHeight={lineHeight}
      color={theme.foreground}
      fontWeight={fontWeight}
    >
      {nodes.map((node, idx) => (
        <InlineNode key={idx} node={node} theme={theme} size={size} />
      ))}
    </ThemedText>
  );
}

function InlineNode({
  node,
  theme,
  size,
}: {
  node: Inline;
  theme: ReturnType<typeof useTheme>["theme"];
  size: number;
}) {
  switch (node.kind) {
    case "text":
      return <>{node.value}</>;
    case "bold":
      return (
        <ThemedText
          size={size}
          color={theme.foreground}
          fontWeight="700"
        >
          {node.children.map((c: Inline, i: number) => (
            <InlineNode key={i} node={c} theme={theme} size={size} />
          ))}
        </ThemedText>
      );
    case "italic":
      return (
        <ThemedText
          size={size}
          color={theme.foreground}
          style={{ fontStyle: "italic" }}
        >
          {node.children.map((c: Inline, i: number) => (
            <InlineNode key={i} node={c} theme={theme} size={size} />
          ))}
        </ThemedText>
      );
    case "strike":
      return (
        <ThemedText
          size={size}
          color={theme.foreground}
          style={{ textDecorationLine: "line-through" }}
        >
          {node.children.map((c: Inline, i: number) => (
            <InlineNode key={i} node={c} theme={theme} size={size} />
          ))}
        </ThemedText>
      );
    case "code":
      return (
        <ThemedText
          size={Math.max(size - 1, 12)}
          color={theme.foreground}
          style={[
            styles.inlineCode,
            {
              backgroundColor: theme.secondaryBackground,
              borderColor: theme.border,
            },
          ]}
        >
          {node.value}
        </ThemedText>
      );
    case "link":
      return <LinkNode node={node} theme={theme} size={size} />;
  }
}

function LinkNode({
  node,
  theme,
  size,
}: {
  node: Extract<Inline, { kind: "link" }>;
  theme: ReturnType<typeof useTheme>["theme"];
  size: number;
}) {
  const handlePress = useCallback(() => {
    if (!node.href) return;
    Linking.openURL(node.href).catch(() => undefined);
  }, [node.href]);

  return (
    <ThemedText
      size={size}
      color={theme.primary}
      onPress={handlePress}
      style={styles.link}
    >
      {node.children.map((c: Inline, i: number) => (
        <InlineNode key={i} node={c} theme={theme} size={size} />
      ))}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 12,
  },
  codeBlock: {
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    marginVertical: 8,
  },
  codeText: {
    fontFamily: "Menlo",
  },
  quote: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginVertical: 8,
    opacity: 0.9,
  },
  list: {
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  listMarker: {
    width: 24,
    marginRight: 4,
  },
  listItemBody: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },
  inlineCode: {
    fontFamily: "Menlo",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  link: {
    textDecorationLine: "underline",
  },
});
