# -*- coding: utf-8 -*-
"""生成软著程序鉴别材料：封面竖排 + 60 页源码（每页 50 行）。"""
import os
import re
from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt
from docx.enum.text import WD_BREAK

ROOT = r"E:\project\picart_native_app"
OUT = os.path.join(ROOT, "docs", "元系交互软件源程序.docx")

APP_NAME = "元系交互"
VERSION = "V1.0.0"
LINES_PER_PAGE = 50
PAGES = 60
COL = 96          # 每行可容纳的显示宽度（中文算 2）
FONT = "Consolas"
FONT_CN = "宋体"
CODE_SIZE = 9
LINE_PITCH = 14.0

# 源码顺序：入口 → 路由 → 组件 → 基础库 → 状态与常量
ORDER = [
    # 入口与页面
    "app/_layout.tsx",
    "app/(tabs)/_layout.tsx",
    "app/(tabs)/index.tsx",
    "app/(tabs)/circle/_layout.tsx",
    "app/(tabs)/circle/index.tsx",
    "app/(tabs)/messages/index.tsx",
    "app/(tabs)/publish-tab.tsx",
    "app/(tabs)/profile.tsx",
    "app/auth/index.tsx",
    "app/article/[id].tsx",
    "app/chat/[id].tsx",
    "app/comment/[id].tsx",
    "app/publish/index.tsx",
    "app/search/index.tsx",
    "app/user/[id].tsx",
    "app/topic/[id].tsx",
    "app/settings/index.tsx",
    "app/settings/decoration.tsx",
    "app/settings/widget.tsx",
    "app/settings/account-verify.tsx",
    "app/settings/push.tsx",
    # 常量、类型与基础工具
    "constants/theme.ts",
    "constants/editorTextStyles.ts",
    "types/article.ts",
    "types/openapi-null.ts",
    "utils/searchHistory.ts",
    # 状态管理
    "store/authStore.ts",
    "store/configStore.ts",
    "store/settingsStore.ts",
    # 自定义 hooks
    "hooks/useTheme.ts",
    "hooks/useTranslate.ts",
    "hooks/useSheetBackHandler.ts",
    "hooks/usePushNotifications.ts",
    "hooks/useReport.tsx",
    # 业务逻辑层
    "lib/time.ts",
    "lib/image.ts",
    "lib/authGate.ts",
    "lib/routeState.ts",
    "lib/chat-cache.ts",
    "lib/decoration.ts",
    "lib/richText.ts",
    "lib/inlineArticle.ts",
    "lib/keyboard-height.ts",
    "lib/push.ts",
    "lib/translate.ts",
    "lib/uploadImage.ts",
    "lib/editorHtml.ts",
    "lib/video.ts",
    # 界面组件
    "components/ui/index.ts",
    "components/ui/ThemedText.tsx",
    "components/ui/HugeIcon.tsx",
    "components/ui/Button.tsx",
    "components/ui/FloatInput.tsx",
    "components/ui/Switch.tsx",
    "components/ui/Avatar.tsx",
    "components/ui/Chip.tsx",
    "components/ui/Badge.tsx",
    "components/ui/AsyncImage.tsx",
    "components/settings/SettingsPrimitives.tsx",
    "components/feedback/FloatingActionMenu.tsx",
    "components/home/HomeBanner.tsx",
    "components/decoration/DecorationCard.tsx",
    "components/decoration/DecorationPreview.tsx",
    "components/decoration/DecorationDetailSheet.tsx",
    "components/article/ArticleCard.tsx",
    "components/article/ArticleHtmlWebView.tsx",
    "components/article/ArticleVideoPlayer.tsx",
    "components/article/ShareModal.tsx",
    "components/media/GestureImageViewer.tsx",
    "components/media/ImageCropperSheet.tsx",
    "components/comment/CommentItem.tsx",
    "components/comment/CommentComposerModal/EmojiPanel.tsx",
    "components/comment/CommentComposerModal/RichComposerInput.tsx",
    "components/comment/CommentComposerModal/CommentComposerModal.tsx",
    "components/profile/TopicsTab.tsx",
    "components/profile/CommentCard.tsx",
    "components/publish/useArticleRichText.ts",
    "components/publish/ArticleRichTextInput.tsx",
    "components/publish/InlinePostSheet.tsx",
    "components/publish/InputSheet.tsx",
    "components/publish/ArticleRichTextToolbar.tsx",
    "components/publish/VideoEditorSheet.tsx",
]


