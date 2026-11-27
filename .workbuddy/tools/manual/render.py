# -*- coding: utf-8 -*-
"""渲染《元系交互》软件使用手册：封面 + 目录 + 正文。"""
import os
import sys

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK, WD_TAB_ALIGNMENT
from docx.enum.text import WD_TAB_LEADER
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(r"E:\project\picart_native_app", "docs", "元系交互软件使用手册.docx")

APP_NAME = "元系交互"
VERSION = "V1.0.0"
HEI = "黑体"
SONG = "宋体"
BODY_SIZE = 12
LINE_MULT = 1.5

REPLACE_IMG = {}
TOC_PAGES = {}  # 标题 -> 页码，第二遍回填


def set_font(run, size=BODY_SIZE, cn=SONG, ascii_font=SONG, bold=False, color=None):
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
    if color:
        run.font.color.rgb = RGBColor(*color)


def page_break_before(paragraph):
    paragraph.paragraph_format.page_break_before = True


def add_field(run, code):
    fld_begin = OxmlElement("w:fldChar")
    fld_begin.set(qn("w:fldCharType"), "begin")
    instr = OxmlElement("w:instrText")
    instr.set(qn("xml:space"), "preserve")
    instr.text = code
    fld_sep = OxmlElement("w:fldChar")
    fld_sep.set(qn("w:fldCharType"), "separate")
    txt = OxmlElement("w:t")
    txt.text = "1"
    fld_end = OxmlElement("w:fldChar")
    fld_end.set(qn("w:fldCharType"), "end")
    for el in (fld_begin, instr, fld_sep, txt, fld_end):
        run._element.append(el)


def setup_section(section, numbered=True, fmt="decimal", start=None, header_text=None):
    section.page_width = Cm(21)
    section.page_height = Cm(29.7)
    section.top_margin = Cm(2.54)
    section.bottom_margin = Cm(2.54)
    section.left_margin = Cm(2.54)
    section.right_margin = Cm(2.54)
    section.header_distance = Cm(1.5)
    section.footer_distance = Cm(1.5)

    # 新分节会复制上一节的 sectPr，旧页码设置要先清掉，否则沿用作废的编号格式
    for old in section._sectPr.findall(qn("w:pgNumType")):
        section._sectPr.remove(old)

    section.header.is_linked_to_previous = False
    hp = section.header.paragraphs[0]
    hp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    text = f"{APP_NAME}软件使用手册　{VERSION}" if header_text is None else header_text
    if text:
        hr = hp.add_run(text)
        set_font(hr, 9)
        pPr = hp._element.get_or_add_pPr()
        pBdr = OxmlElement("w:pBdr")
        bottom = OxmlElement("w:bottom")
        bottom.set(qn("w:val"), "single")
        bottom.set(qn("w:sz"), "6")
        bottom.set(qn("w:space"), "1")
        bottom.set(qn("w:color"), "808080")
        pBdr.append(bottom)
        pPr.append(pBdr)

    section.footer.is_linked_to_previous = False
    fp = section.footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    if numbered:
        fr = fp.add_run()
        set_font(fr, 9)
        add_field(fr, " PAGE ")
    if fmt != "decimal" or start is not None:
        pgNumType = OxmlElement("w:pgNumType")
        if start is not None:
            pgNumType.set(qn("w:start"), str(start))
        if fmt != "decimal":
            pgNumType.set(qn("w:fmt"), fmt)
        # 按 schema 顺序插到 w:cols 之前，追加到末尾会被 Word 忽略
        cols = section._sectPr.find(qn("w:cols"))
        if cols is not None:
            cols.addprevious(pgNumType)
        else:
            section._sectPr.append(pgNumType)


