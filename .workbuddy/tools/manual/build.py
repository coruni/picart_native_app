# -*- coding: utf-8 -*-
"""两遍生成：先排版量页码，再回填目录页码。"""
import json
import os
import re
import subprocess
import sys

import pypdfium2 as pdfium

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import content  # noqa: E402
import render  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
TMP_DOCX = os.path.join(HERE, "_pass1.docx")
TMP_PDF = os.path.join(HERE, "_pass1.pdf")
FINAL_DOCX = render.OUT


def heading_entries():
    out = []
    for blk in content.BLOCKS:
        if blk[0] == "h1":
            out.append((1, blk[1]))
        elif blk[0] == "h2":
            out.append((2, blk[1]))
    return out


def build(path, pages):
    render.TOC_PAGES.clear()
    render.TOC_PAGES.update(pages)
    b = render.Builder()
    b.cover()
    b.toc(heading_entries())
    b.body(content.BLOCKS)
    b.save(path)


def export_pdf(docx_path, pdf_path):
    # 每次导前先清掉上次残留的 Word 实例，否则它会一直占着 docx，下次保存直接报权限错误
    subprocess.run(["powershell", "-NoProfile", "-Command",
                    "Get-Process WINWORD -ErrorAction SilentlyContinue | "
                    "Where-Object { $_.MainWindowTitle -like '*元系交互*' } | Stop-Process -Force"],
                   capture_output=True, text=True)
    ps = f'''
$ErrorActionPreference = "Stop"
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$word.AutomationSecurity = 1
$d = $null
try {{
  $d = $word.Documents.Open("{docx_path}", $false, $true)
  Write-Output ("PAGES=" + $d.ComputeStatistics(2))
  $d.ExportAsFixedFormat("{pdf_path}", 17, $false, 0, 0, 0, 0, 0, $true)
  Write-Output "EXPORT=OK"
}} finally {{
  if ($d -ne $null) {{ $d.Close($false) }}
  $word.Quit()
  [System.Runtime.Interopservices.Marshal]::ReleaseComObject($word) | Out-Null
}}
'''
    r = subprocess.run(["powershell", "-NoProfile", "-Command", ps],
                       capture_output=True, text=True)
    out = (r.stdout or "").strip()
    err = (r.stderr or "").strip()
    if out:
        print(out)
    if err:
        print("导出告警:", err)
    m = re.search(r"PAGES=(\d+)", r.stdout or "")
    return int(m.group(1)) if m else None


def page_texts(pdf_path):
    pdf = pdfium.PdfDocument(pdf_path)
    try:
        texts = []
        for i in range(len(pdf)):
            tp = pdf[i].get_textpage()
            texts.append(re.sub(r"\s+", "", tp.get_text_range(0, tp.count_chars())))
        return texts
    finally:
        pdf.close()


def body_marker():
    """取第一个 h1 之后那段正文的开头，用它定位正文首页——目录页里不会有这段话。"""
    for i, blk in enumerate(content.BLOCKS):
        if blk[0] != "h1":
            continue
        for nxt in content.BLOCKS[i + 1:]:
            if nxt[0] == "p":
                return re.sub(r"\s+", "", nxt[1])[:14]
            if nxt[0] == "note":
                return re.sub(r"\s+", "", nxt[1])[:14]
        break
    raise RuntimeError("正文首段没找到")


def measure(pdf_path, entries):
    texts = page_texts(pdf_path)
    marker = body_marker()
    first_body = None
    for i, t in enumerate(texts):
        if marker in t:
            first_body = i
            break
    if first_body is None:
        raise RuntimeError("找不到正文起始页")
    pages = {}
    for _, text in entries:
        key = re.sub(r"\s+", "", text)
        for i in range(first_body, len(texts)):
            if key in texts[i]:
                pages[text] = i - first_body + 1
                break
    return pages, first_body


def main():
    entries = heading_entries()
    print("build pass 1 ...")
    build(TMP_DOCX, {})
    total = export_pdf(TMP_DOCX, TMP_PDF)
    print("pass1 pages:", total)

    pages, first_body = measure(TMP_PDF, entries)
    print("正文起始 PDF 页序号:", first_body, "（封面 + 目录共", first_body, "页）")
    missing = [t for _, t in entries if t not in pages]
    if missing:
        print("未定位到页码的标题:", missing)

    print("build pass 2 ...")
    build(FINAL_DOCX, pages)
    total2 = export_pdf(FINAL_DOCX, TMP_PDF)
    print("最终页数:", total2)
    pages2, fb2 = measure(TMP_PDF, entries)
    diff = {k: (pages[k], pages2.get(k)) for k in pages if pages2.get(k) != pages[k]}
    print("回填后页码变动:", diff if diff else "无")
    with open(os.path.join(HERE, "toc_pages.json"), "w", encoding="utf-8") as f:
        json.dump(pages2, f, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
