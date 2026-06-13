type Block =
  | { kind: "heading"; level: 1 | 2 | 3 | 4 | 5 | 6; inline: Inline[] }
  | { kind: "paragraph"; inline: Inline[] }
  | { kind: "code"; lang?: string; value: string }
  | { kind: "quote"; blocks: Block[] }
  | { kind: "list"; ordered: boolean; items: ListItem[] }
  | { kind: "divider" }
  | { kind: "blank" };

type Inline =
  | { kind: "text"; value: string }
  | { kind: "bold"; children: Inline[] }
  | { kind: "italic"; children: Inline[] }
  | { kind: "strike"; children: Inline[] }
  | { kind: "code"; value: string }
  | { kind: "link"; href: string; children: Inline[] };

type ListItem = { blocks: Block[] };

export type MarkdownDoc = Block[];

export function looksLikeMarkdown(input: string): boolean {
  if (!input) return false;
  if (
    /<(p|div|span|br|h[1-6]|ul|ol|li|strong|em|a |img |table|code|pre|blockquote)\b/i.test(
      input,
    )
  ) {
    return false;
  }
  return /(^|\n)(#{1,6}\s|\s*[-*+]\s|\s*\d+\.\s|>\s|```|`[^`]+`|---)/.test(
    input,
  );
}

export function parseMarkdown(input: string): MarkdownDoc {
  const lines = input.replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    // fenced code
    const fence = /^(\s{0,3})```(.*)$/.exec(line);
    if (fence) {
      const lang = fence[2].trim() || undefined;
      const buf: string[] = [];
      i += 1;
      while (i < lines.length && !/^\s{0,3}```\s*$/.test(lines[i])) {
        buf.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1; // closing ```
      blocks.push({ kind: "code", lang, value: buf.join("\n") });
      continue;
    }

    // divider
    if (/^\s{0,3}([-*_])\s*\1\s*\1[\s\x01]*$/.test(line)) {
      blocks.push({ kind: "divider" });
      i += 1;
      continue;
    }

    // heading
    const heading = /^(#{1,6})\s+(.*)$/.exec(line.trimStart());
    if (heading) {
      const level = heading[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      blocks.push({
        kind: "heading",
        level,
        inline: parseInline(heading[2]),
      });
      i += 1;
      continue;
    }

    // blockquote (collect contiguous)
    if (/^\s{0,3}>/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s{0,3}>/.test(lines[i])) {
        buf.push(lines[i].replace(/^\s{0,3}>\s?/, ""));
        i += 1;
      }
      blocks.push({ kind: "quote", blocks: parseMarkdown(buf.join("\n")) });
      continue;
    }

    // list (unordered or ordered)
    if (/^\s{0,3}[-*+]\s+/.test(line) || /^\s{0,3}\d+\.\s+/.test(line)) {
      const ordered = /^\s{0,3}\d+\.\s+/.test(line);
      const items: ListItem[] = [];
      while (
        i < lines.length &&
        ((ordered && /^\s{0,3}\d+\.\s+/.test(lines[i])) ||
          (!ordered && /^\s{0,3}[-*+]\s+/.test(lines[i])))
      ) {
        const firstLine = lines[i].replace(
          ordered ? /^\s{0,3}\d+\.\s+/ : /^\s{0,3}[-*+]\s+/,
          "",
        );
        const buf: string[] = [firstLine];
        i += 1;
        // continuation lines indented under the list item
        while (
          i < lines.length &&
          lines[i].trim() !== "" &&
          /^\s{2,}/.test(lines[i]) &&
          !/^\s{0,3}[-*+]\s+/.test(lines[i]) &&
          !/^\s{0,3}\d+\.\s+/.test(lines[i])
        ) {
          buf.push(lines[i].replace(/^\s{2}/, ""));
          i += 1;
        }
        items.push({ blocks: parseMarkdown(buf.join("\n")) });
        // skip blank lines between items but stop on double blank
        while (i < lines.length && lines[i].trim() === "") {
          if (i + 1 < lines.length && lines[i + 1].trim() === "") break;
          i += 1;
        }
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }

    // paragraph (collect contiguous non-blank, non-special lines)
    const buf: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6})\s+/.test(lines[i].trimStart()) &&
      !/^\s{0,3}```/.test(lines[i]) &&
      !/^\s{0,3}>/.test(lines[i]) &&
      !/^\s{0,3}[-*+]\s+/.test(lines[i]) &&
      !/^\s{0,3}\d+\.\s+/.test(lines[i]) &&
      !/^\s{0,3}([-*_])\s*\1\s*\1[\s\x01]*$/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i += 1;
    }
    blocks.push({ kind: "paragraph", inline: parseInline(buf.join("\n")) });
  }

  return blocks;
}

function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let i = 0;
  let buf = "";

  const flush = () => {
    if (buf) {
      out.push({ kind: "text", value: buf });
      buf = "";
    }
  };

  while (i < text.length) {
    const ch = text[i];

    // inline code
    if (ch === "`") {
      const end = text.indexOf("`", i + 1);
      if (end > i) {
        flush();
        out.push({ kind: "code", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    // link [text](url)
    if (ch === "[") {
      const close = text.indexOf("]", i + 1);
      if (close > i && text[close + 1] === "(") {
        const urlEnd = text.indexOf(")", close + 2);
        if (urlEnd > close) {
          const label = text.slice(i + 1, close);
          const href = text.slice(close + 2, urlEnd).trim();
          flush();
          out.push({
            kind: "link",
            href,
            children: parseInline(label),
          });
          i = urlEnd + 1;
          continue;
        }
      }
    }

    // bold **text** or __text__
    if (
      (ch === "*" && text[i + 1] === "*") ||
      (ch === "_" && text[i + 1] === "_")
    ) {
      const marker = ch + ch;
      const end = text.indexOf(marker, i + 2);
      if (end > i + 1) {
        flush();
        out.push({
          kind: "bold",
          children: parseInline(text.slice(i + 2, end)),
        });
        i = end + 2;
        continue;
      }
    }

    // italic *text* or _text_
    if (ch === "*" || ch === "_") {
      const end = text.indexOf(ch, i + 1);
      if (end > i && !/\s/.test(text[i + 1] ?? "")) {
        flush();
        out.push({
          kind: "italic",
          children: parseInline(text.slice(i + 1, end)),
        });
        i = end + 1;
        continue;
      }
    }

    // strike ~~text~~
    if (ch === "~" && text[i + 1] === "~") {
      const end = text.indexOf("~~", i + 2);
      if (end > i + 1) {
        flush();
        out.push({
          kind: "strike",
          children: parseInline(text.slice(i + 2, end)),
        });
        i = end + 2;
        continue;
      }
    }

    buf += ch;
    i += 1;
  }

  flush();
  return out;
}
