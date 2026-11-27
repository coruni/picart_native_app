# -*- coding: utf-8 -*-
"""生成手册里的结构图与流程图。

画布宽度控制在 900：手册里图宽 15.6cm 时，17 号字约合 8pt，打印出来能看清。
"""
import math
import os

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "manual_assets")
S = 3  # 超采样，缩回后边缘更干净
W = 900  # 设计宽度

FONT = r"C:\Windows\Fonts\msyh.ttc"
FONT_B = r"C:\Windows\Fonts\msyhbd.ttc"

INK = (28, 30, 38)
INK2 = (98, 104, 118)
PRIMARY = (102, 128, 255)
PRIMARY_D = (58, 84, 200)
LILAC = (235, 239, 255)
LILAC2 = (248, 249, 255)
LINE = (203, 210, 232)
WHITE = (255, 255, 255)


def f(size, bold=False):
    return ImageFont.truetype(FONT_B if bold else FONT, size * S)


def tw(d, text, font):
    return d.textlength(text, font=font) / S


def canvas(h):
    im = Image.new("RGB", (W * S, h * S), WHITE)
    return im, ImageDraw.Draw(im)


def box(d, x, y, w, h, fill, outline=LINE, radius=8, width=1):
    d.rounded_rectangle([x * S, y * S, (x + w) * S, (y + h) * S],
                        radius=radius * S, fill=fill, outline=outline, width=width * S)


def label(d, text, x, y, size=17, bold=False, color=INK, anchor="la", max_w=None):
    font = f(size, bold)
    if max_w:
        while tw(d, text, font) > max_w and size > 10:
            size -= 1
            font = f(size, bold)
    d.text((x * S, y * S), text, font=font, fill=color, anchor=anchor)


def mid(d, text, cx, cy, size=17, bold=False, color=INK, max_w=None):
    label(d, text, cx, cy, size, bold, color, anchor="mm", max_w=max_w)


def arrow(d, points, color=PRIMARY, width=2, head=7):
    for i in range(len(points) - 1):
        (x1, y1), (x2, y2) = points[i], points[i + 1]
        d.line([x1 * S, y1 * S, x2 * S, y2 * S], fill=color, width=width * S)
    (x0, y0), (x1, y1) = points[-2], points[-1]
    ang = math.atan2(y1 - y0, x1 - x0)
    for delta in (2.7, -2.7):
        d.line([x1 * S, y1 * S,
                (x1 - head * math.cos(ang + delta)) * S,
                (y1 - head * math.sin(ang + delta)) * S],
               fill=color, width=width * S)


