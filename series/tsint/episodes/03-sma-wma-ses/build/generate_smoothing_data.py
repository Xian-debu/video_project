#!/usr/bin/env python3
"""E03 派生数据：把 ts-base 的证据汇总裁剪成画面要用的 smoothing.json。

输入：/root/ts-base/data/episodes/03-sma-wma-ses/{summary.json,sh600519_daily.csv,sh600519_5min.csv}
输出：data/smoothing.json（派生文件，不入库；脚本入库）
"""
from __future__ import annotations

import csv
import hashlib
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
TSBASE = pathlib.Path('/root/ts-base/data/episodes/03-sma-wma-ses')
OUT = ROOT / 'data' / 'smoothing.json'


def sha256(path: pathlib.Path) -> str:
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()


def read_closes(path: pathlib.Path):
    with path.open(encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    return [(r['date'], float(r['close_qfq'])) for r in rows]


def main() -> None:
    summary = json.loads((TSBASE / 'summary.json').read_text(encoding='utf-8'))
    daily = read_closes(TSBASE / 'sh600519_daily.csv')
    with (TSBASE / 'sh600519_5min.csv').open(encoding='utf-8') as f:
        intra = [(r['bar_time'], float(r['close'])) for r in csv.DictReader(f)]

    n = len(daily)
    first_close = daily[0][1]
    last_close = daily[-1][1]

    payload = {
        'meta': {
            'episode': 3,
            'bookPages': summary['meta']['bookPages'],
            'tsBaseCommit': summary['meta']['tsBaseCommit'],
            'evidenceRunAt': summary['meta']['runAt'],
            'command': summary['meta']['command'],
            'seed': summary['meta']['seed'],
            'tests': summary['tests'],
            'checks': summary['checks'],
            'evidencePath': 'inventory/evidence/ch2-{sma,wma,ses}',
        },
        'data': {
            'daily': summary['data']['daily'],
            'intraday': summary['data']['intraday'],
            'firstClose': first_close,
            'lastClose': last_close,
            'gainPct': (last_close - first_close) / first_close * 100.0,
            'rows': n,
        },
        'centroids': summary['centroids'],
        'bridge': summary['bridge'],
        'step': summary['step'],
        'dailyCompare': summary['daily_compare'],
        'init': summary['init'],
        'drift': summary['drift'],
        'frequency': summary['frequency'],
        'window': summary['window'],
        'stepSeries': summary['step_series'],
        'intradaySeries': summary['intraday_series'],
        'weights': {
            'linear20': [i + 1 for i in range(20)],
            'tri20': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        },
        'golden': {
            'sma': {'n': 3, 'x': [1, 2, 3, 4, 5], 'y': [2, 3, 4]},
            'ses': {'alpha': 0.5, 's0': 2, 'x': [1, 2, 3, 4], 'y': [1.5, 1.75, 2.375, 3.1875]},
        },
        'manifest': {
            'dailyBytes': (TSBASE / 'sh600519_daily.csv').stat().st_size,
            'dailySha256': sha256(TSBASE / 'sh600519_daily.csv'),
            'intraBytes': (TSBASE / 'sh600519_5min.csv').stat().st_size,
            'intraSha256': sha256(TSBASE / 'sh600519_5min.csv'),
            'intraBars': len(intra),
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'smoothing.json: {OUT.stat().st_size} bytes, rows={n}, window={len(payload["window"]["close"])}')


if __name__ == '__main__':
    main()
