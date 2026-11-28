#!/usr/bin/env python3
"""扫一遍 t() / i18n.t() 的字面量文案键，报出语言包里解析不到的。

写错命名空间的键不会报错，i18next 会把键名原样显示在界面上（比如消息页空态
显示 "message.noMessages"），所以单独跑这个脚本兜底。

    python scripts/check-i18n-keys.py
"""

import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKIP_DIRS = {"node_modules", ".expo", ".git", "android", "ios", "build", "dist"}

# t("a.b") / t('a.b') / i18n.t("a.b")
KEY_CALL = re.compile(r"""\b(?:i18n\s*\.\s*)?t\(\s*["']([A-Za-z0-9_.]+)["']""")


def load(lang: str) -> dict:
    common = json.loads((ROOT / "locales" / lang / "common.json").read_text("utf-8"))
    api_path = ROOT / "locales" / "api" / f"{lang}.json"
    if api_path.exists():
        common["api"] = json.loads(api_path.read_text("utf-8"))
    return common


def resolve(tree: dict, key: str):
    node = tree
    for part in key.split("."):
        if not isinstance(node, dict) or part not in node:
            return None
        node = node[part]
    return node


def source_files():
    for path in ROOT.rglob("*"):
        if path.suffix not in (".ts", ".tsx"):
            continue
        if any(part in SKIP_DIRS for part in path.parts) or "generated" in path.parts:
            continue
        yield path


BLOCK_COMMENT = re.compile(r"/\*.*?\*/", re.S)
LINE_COMMENT = re.compile(r"(?<!:)//[^\n]*")


def blank_out(text: str) -> str:
    """把注释内容换成空格，保留换行，这样报出来的行号还是对的。"""
    for pattern in (BLOCK_COMMENT, LINE_COMMENT):
        text = pattern.sub(lambda m: re.sub(r"[^\n]", " ", m.group(0)), text)
    return text


def main() -> int:
    zh, en = load("zh"), load("en")
    missing: dict[str, list[str]] = {}
    scanned = 0

    for path in source_files():
        try:
            text = blank_out(path.read_text("utf-8"))
        except (UnicodeDecodeError, OSError):
            continue
        for matched in KEY_CALL.finditer(text):
            scanned += 1
            key = matched.group(1)
            if resolve(zh, key) is not None and resolve(en, key) is not None:
                continue
            line = text[: matched.start()].count("\n") + 1
            missing.setdefault(key, []).append(
                f"{path.relative_to(ROOT)}:{line}"
            )

    for key in sorted(missing):
        print(f"{key}  <-  {', '.join(missing[key][:3])}")

    if missing:
        print(f"\n扫描 {scanned} 处调用，{len(missing)} 个键没解析到")
        return 1

    print(f"扫描 {scanned} 处调用，文案键全部解析正常")
    return 0


if __name__ == "__main__":
    sys.exit(main())