def disp_width(s):
    return sum(2 if ord(c) > 127 else 1 for c in s)


def wrap_line(s):
    """按显示宽度折行，返回 [(文本, 是否续行)]。"""
    s = s.replace("\t", "  ").rstrip("\n")
    if disp_width(s) <= COL:
        return [(s, False)]
    out, cur, w = [], "", 0
    for ch in s:
        cw = 2 if ord(ch) > 127 else 1
        if w + cw > COL:
            out.append(cur)
            cur, w = ch, cw
        else:
            cur += ch
            w += cw
    if cur:
        out.append(cur)
    return [(t, i > 0) for i, t in enumerate(out)]


def build_lines():
    files = []
    for rel in ORDER:
        path = os.path.join(ROOT, rel.replace("/", os.sep))
        if os.path.exists(path):
            files.append((rel, path))
    lines = []
    for rel, path in files:
        with open(path, encoding="utf-8", errors="replace") as f:
            raw = f.read().split("\n")
        lines.append((f"// {rel}", False))
        for r in raw:
            lines.extend(wrap_line(r))
    return lines


def set_cell_text_direction(cell, val="tbRl"):
    tcPr = cell._tc.get_or_add_tcPr()
    td = OxmlElement("w:textDirection")
    td.set(qn("w:val"), val)
    tcPr.append(td)


def clear_table_borders(table):
    tbl = table._tbl
    tblPr = tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "none")
        el.set(qn("w:sz"), "0")
        borders.append(el)
    tblPr.append(borders)


def add_spacing(run, twentieths):
    rPr = run._element.get_or_add_rPr()
    sp = OxmlElement("w:spacing")
    sp.set(qn("w:val"), str(twentieths))
    rPr.append(sp)


def style_run(run, size, cn=FONT_CN, ascii_font=FONT_CN, bold=False):
    run.font.size = Pt(size)
    run.font.bold = bold
    run.font.name = ascii_font
    rPr = run._element.get_or_add_rPr()
    rFonts = rPr.find(qn("w:rFonts"))
    if rFonts is None:
        rFonts = OxmlElement("w:rFonts")
        rPr.append(rFonts)
    rFonts.set(qn("w:ascii"), ascii_font)
    rFonts.set(qn("w:hAnsi"), ascii_font)
    rFonts.set(qn("w:eastAsia"), cn)


def add_page_number_footer(section):
    footer = section.footer
    footer.is_linked_to_previous = False
    p = footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run()
    style_run(run, 9)
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = " PAGE "
    fld_sep = OxmlElement("w:fldChar")
    fld_sep.set(qn("w:fldCharType"), "separate")
    txt = OxmlElement("w:t")
    txt.text = "1"
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    for el in (fld_begin, instr, fld_sep, txt, fld_end):
        run._element.append(el)


def add_header(section, text):
    header = section.header
    header.is_linked_to_previous = False
    p = header.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(text)
    style_run(run, 9)
    # 页眉下加一条细线
    pPr = p._element.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "6")
    bottom.set(qn("w:space"), "1")
    bottom.set(qn("w:color"), "000000")
    pBdr.append(bottom)
    pPr.append(pBdr)


def restart_page_numbering(section):
    sectPr = section._sectPr
    pgNumType = OxmlElement("w:pgNumType")
    pgNumType.set(qn("w:start"), "1")
    sectPr.append(pgNumType)


def paginate_start(lines, pages):
    """从头排 pages 页，每页 50 行，折行不被拆开。"""
    out, i = [], 0
    for _ in range(pages):
        page = lines[i : i + LINES_PER_PAGE]
        i += LINES_PER_PAGE
        while i < len(lines) and lines[i][1] and len(page) < LINES_PER_PAGE + 6:
            page.append(lines[i])
            i += 1
        out.extend(page)
    return out


def paginate_end(lines, pages):
    """从尾向前排 pages 页，页首不能是折行续行。"""
    pages_out = []
    j = len(lines)
    for _ in range(pages):
        start = max(0, j - LINES_PER_PAGE)
        while start > 0 and lines[start][1]:
            start -= 1
        if start < 0:
            start = 0
        pages_out.append(lines[start:j])
        j = start
    pages_out.reverse()
    return [x for page in pages_out for x in page]


