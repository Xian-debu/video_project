#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""tsint B 站发布清单校验器。

用法:
    python3 release/verify_manifest.py            # 全量校验（含 sha256、PNG 尺寸、ffprobe 时长）
    python3 release/verify_manifest.py --quick    # 跳过 sha256 与时长实测（只查结构与长度约束）

退出码:
    0  全部通过（末尾打印 74 集统计）
    1  存在不合格项（逐条列出）

校验范围见 release/README.md「校验器查什么」一节。
"""

import argparse
import hashlib
import json
import os
import re
import struct
import subprocess
import sys
import unicodedata

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SERIES_DIR = os.path.dirname(SCRIPT_DIR)          # .../series/tsint
REPO_DIR = os.path.dirname(os.path.dirname(SERIES_DIR))   # .../video_project
MANIFEST = os.path.join(SCRIPT_DIR, "manifest.json")
STATUS_MD = os.path.join(REPO_DIR, "STATUS.md")

TOTAL_EPISODES = 74
TITLE_MAX = 80
DESC_MAX = 2000
TAGS_MIN, TAGS_MAX, TAG_LEN_MAX = 3, 10, 20
TITLE_PREFIX = re.compile(r"^时序智能 · 第(\d{2})集｜.+$")
COLLECTION_TITLE = "《时序智能》Haskell 算法实现"
REQUIRED_TAGS = ["时间序列", "Haskell"]
SOURCE_LINE = "源码与实验证据（Haskell）：https://github.com/Xian-debu/ts-base"
FORBIDDEN_TAG_CHARS = set("#，。、；：！？「」『』（）()《》【】〈〉…·／、\\|\"'“”‘’")

# durationSec（实测成片）与 report.json numbers.seconds（报告记录）允许的差
DURATION_TOL_REPORT = 1.0
DURATION_TOL_STATUS = 2.0
# 已核验的已知例外: order -> (允许差, 人可读原因)
KNOWN_REPORT_MISMATCH = {
    6: ("report.json 记录的是渲染长度 1374.73 s；成片按音轨 -shortest 截到 1369.90 s（mix.wav 1369.87 s），"
        "故实测与报告差 4.83 s，属交付件与报告口径不同，非错误"),
}

problems = []
warnings = []


def err(msg):
    problems.append(msg)


def warn(msg):
    warnings.append(msg)


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def png_size(path):
    with open(path, "rb") as fh:
        head = fh.read(24)
    if head[:8] != b"\x89PNG\r\n\x1a\n" or head[12:16] != b"IHDR":
        return None
    return struct.unpack(">II", head[16:24])


def ffprobe_duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True)
    try:
        return float(out.stdout.strip())
    except ValueError:
        return None


def load_status():
    """STATUS.md -> {id: {title, status, sec, bv}}"""
    if not os.path.exists(STATUS_MD):
        return {}
    rows = {}
    for line in open(STATUS_MD, encoding="utf-8"):
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) < 8 or not cells[0].startswith("tsint-"):
            continue
        rows[cells[0]] = {"title": cells[1], "status": cells[2], "sec": cells[3], "bv": cells[7]}
    return rows


def parse_sec(text):
    """STATUS.md 的 sec 列：数字才算数，'-' 表示未记录。"""
    try:
        return float(text)
    except (TypeError, ValueError):
        return None


def check_top_level(doc):
    if doc.get("series") != "tsint":
        err("manifest.series != \"tsint\"（实际 %r）" % doc.get("series"))
    gen = doc.get("generatedAt")
    if not isinstance(gen, str) or not re.match(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}", gen):
        err("manifest.generatedAt 不是 ISO8601 时间（实际 %r）" % gen)
    coll = doc.get("collection") or {}
    if not coll.get("title"):
        err("manifest.collection.title 为空")
    if not coll.get("desc"):
        err("manifest.collection.desc 为空")
    if coll.get("title") and coll["title"] != COLLECTION_TITLE:
        err("manifest.collection.title 与约定合集名不一致: %r" % coll["title"])
    d = doc.get("defaults") or {}
    for key in ("partition", "copyright", "statement", "visibility", "watermark"):
        if key not in d:
            err("manifest.defaults 缺少字段 %s" % key)
    if not d.get("partition"):
        err("manifest.defaults.partition 为空")
    if d.get("copyright") not in ("self", "reprint"):
        err("manifest.defaults.copyright 取值非法: %r" % d.get("copyright"))
    if d.get("statement") not in ("none", "ai", "reprint"):
        err("manifest.defaults.statement 取值非法: %r" % d.get("statement"))
    if d.get("visibility") not in ("public", "private", "fans"):
        err("manifest.defaults.visibility 取值非法: %r" % d.get("visibility"))
    if not isinstance(d.get("watermark"), bool):
        err("manifest.defaults.watermark 必须是布尔值")


def check_episode_metadata(ep, order):
    tag = "第 %02d 集" % order
    for key in ("order", "id", "dir", "composition", "title", "desc", "tags", "partition",
                "collection", "video", "videoBytes", "videoSha256", "cover", "coverSha256",
                "srt", "durationSec", "reportSec"):
        if key not in ep:
            err("%s 缺少字段 %s" % (tag, key))

    title = ep.get("title") or ""
    if not title.strip():
        err("%s title 为空" % tag)
    elif len(title) > TITLE_MAX:
        err("%s title 超长: %d > %d 字" % (tag, len(title), TITLE_MAX))
    m = TITLE_PREFIX.match(title)
    if not m:
        err("%s title 不符合统一模板「时序智能 · 第NN集｜…」: %r" % (tag, title))
    elif int(m.group(1)) != order:
        err("%s title 中的集号 %s 与 order %d 不一致" % (tag, m.group(1), order))

    desc = ep.get("desc") or ""
    if not desc.strip():
        err("%s desc 为空" % tag)
    elif len(desc) > DESC_MAX:
        err("%s desc 超长: %d > %d 字" % (tag, len(desc), DESC_MAX))
    elif len(desc.splitlines()) < 2:
        err("%s desc 不足 2 行" % tag)
    # 硬约束（用户 m06243）：每条简介必须带源码仓地址，单独成段、发布时不得删
    if "github.com/Xian-debu/ts-base" not in desc:
        err("%s desc 缺少源码仓地址 github.com/Xian-debu/ts-base" % tag)
    if SOURCE_LINE not in desc:
        err("%s desc 缺少固定源码段「%s…」" % (tag, SOURCE_LINE[:12]))
    if "https://github.com/Xian-debu/video_project" not in desc:
        err("%s desc 缺少工程仓地址" % tag)

    tags = ep.get("tags") or []
    if not isinstance(tags, list):
        err("%s tags 不是数组" % tag)
        tags = []
    if len(tags) < TAGS_MIN or len(tags) > TAGS_MAX:
        err("%s tags 数量 %d 不在 %d..%d" % (tag, len(tags), TAGS_MIN, TAGS_MAX))
    if len(set(tags)) != len(tags):
        err("%s tags 有重复项: %r" % (tag, tags))
    for t in tags:
        if not t or len(t) > TAG_LEN_MAX:
            err("%s tag 非法（空或超过 %d 字）: %r" % (tag, TAG_LEN_MAX, t))
        bad = [c for c in t if c in FORBIDDEN_TAG_CHARS]
        if bad:
            err("%s tag 含禁用标点 %r: %r" % (tag, bad, t))
        if unicodedata.east_asian_width(t[0]) == "N" and t[0].isdigit():
            warn("%s tag 以数字开头: %r" % (tag, t))
    for need in REQUIRED_TAGS:
        if need not in tags:
            err("%s tags 缺少固定标签 %r" % (tag, need))

    if not (ep.get("partition") or "").strip():
        err("%s partition 为空" % tag)
    if not (ep.get("collection") or "").strip():
        err("%s collection 为空" % tag)
    if ep.get("collection") != COLLECTION_TITLE:
        err("%s collection 与合集名不一致: %r" % (tag, ep.get("collection")))


def check_paths(ep, order):
    tag = "第 %02d 集" % order
    d = ep.get("dir") or ""
    need_prefix = "episodes/%s/delivery/" % d
    for key, suffix in (("video", ".mp4"), ("cover", "cover.png"), ("srt", ".srt")):
        p = ep.get(key) or ""
        if not p.startswith(need_prefix):
            err("%s %s 路径不在 %s 下: %r" % (tag, key, need_prefix, p))
        if not p.endswith(suffix):
            err("%s %s 必须以 %s 结尾: %r" % (tag, key, suffix, p))
        if not os.path.exists(os.path.join(SERIES_DIR, p)):
            err("%s %s 文件不存在: %s" % (tag, key, p))
    for banned in ("raw_video.mp4", "programme_unnorm.mp4", "/mix.wav", "/score.wav"):
        if banned in (ep.get("video") or ""):
            err("%s video 指向中间产物 %s" % (tag, banned))


def check_video_identity(ep, order, quick):
    tag = "第 %02d 集" % order
    video = os.path.join(SERIES_DIR, ep.get("video") or "")
    if not os.path.exists(video):
        return
    size = os.path.getsize(video)
    if size != ep.get("videoBytes"):
        err("%s videoBytes 与实测不一致: 清单 %s / 磁盘 %s" % (tag, ep.get("videoBytes"), size))
    if not quick:
        digest = sha256_file(video)
        if digest != ep.get("videoSha256"):
            err("%s videoSha256 与实测不一致: 清单 %s… / 磁盘 %s…"
                % (tag, (ep.get("videoSha256") or "")[:12], digest[:12]))
    comp = ep.get("composition") or ""
    if comp and os.path.basename(video) != comp + ".mp4":
        err("%s video 文件名与 composition 不一致: %r" % (tag, os.path.basename(video)))


def check_cover(ep, order, quick):
    tag = "第 %02d 集" % order
    cover = os.path.join(SERIES_DIR, ep.get("cover") or "")
    if not os.path.exists(cover):
        return
    size = png_size(cover)
    if size is None:
        err("%s cover 不是合法 PNG" % tag)
    elif size != (1920, 1080):
        err("%s cover 尺寸不是 1920x1080: %sx%s" % (tag, size[0], size[1]))
    if not quick:
        digest = sha256_file(cover)
        if digest != ep.get("coverSha256"):
            err("%s coverSha256 与实测不一致: 清单 %s… / 磁盘 %s…"
                % (tag, (ep.get("coverSha256") or "")[:12], digest[:12]))


def check_srt(ep, order):
    tag = "第 %02d 集" % order
    srt = os.path.join(SERIES_DIR, ep.get("srt") or "")
    if os.path.exists(srt) and os.path.getsize(srt) < 100:
        err("%s srt 文件过小，疑似空字幕" % tag)


def check_duration(ep, order, quick):
    tag = "第 %02d 集" % order
    dsec = ep.get("durationSec")
    rsec = ep.get("reportSec")
    if not isinstance(dsec, (int, float)) or not isinstance(rsec, (int, float)):
        err("%s durationSec/reportSec 必须是数字" % tag)
        return

    report_path = os.path.join(SERIES_DIR, "episodes", ep.get("dir") or "", "delivery", "report.json")
    if os.path.exists(report_path):
        rep = json.load(open(report_path, encoding="utf-8"))
        actual = rep.get("numbers", {}).get("seconds")
        if isinstance(actual, (int, float)) and abs(actual - rsec) > 0.05:
            err("%s reportSec 与 report.json numbers.seconds 不一致: 清单 %.2f / 文件 %.2f"
                % (tag, rsec, actual))

    diff = abs(dsec - rsec)
    if diff > DURATION_TOL_REPORT and order not in KNOWN_REPORT_MISMATCH:
        err("%s durationSec 与 reportSec 相差 %.2f s > %.1f s（无例外登记）"
            % (tag, diff, DURATION_TOL_REPORT))

    if not quick:
        probed = ffprobe_duration(os.path.join(SERIES_DIR, ep.get("video") or ""))
        if probed is None:
            err("%s 无法 ffprobe 实测时长" % tag)
        elif abs(probed - dsec) > 1.0:
            err("%s durationSec 与 ffprobe 实测相差 %.2f s: 清单 %.2f / 实测 %.2f"
                % (tag, abs(probed - dsec), dsec, probed))


def main():
    ap = argparse.ArgumentParser(description="校验 tsint 发布清单")
    ap.add_argument("--quick", action="store_true", help="跳过 sha256 / PNG 尺寸 / ffprobe 实测")
    args = ap.parse_args()

    if not os.path.exists(MANIFEST):
        print("FATAL: 找不到 %s" % MANIFEST)
        return 1
    try:
        doc = json.load(open(MANIFEST, encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001
        print("FATAL: manifest.json 无法解析: %s" % exc)
        return 1

    check_top_level(doc)

    episodes = doc.get("episodes") or []
    if len(episodes) != TOTAL_EPISODES:
        err("episodes 数量 %d != %d" % (len(episodes), TOTAL_EPISODES))

    orders = [e.get("order") for e in episodes]
    if sorted(orders) != list(range(1, TOTAL_EPISODES + 1)):
        missing = sorted(set(range(1, TOTAL_EPISODES + 1)) - set(orders))
        dups = sorted({o for o in orders if orders.count(o) > 1})
        err("order 不是 1..%d 的完备集合（缺 %s / 重 %s）" % (TOTAL_EPISODES, missing, dups))

    ids = [e.get("id") for e in episodes]
    if len(set(ids)) != len(ids):
        err("存在重复 id: %r" % [i for i in ids if ids.count(i) > 1][:5])

    status = load_status()
    if not status:
        warn("未能从 STATUS.md 读到 tsint 行，跳过交叉核对")
    else:
        if len(status) != TOTAL_EPISODES:
            err("STATUS.md 中 tsint 行为 %d 条，与 %d 集不符" % (len(status), TOTAL_EPISODES))

    seen_dirs = set()
    for ep in sorted(episodes, key=lambda x: x.get("order", 0)):
        order = ep.get("order")
        if not isinstance(order, int):
            err("存在 order 非整数的条目: %r" % ep.get("id"))
            continue
        check_episode_metadata(ep, order)

        d = ep.get("dir") or ""
        if d in seen_dirs:
            err("第 %02d 集 dir 重复: %s" % (order, d))
        seen_dirs.add(d)
        eid = ep.get("id") or ""
        if eid != "tsint-" + d:
            err("第 %02d 集 id 与目录名不一致: id=%r, 期望 %r" % (order, eid, "tsint-" + d))
        if not re.match(r"^%02d-" % order, d):
            err("第 %02d 集目录名未以两位集号开头: %r" % (order, d))

        ep_dir = os.path.join(SERIES_DIR, "episodes", d)
        film_path = os.path.join(ep_dir, "film.json")
        if not os.path.exists(film_path):
            err("第 %02d 集缺少 film.json: %s" % (order, ep_dir))
        else:
            film = json.load(open(film_path, encoding="utf-8"))
            if film.get("id") != eid:
                err("第 %02d 集 id 与 film.json 不一致: 清单 %r / film %r" % (order, eid, film.get("id")))
            if film.get("composition") != ep.get("composition"):
                err("第 %02d 集 composition 与 film.json 不一致" % order)
            if (film.get("series") or {}).get("dir") != d:
                err("第 %02d 集 dir 与 film.json series.dir 不一致" % order)
            if not str(ep.get("title", "")).endswith(film.get("title", "")):
                err("第 %02d 集 title 未以 film.json 标题结尾: %r" % (order, ep.get("title")))

        if eid in status:
            row = status[eid]
            if parse_sec(row["sec"]) is not None:
                if abs(parse_sec(row["sec"]) - ep.get("durationSec", 0)) > DURATION_TOL_STATUS:
                    err("第 %02d 集 durationSec 与 STATUS.md sec 相差 > %.1f s" % (order, DURATION_TOL_STATUS))
            if row["bv"] != "-":
                warn("第 %02d 集 STATUS.md 已有 BV 号 %s，发布前应确认不重复投稿" % (order, row["bv"]))
            if row["status"] != "ready":
                warn("第 %02d 集 STATUS.md 状态为 %r，不是 ready" % (order, row["status"]))
        elif status:
            err("第 %02d 集 id %r 不在 STATUS.md 中" % (order, eid))

        check_paths(ep, order)
        check_video_identity(ep, order, args.quick)
        check_cover(ep, order, args.quick)
        check_srt(ep, order)
        check_duration(ep, order, args.quick)

    total_sec = sum(e.get("durationSec", 0) for e in episodes if isinstance(e.get("durationSec"), (int, float)))
    total_bytes = sum(e.get("videoBytes", 0) for e in episodes if isinstance(e.get("videoBytes"), int))
    n = len(episodes) or 1

    print("=" * 68)
    print("tsint 发布清单校验  %s" % ("--quick" if args.quick else "全量"))
    print("=" * 68)
    print("清单条目: %d / %d" % (len(episodes), TOTAL_EPISODES))
    print("总时长:   %.1f s = %.2f 小时" % (total_sec, total_sec / 3600))
    print("平均时长: %.1f s = %.1f 分钟" % (total_sec / n, total_sec / n / 60))
    print("最短/最长: %.1f s / %.1f s" % (min(e["durationSec"] for e in episodes),
                                        max(e["durationSec"] for e in episodes)))
    print("总体积:   %d bytes = %.2f GB" % (total_bytes, total_bytes / 1024 ** 3))
    print("平均体积: %.1f MB" % (total_bytes / n / 1024 ** 2))
    print("标题长度: %d–%d 字（上限 %d）" % (min(len(e.get("title", "")) for e in episodes),
                                          max(len(e.get("title", "")) for e in episodes), TITLE_MAX))
    print("简介长度: %d–%d 字（上限 %d），全部含 ts-base 源码地址" % (
        min(len(e.get("desc", "")) for e in episodes), max(len(e.get("desc", "")) for e in episodes), DESC_MAX))
    print("标签数量: %d–%d 个，单标签最长 %d 字" % (min(len(e.get("tags") or []) for e in episodes),
                                            max(len(e.get("tags") or []) for e in episodes),
                                            max(len(t) for e in episodes for t in (e.get("tags") or [""]))))
    print("封面:     %d 张 1920x1080" % sum(1 for e in episodes if os.path.exists(os.path.join(SERIES_DIR, e.get("cover") or ""))))
    print("字幕:     %d 个 .srt" % sum(1 for e in episodes if os.path.exists(os.path.join(SERIES_DIR, e.get("srt") or ""))))
    print("-" * 68)
    for w in warnings:
        print("WARN  %s" % w)
    if problems:
        print("FAIL  共 %d 项不合格:" % len(problems))
        for p in problems:
            print("  - %s" % p)
        print("-" * 68)
        print("结果: FAILED (%d)" % len(problems))
        return 1
    print("结果: OK  74/74 集通过全部校验%s" % ("（quick 模式，未复算 sha256/时长）" if args.quick else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
