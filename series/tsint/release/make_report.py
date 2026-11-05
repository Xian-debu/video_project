#!/usr/bin/env python3
"""从 manifest + ledger 生成 B 站发布报告 (docs/RELEASE-REPORT.md)。

用法:
  python3 series/tsint/release/make_report.py [--out docs/RELEASE-REPORT.md] [--audit /tmp/audit.json]
"""
import argparse, datetime, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
RELEASE = os.path.join(ROOT, 'series', 'tsint', 'release')
MANIFEST = os.path.join(RELEASE, 'manifest.json')
LEDGER = os.path.join(RELEASE, 'ledger.json')
DONE = {'submitted', 'published', 'done', 'success'}


def mmss(sec):
    sec = int(round(float(sec or 0)))
    return '%d:%02d' % (sec // 60, sec % 60)


def human_bytes(n):
    n = float(n or 0)
    for unit in ('B', 'KB', 'MB', 'GB'):
        if n < 1024 or unit == 'GB':
            return ('%.0f %s' % (n, unit)) if unit == 'B' else ('%.2f %s' % (n, unit))
        n /= 1024.0
    return '%.2f GB' % n


def trunc(s, n=48):
    s = (s or '').replace('|', '\\|')
    return s if len(s) <= n else s[:n - 1] + '…'


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', default=os.path.join(ROOT, 'docs', 'RELEASE-REPORT.md'))
    ap.add_argument('--audit', default=None)
    args = ap.parse_args()
    with open(MANIFEST, encoding='utf-8') as f:
        manifest = json.load(f)
    with open(LEDGER, encoding='utf-8') as f:
        ledger = json.load(f)
    eps = manifest['episodes']
    led = ledger.get('episodes', {})
    audit_map = {}
    if args.audit and os.path.exists(args.audit):
        with open(args.audit, encoding='utf-8') as f:
            audit = json.load(f)
        items = audit.get('results') if isinstance(audit, dict) else audit
        for item in items or []:
            if isinstance(item, dict):
                audit_map[str(item.get('order'))] = item
    submitted = [e for e in eps if (led.get(str(e['order'])) or {}).get('status') in DONE]
    failed = [e for e in eps if (led.get(str(e['order'])) or {}).get('status') == 'failed']
    pending = [e for e in eps if str(e['order']) not in led]
    total_sec = sum(float(e.get('durationSec') or 0) for e in eps)
    total_bytes = sum(float(e.get('videoBytes') or 0) for e in eps)
    sub_sec = sum(float(e.get('durationSec') or 0) for e in submitted)
    sub_bytes = sum(float(e.get('videoBytes') or 0) for e in submitted)
    now = datetime.datetime.now().astimezone().strftime('%Y-%m-%d %H:%M:%S %z')
    L = []
    L.append('# 《时序智能》B 站发布报告')
    L.append('')
    L.append('生成时间：%s（由 series/tsint/release/make_report.py 从 manifest + ledger 生成，不要手改）。' % now)
    L.append('')
    L.append('## 一、结论')
    L.append('')
    L.append('- 目标：把 74 集《时序智能》全部以公开可见投稿到 B 站，逐批验证后提交台账。')
    L.append('- 进度：**%d/%d 集已投稿**，失败 %d 集，未开始 %d 集。' % (len(submitted), len(eps), len(failed), len(pending)))
    L.append('- 规模：已投稿时长 %s（%d 秒）、%s；全系列 %s、%s。'
             % (mmss(sub_sec), int(sub_sec), human_bytes(sub_bytes), mmss(total_sec), human_bytes(total_bytes)))
    L.append('- 每集简介含固定行「源码与实验证据（Haskell）：https://github.com/Xian-debu/ts-base」，由 audit_published.py 逐集校验。')
    L.append('')
    L.append('## 二、涉及仓库')
    L.append('')
    L.append('| 仓库 | 用途 | 许可 |')
    L.append('| --- | --- | --- |')
    L.append('| https://github.com/Xian-debu/ts-base | Haskell 算法实现与实验证据（每集数字来源） | BSD-3-Clause |')
    L.append('| https://github.com/Xian-debu/ts-admin | 数据导出与管道脚本 | MIT |')
    L.append('| https://github.com/Xian-debu/video_project | 内容包/渲染/发布台账与工具（本报告所在仓） | BSD-3-Clause |')
    L.append('')
    L.append('## 三、逐集台账')
    L.append('')
    L.append('| # | 标题 | 时长 | 体积 | 状态 | BV / 原因 | 已复核 |')
    L.append('| ---: | --- | ---: | ---: | --- | --- | :---: |')
    for e in eps:
        order = str(e['order'])
        rec = led.get(order) or {}
        status = rec.get('status') or 'pending'
        if status in DONE:
            bv = rec.get('bvid') or ''
            cell = '[%s](https://www.bilibili.com/video/%s/)' % (bv, bv) if bv else '（无 bvid）'
        elif status == 'failed':
            cell = '失败：%s' % trunc(rec.get('lastError') or '', 60)
        else:
            cell = '未开始'
        audited = ''
        if audit_map:
            item = audit_map.get(order)
            audited = 'OK' if item and item.get('ok') else ('差异' if item else '')
        L.append('| %02d | %s | %s | %s | %s | %s | %s |' % (e['order'], trunc(e.get('title')), mmss(e.get('durationSec')), human_bytes(e.get('videoBytes')), status, cell, audited))
    L.append('')
    L.append('## 四、发布流程与验证')
    L.append('')
    L.append('1. manifest.json 由各集 delivery 产物生成（标题/简介/标签/分区/封面/视频 sha256），verify_manifest.py 校验字段与文件存在性。')
    L.append('2. cdp-admin/bilibili-tool 的 batch 子命令串行投稿：stage 到 Windows 暂存盘 → 上传 → 填表 → 点「立即投稿」→ 三路读回 bvid → 原子写 ledger.json（断点续跑）。')
    L.append('3. 每批发布后用 audit_published.py 走公开 API 复核标题/标签集合/简介（含 ts-base 行）/时长 ±2 s，全部通过再回填 STATUS.md 并提交。')
    L.append('4. 单集失败停批并记录 lastError/errorCode/截图；修好工具后按序补发，不跳集。')
    L.append('')
    L.append('## 五、已知问题')
    L.append('')
    L.append('- 平台限流 137022「投稿过于频繁」：连续投稿 51 集后触发，前端只把错误打进 console、不渲染 UI，表现为「点立即投稿无反应」。工具已加 console 探针（RATE_LIMITED 快速失败）与冷却重试/集间间隔参数，剩余集数按冷却窗口分批投。')
    L.append('- 合集：账号未开通合集功能，collection 走 fail-closed（不静默跳过、不假装成功），故各集不挂合集。')
    L.append('- 转码/审核：投稿成功后短时间 x/web-interface/view 可能返回 -404，属平台正常延迟；台账以管理页读回为准。')
    L.append('- tname（分区）在公开 API 上可能为空，审计不校验分区，分区以填表下拉读回为准。')
    L.append('')
    L.append('## 六、复现方式')
    L.append('')
    L.append('     python3 series/tsint/release/verify_manifest.py')
    L.append('     node bin/bili.mjs login --check --json          # cdp-admin/bilibili-tool')
    L.append('     node bin/bili.mjs batch --manifest /root/video_project/series/tsint/release/manifest.json \\')
    L.append('       --ledger /root/video_project/series/tsint/release/ledger.json --from 1 --to 74 \\')
    L.append('       --gap-ms 90000 --rate-wait-ms 900000 --rate-retries 4 --yes')
    L.append('     python3 series/tsint/release/audit_published.py --from 1 --to 74 --json > /tmp/audit.json')
    L.append('     python3 series/tsint/release/backfill_status.py')
    L.append('     python3 series/tsint/release/make_report.py --audit /tmp/audit.json')
    L.append('')
    out = args.out
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8') as f:
        f.write('\n'.join(L) + '\n')
    print('wrote %s' % out)
    print('submitted %d / %d, failed %d, pending %d' % (len(submitted), len(eps), len(failed), len(pending)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