def three_line_table(doc, headers, rows, widths=None):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = True
    tbl = table._tbl
    tblPr = tbl.tblPr

    borders = OxmlElement("w:tblBorders")
    for edge, sz in (("top", "12"), ("bottom", "12"), ("left", "0"), ("right", "0"),
                     ("insideH", "0"), ("insideV", "0")):
        el = OxmlElement(f"w:{edge}")
        el.set(qn("w:val"), "single" if sz != "0" else "none")
        el.set(qn("w:sz"), sz)
        el.set(qn("w:color"), "000000")
        borders.append(el)
    tblPr.append(borders)

    hdr = table.rows[0]
    # 跨页时重复表头，否则续页上只剩没有列名的数据行
    trPr = hdr._tr.get_or_add_trPr()
    tblHeader = OxmlElement("w:tblHeader")
    tblHeader.set(qn("w:val"), "true")
    trPr.append(tblHeader)
    for i, h in enumerate(headers):
        cell = hdr.cells[i]
        cell.text = ""
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(h)
        set_font(r, 10.5, bold=True)
        # 表头下横线
        tcPr = cell._tc.get_or_add_tcPr()
        tcBorders = OxmlElement("w:tcBorders")
        b = OxmlElement("w:bottom")
        b.set(qn("w:val"), "single")
        b.set(qn("w:sz"), "8")
        b.set(qn("w:color"), "000000")
        tcBorders.append(b)
        tcPr.append(tcBorders)

    for row in rows:
        cells = table.add_row().cells
        for i, val in enumerate(row):
            cells[i].text = ""
            p = cells[i].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.line_spacing = 1.15
            r = p.add_run(val)
            set_font(r, 10.5)
    # 列宽必须钉死，否则 Word 会按内容重算，长文本列被压窄、短列被撑宽
    if widths:
        table.autofit = False
        tblLayout = OxmlElement("w:tblLayout")
        tblLayout.set(qn("w:type"), "fixed")
        tblPr.append(tblLayout)
        for i, w in enumerate(widths):
            table.columns[i].width = Cm(w)
        for row in table.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Cm(w)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    return table


