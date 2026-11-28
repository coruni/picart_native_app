#!/usr/bin/env python3
"""后端 message key → 语言包。只取 en / zh-CN 两列，繁日韩丢掉。

用法：
    python scripts/gen-api-i18n.py                       # 读 docs/i18n-source.md
    python scripts/gen-api-i18n.py path/to/表.md          # 读新给的表

后端改文案后重跑本脚本即可，产物 locales/api/{en,zh}.json 不要手改。
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SRC = ROOT / "docs" / "i18n-source.md"

# | `key` | en | zh-CN | zh-TW | ja | ko |
ROW = re.compile(r"^\|\s*`([^`]+)`\s*\|(.*)\|\s*$")


def parse_row(line: str):
    matched = ROW.match(line.strip())
    if not matched:
        return None
    cells = [cell.strip() for cell in matched.group(2).split("|")]
    if len(cells) < 5:
        return None
    return matched.group(1).strip(), cells[0], cells[1]


def nest(flat: dict) -> dict:
    tree: dict = {}
    for key, value in flat.items():
        parts = key.split(".")
        node = tree
        for part in parts[:-1]:
            # 同名前缀既是叶子又是父节点时，叶子让路给子树
            if not isinstance(node.get(part), dict):
                node[part] = {}
            node = node[part]
        node[parts[-1]] = value
    return tree


def main() -> int:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SRC
    if not src.exists():
        print(f"找不到对照表：{src}", file=sys.stderr)
        return 1

    en: dict = {}
    zh: dict = {}
    for line in src.read_text(encoding="utf-8").splitlines():
        row = parse_row(line)
        if not row:
            continue
        key, en_text, zh_text = row
        en[key] = en_text
        zh[key] = zh_text

    if not en:
        print("没解析到任何 key，检查表头格式", file=sys.stderr)
        return 1

    out_dir = ROOT / "locales" / "api"
    out_dir.mkdir(parents=True, exist_ok=True)
    for lang, flat in (("en", en), ("zh", zh)):
        path = out_dir / f"{lang}.json"
        path.write_text(
            json.dumps(nest(flat), ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"{path.relative_to(ROOT)}: {len(flat)} keys")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