def save(im, name):
    im = im.resize((im.width // S, im.height // S), Image.LANCZOS)
    im.save(os.path.join(OUT, name), optimize=True)
    print("  ", name, im.size)


# ---------------- 图 1-1 功能模块划分 ----------------
def fig_modules():
    h = 380
    im, d = canvas(h)
    mods = [
        ("浏览与发现", "首页 · 关注 · 圈子 · 搜索"),
        ("阅读与互动", "正文 · 表态 · 评论 · 举报"),
        ("内容创作", "图片 · 文章 · 视频 · 话题"),
        ("消息中心", "通知 · 系统 · 私信"),
        ("个人中心", "主页 · 资料 · 收藏 · 装扮"),
        ("系统设置", "账号 · 推送 · 隐私 · 外观"),
    ]
    cw, ch, gx, gy = 250, 96, 25, 30
    x0, y0 = 50, 92

    mid(d, "元系交互　V1.0.0", W / 2, 40, 19, True, PRIMARY_D)

    for i, (name, sub) in enumerate(mods):
        r, c = divmod(i, 3)
        x = x0 + c * (cw + gx)
        y = y0 + r * (ch + gy)
        box(d, x, y, cw, ch, LILAC2, LINE)
        d.rounded_rectangle([x * S, y * S, (x + 3) * S, (y + ch) * S],
                            radius=2 * S, fill=PRIMARY)
        label(d, name, x + 18, y + 20, 18, True, INK)
        label(d, sub, x + 18, y + 54, 14, False, INK2, max_w=cw - 30)
    save(im, "fig-modules.png")


# ---------------- 图 1-2 软件总体结构 ----------------
def fig_arch():
    layers = [
        ("页面层", "app/", ["首页", "圈子", "搜索", "帖子详情", "发布", "消息"]),
        ("组件层", "components/", ["富文本工具栏", "视频编辑器", "评论面板", "底部弹层"]),
        ("状态层", "store/ hooks/", ["登录态", "内容缓存", "站点配置", "主题外观"]),
        ("能力层", "lib/", ["图片压缩上传", "视频抽帧", "内容翻译", "本地缓存"]),
        ("接口层", "api/", ["HTTP 客户端", "长连接通道", "文件上传"]),
    ]
    ch, gap, top = 78, 18, 26
    h = top + len(layers) * ch + (len(layers) - 1) * gap + 26
    im, d = canvas(h)
    lw, x0 = 190, 40
    for i, (title, path, items) in enumerate(layers):
        y = top + i * (ch + gap)
        box(d, x0, y, lw, ch, LILAC, PRIMARY, radius=8)
        mid(d, title, x0 + lw / 2, y + ch / 2 - 11, 18, True, PRIMARY_D)
        mid(d, path, x0 + lw / 2, y + ch / 2 + 15, 13, False, INK2)

        cx = x0 + lw + 24
        cw = W - cx - 40
        box(d, cx, y, cw, ch, LILAC2, LINE, radius=8)
        n = len(items)
        pad = 14
        iw = (cw - pad * 2 - (n - 1) * 10) / n
        for j, it in enumerate(items):
            x = cx + pad + j * (iw + 10)
            box(d, x, y + 16, iw, ch - 32, WHITE, LINE, radius=6)
            mid(d, it, x + iw / 2, y + ch / 2, 15, False, INK, max_w=iw - 10)
    save(im, "fig-arch.png")


# ---------------- 图 2-1 运行部署拓扑 ----------------
def fig_deploy():
    h = 470
    im, d = canvas(h)
    box(d, 30, 150, 180, 150, LILAC, PRIMARY, radius=8)
    mid(d, "移动客户端", 120, 194, 18, True, PRIMARY_D)
    mid(d, "Android / iOS", 120, 222, 13, False, INK2)
    mid(d, "界面 · 编辑 · 压缩", 120, 258, 13, False, INK2)

    box(d, 320, 120, 320, 210, LILAC2, PRIMARY, radius=8)
    mid(d, "站点接口服务", 480, 152, 18, True, PRIMARY_D)
    mid(d, "HTTPS / WebSocket", 480, 178, 13, False, INK2)
    for i, t in enumerate(["账号与鉴权", "内容读写", "评论与表态", "私信会话"]):
        mid(d, t, 480, 210 + i * 27, 14, False, INK)

    arrow(d, [(212, 225), (315, 225)], width=2)
    label(d, "接口调用", 264, 203, 13, False, INK2, anchor="mm")

    for title, y in [("数据库", 78), ("对象存储", 178), ("CDN 分发", 278)]:
        box(d, 700, y, 180, 62, WHITE, LINE, radius=8)
        mid(d, title, 790, y + 31, 16, True, INK)
        arrow(d, [(642, 225), (662, 225), (662, y + 31), (695, y + 31)],
              color=(160, 174, 216), head=6)

    for i, t in enumerate(["推送通道", "翻译服务", "邮件服务"]):
        x = 340 + i * 100
        box(d, x, 385, 92, 56, LILAC2, LINE, radius=8)
        mid(d, t, x + 46, 413, 14, False, INK, max_w=86)
        arrow(d, [(x + 46, 381), (x + 46, 334)], color=(160, 174, 216), head=6)
    label(d, "外部服务", 312, 408, 13, False, INK2, anchor="ra")
    save(im, "fig-deploy.png")


# ---------------- 图 3-1 编译打包流程 ----------------
def fig_build():
    h = 240
    im, d = canvas(h)
    steps = [("安装依赖", "npm install"), ("打包 JS", "Metro"), ("字节码", "Hermes"),
             ("原生编译", "Gradle / Xcode"), ("签名", "keystore"), ("产物", "APK / IPA")]
    n = len(steps)
    gap = 22
    bw = (W - 56 - gap * (n - 1)) / n
    for i, (t, sub) in enumerate(steps):
        x = 28 + i * (bw + gap)
        box(d, x, 66, bw, 108, LILAC2, LINE, radius=8)
        d.ellipse([(x + bw / 2 - 13) * S, 50 * S, (x + bw / 2 + 13) * S, 76 * S],
                  fill=PRIMARY if i < n - 1 else PRIMARY_D)
        mid(d, str(i + 1), x + bw / 2, 63, 13, True, WHITE)
        mid(d, t, x + bw / 2, 106, 16, True, PRIMARY_D, max_w=bw - 12)
        mid(d, sub, x + bw / 2, 138, 12, False, INK2, max_w=bw - 12)
        if i < n - 1:
            arrow(d, [(x + bw + 3, 120), (x + bw + gap - 3, 120)], head=5)
    save(im, "fig-build.png")


# ---------------- 图 4-1 安装与首次启动流程 ----------------
def fig_install():
    h = 300
    im, d = canvas(h)
    rows = [
        [("获取安装包", "APK / TestFlight"), ("校验与安装", "系统安装器"), ("授予权限", "相册 / 通知")],
        [("首次启动", "品牌页"), ("拉取站点配置", "接口地址 / 开关"), ("登录或浏览", "进入首页")],
    ]
    bw, bh = 250, 96
    x0, y0, gx, gy = 50, 40, 25, 42
    for r, row in enumerate(rows):
        for c, (t, sub) in enumerate(row):
            x = x0 + c * (bw + gx)
            y = y0 + r * (bh + gy)
            box(d, x, y, bw, bh, LILAC2, LINE, radius=8)
            mid(d, t, x + bw / 2, y + 40, 17, True, INK, max_w=bw - 16)
            mid(d, sub, x + bw / 2, y + 68, 13, False, INK2, max_w=bw - 16)
            if c < 2:
                arrow(d, [(x + bw + 3, y + bh / 2), (x + bw + gx - 3, y + bh / 2)], head=5)
    last_x = x0 + 2 * (bw + gx) + bw / 2
    first_x = x0 + bw / 2
    arrow(d, [(last_x, y0 + bh + 3), (last_x, y0 + bh + gy / 2),
              (first_x, y0 + bh + gy / 2), (first_x, y0 + bh + gy - 3)], head=5)
    save(im, "fig-install.png")


# ---------------- 图 5-x 富文本工具栏分层 ----------------
def fig_toolbar():
    h = 250
    im, d = canvas(h)
    box(d, 28, 20, W - 56, 76, LILAC2, LINE, radius=8)
    mid(d, "常用层", 84, 58, 15, True, PRIMARY_D)
    common = ["正文", "Aa", "B", "U", "颜色", "链接", "图片", "撤销"]
    n = len(common)
    gap = 8
    bw = (W - 56 - 120 - gap * (n - 1)) / n
    for i, t in enumerate(common):
        x = 136 + i * (bw + gap)
        box(d, x, 34, bw, 48, WHITE, LINE, radius=6)
        mid(d, t, x + bw / 2, 58, 14, False, INK)

    arrow(d, [(450, 98), (450, 128)], head=5)
    label(d, "点「Aa」展开", 462, 104, 12, False, INK2)

    groups = [("文字样式", "标题 / 引用"), ("字符", "粗 / 斜 / 线"),
              ("段落", "对齐 / 列表"), ("颜色", "文字 / 背景"),
              ("插入", "图 / 视频 / 帖")]
    gw = (W - 56 - 20 * (len(groups) - 1)) / len(groups)
    for i, (title, sub) in enumerate(groups):
        x = 28 + i * (gw + 20)
        box(d, x, 132, gw, 96, LILAC, LINE, radius=8)
        mid(d, title, x + gw / 2, 164, 15, True, PRIMARY_D)
        d.line([(x + 16) * S, 182 * S, (x + gw - 16) * S, 182 * S], fill=PRIMARY, width=1 * S)
        mid(d, sub, x + gw / 2, 202, 13, False, INK, max_w=gw - 12)
    save(im, "fig-toolbar.png")


def main():
    os.makedirs(OUT, exist_ok=True)
    print("结构图：")
    fig_modules()
    fig_arch()
    fig_deploy()
    fig_build()
    fig_install()
    fig_toolbar()


if __name__ == "__main__":
    main()