class Builder:
    def __init__(self):
        self.doc = Document()
        normal = self.doc.styles["Normal"]
        normal.font.name = SONG
        normal.font.size = Pt(BODY_SIZE)
        normal.element.rPr.rFonts.set(qn("w:eastAsia"), SONG)
        self.toc_entries = []  # (level, text)

    # ---------- 封面 ----------
    def cover(self):
        sec = self.doc.sections[0]
        setup_section(sec, numbered=False, header_text="")

        for _ in range(2):
            self.doc.add_paragraph()

        p = self.doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(f"《{APP_NAME}》")
        set_font(r, 26, cn=SONG, bold=True)

        p = self.doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run("软件使用手册")
        set_font(r, 26, cn=SONG, bold=True)

        for _ in range(3):
            self.doc.add_paragraph()

        # 一条细横线
        p = self.doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        pPr = p._element.get_or_add_pPr()
        pBdr = OxmlElement("w:pBdr")
        bottom = OxmlElement("w:bottom")
        bottom.set(qn("w:val"), "single")
        bottom.set(qn("w:sz"), "8")
        bottom.set(qn("w:space"), "1")
        bottom.set(qn("w:color"), "000000")
        pBdr.append(bottom)
        pPr.append(pBdr)
        p.paragraph_format.left_indent = Cm(5.2)
        p.paragraph_format.right_indent = Cm(5.2)

        for _ in range(13):
            self.doc.add_paragraph()

        for text in (f"版本号：{VERSION}", "二〇二六年十一月"):
            p = self.doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r = p.add_run(text)
            set_font(r, 14)

    # ---------- 目录 ----------
    def toc(self, entries):
        sec = self.doc.add_section(WD_SECTION.NEW_PAGE)
        setup_section(sec, numbered=True, fmt="lowerRoman", start=1)

        p = self.doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run("目　　录")
        set_font(r, 18, cn=HEI, bold=True)
        p.paragraph_format.space_after = Pt(18)

        for level, text in entries:
            p = self.doc.add_paragraph()
            pf = p.paragraph_format
            pf.space_before = Pt(0)
            pf.space_after = Pt(3)
            pf.line_spacing = 1.4
            pf.left_indent = Cm(0 if level == 1 else 0.9)
            pf.tab_stops.add_tab_stop(Cm(15.6), WD_TAB_ALIGNMENT.RIGHT, WD_TAB_LEADER.DOTS)
            r = p.add_run(text)
            set_font(r, 12 if level == 1 else 11, bold=(level == 1))
            page = TOC_PAGES.get(text, "")
            r2 = p.add_run("\t" + str(page))
            set_font(r2, 12 if level == 1 else 11, bold=(level == 1))

    # ---------- 正文 ----------
    def body(self, blocks):
        sec = self.doc.add_section(WD_SECTION.NEW_PAGE)
        setup_section(sec, numbered=True, start=1)

        first_h1 = True
        for blk in blocks:
            kind = blk[0]
            if kind == "h1":
                self.toc_entries.append((1, blk[1]))
                p = self.doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_before = Pt(6)
                p.paragraph_format.space_after = Pt(14)
                p.paragraph_format.line_spacing = 1.3
                if not first_h1:
                    page_break_before(p)
                first_h1 = False
                r = p.add_run(blk[1])
                set_font(r, 16, cn=HEI, bold=True)
            elif kind == "h2":
                self.toc_entries.append((2, blk[1]))
                p = self.doc.add_paragraph()
                p.paragraph_format.space_before = Pt(14)
                p.paragraph_format.space_after = Pt(8)
                p.paragraph_format.line_spacing = 1.3
                p.paragraph_format.keep_with_next = True
                r = p.add_run(blk[1])
                set_font(r, 14, cn=HEI, bold=True)
            elif kind == "h3":
                p = self.doc.add_paragraph()
                p.paragraph_format.space_before = Pt(8)
                p.paragraph_format.space_after = Pt(4)
                p.paragraph_format.keep_with_next = True
                r = p.add_run(blk[1])
                set_font(r, 12, cn=HEI, bold=True)
            elif kind == "p":
                p = self.doc.add_paragraph()
                p.paragraph_format.first_line_indent = Pt(BODY_SIZE * 2)
                p.paragraph_format.line_spacing = LINE_MULT
                r = p.add_run(blk[1])
                set_font(r, BODY_SIZE)
            elif kind == "steps":
                for i, text in enumerate(blk[1], 1):
                    p = self.doc.add_paragraph()
                    pf = p.paragraph_format
                    pf.left_indent = Cm(0.74)
                    pf.first_line_indent = Cm(-0.5)
                    pf.line_spacing = LINE_MULT
                    pf.space_after = Pt(2)
                    r = p.add_run(f"（{i}）{text}")
                    set_font(r, BODY_SIZE)
            elif kind == "bullets":
                for text in blk[1]:
                    p = self.doc.add_paragraph()
                    pf = p.paragraph_format
                    pf.left_indent = Cm(0.74)
                    pf.first_line_indent = Cm(-0.5)
                    pf.line_spacing = LINE_MULT
                    pf.space_after = Pt(2)
                    r = p.add_run(f"· {text}")
                    set_font(r, BODY_SIZE)
            elif kind == "note":
                p = self.doc.add_paragraph()
                pf = p.paragraph_format
                pf.left_indent = Cm(0.6)
                pf.right_indent = Cm(0.4)
                pf.line_spacing = LINE_MULT
                pf.space_before = Pt(4)
                pf.space_after = Pt(8)
                head, _, rest = blk[1].partition("：")
                r = p.add_run(head + "：")
                set_font(r, 11, bold=True)
                r2 = p.add_run(rest)
                set_font(r2, 11)
            elif kind == "table":
                three_line_table(self.doc, blk[1], blk[2], blk[3] if len(blk) > 3 else None)
            elif kind == "img":
                path, caption, width = blk[1], blk[2], blk[3]
                p = self.doc.add_paragraph()
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                p.paragraph_format.space_before = Pt(6)
                p.paragraph_format.space_after = Pt(4)
                p.paragraph_format.keep_with_next = True
                p.add_run().add_picture(os.path.join(HERE, path), width=Cm(width))
                cap = self.doc.add_paragraph()
                cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                cap.paragraph_format.space_after = Pt(12)
                r = cap.add_run(caption)
                set_font(r, 10.5)

    def save(self, path):
        cp = self.doc.core_properties
        cp.title = f"《{APP_NAME}》软件使用手册"
        cp.subject = "计算机软件著作权登记 文档鉴别材料"
        cp.author = APP_NAME
        self.doc.save(path)