def build():
    doc = Document()

    # 正文默认字体，避免空段落回落到 Calibri
    normal = doc.styles["Normal"]
    normal.font.name = FONT
    normal.font.size = Pt(CODE_SIZE)
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), FONT_CN)

    # ---------- 封面 ----------
    sec = doc.sections[0]
    sec.page_width = Cm(21)
    sec.page_height = Cm(29.7)
    sec.top_margin = Cm(2.2)
    sec.bottom_margin = Cm(2.0)
    sec.left_margin = Cm(2.2)
    sec.right_margin = Cm(2.0)
    sec.header_distance = Cm(1.2)
    sec.footer_distance = Cm(1.0)

    from docx.enum.table import WD_ALIGN_VERTICAL, WD_ROW_HEIGHT_RULE

    table = doc.add_table(rows=2, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    clear_table_borders(table)
    table.columns[0].width = Cm(16.6)

    title_cell = table.cell(0, 0)
    title_cell.width = Cm(16.6)
    title_cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    table.rows[0].height = Cm(21.6)
    table.rows[0].height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST

    tp = title_cell.paragraphs[0]
    tp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    fmt = tp.paragraph_format
    fmt.line_spacing = Pt(46)
    fmt.space_before = Pt(0)
    fmt.space_after = Pt(0)
    name = f"{APP_NAME}软件源程序"
    for i, ch in enumerate(name):
        r = tp.add_run(ch)
        style_run(r, 32, bold=True)
        if i != len(name) - 1:
            r.add_break()

    meta_cell = table.cell(1, 0)
    meta_cell.width = Cm(16.6)
    meta_cell.vertical_alignment = WD_ALIGN_VERTICAL.BOTTOM
    table.rows[1].height = Cm(3.8)
    table.rows[1].height_rule = WD_ROW_HEIGHT_RULE.AT_LEAST

    for idx, text in enumerate((f"版本号：{VERSION}", "二〇二六年十一月")):
        mp = meta_cell.paragraphs[0] if idx == 0 else meta_cell.add_paragraph()
        mp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        mf = mp.paragraph_format
        mf.line_spacing = Pt(22)
        mf.space_before = Pt(0)
        mf.space_after = Pt(0)
        mr = mp.add_run(text)
        style_run(mr, 12)

    # ---------- 源码 ----------
    sec2 = doc.add_section(WD_SECTION.NEW_PAGE)
    sec2.page_width = Cm(21)
    sec2.page_height = Cm(29.7)
    sec2.top_margin = Cm(2.2)
    sec2.bottom_margin = Cm(2.0)
    sec2.left_margin = Cm(2.2)
    sec2.right_margin = Cm(2.0)
    sec2.header_distance = Cm(1.2)
    sec2.footer_distance = Cm(1.0)
    add_header(sec2, f"{APP_NAME}软件源程序　{VERSION}")
    add_page_number_footer(sec2)
    restart_page_numbering(sec2)

    lines = build_lines()
    half = PAGES // 2
    body = paginate_start(lines, half) + paginate_end(lines, half)
    body = [t for t, _ in body]

    for i, line in enumerate(body):
        p = doc.add_paragraph()
        pf = p.paragraph_format
        pf.line_spacing = Pt(LINE_PITCH)
        pf.space_before = Pt(0)
        pf.space_after = Pt(0)
        pf.widow_control = False
        run = p.add_run(line if line else "")
        style_run(run, CODE_SIZE, cn=FONT_CN, ascii_font=FONT)
        if (i + 1) % LINES_PER_PAGE == 0 and i != len(body) - 1:
            run.add_break(WD_BREAK.PAGE)

    cp = doc.core_properties
    cp.title = f"{APP_NAME}软件源程序"
    cp.subject = "计算机软件著作权登记 程序鉴别材料"
    cp.author = APP_NAME
    cp.comments = ""
    doc.save(OUT)
    print("saved", OUT)
    print("总行数", len(lines), "本文件用", len(body), "行", int(len(body) / LINES_PER_PAGE), "页正文")


if __name__ == "__main__":
    build()
