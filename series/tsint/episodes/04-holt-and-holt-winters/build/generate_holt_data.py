#!/usr/bin/env python3
"""E04 派生数据：把 ts-base 的证据裁剪成画面要用的 holt.json。

输入：/root/ts-base/data/episodes/04-holt-and-holt-winters/{summary.json,fitted_daily.csv,season_intraday48.csv}
输出：data/holt.json（派生文件，不入库；脚本入库）
"""
from __future__ import annotations

import csv
import hashlib
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
TSBASE = pathlib.Path('/root/ts-base/data/episodes/04-holt-and-holt-winters')
OUT = ROOT / 'data' / 'holt.json'


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_fitted(path: pathlib.Path):
    with path.open(encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    dates = [r['date'] for r in rows]
    close = [round(float(r['close']), 4) for r in rows]
    holt = [round(float(r['holt']), 4) for r in rows]
    add5 = [round(float(r['hw_add5']), 4) for r in rows]
    add252 = [round(float(r['hw_add252']), 4) for r in rows]
    return dates, close, holt, add5, add252


def read_season48(path: pathlib.Path):
    with path.open(encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    season = [round(float(r['season']), 4) for r in rows]
    emp = [round(float(r['empirical']), 4) for r in rows]
    return season, emp


def main() -> None:
    summary = json.loads((TSBASE / 'summary.json').read_text(encoding='utf-8'))
    dates, close, holt_fit, add5_fit, add252_fit = read_fitted(TSBASE / 'fitted_daily.csv')
    season48, emp48 = read_season48(TSBASE / 'season_intraday48.csv')

    d = summary['data']
    h = summary['holt']
    w = summary['holtwinters']
    n = len(close)
    first_close, last_close = close[0], close[-1]

    payload = {
        'meta': {
            'episode': 4,
            'bookPages': summary['meta']['bookPages'],
            'tsBaseCommit': summary['meta']['tsBaseCommit'],
            'evidenceRunAt': summary['meta']['runAt'],
            'command': summary['meta']['command'],
            'seed': summary['meta']['seed'],
            'checks': summary['checks'],
            'evidencePath': 'inventory/evidence/ch2-{holt,holtwinters}',
        },
        'data': {
            'daily': d['daily'],
            'intraday': d['intraday'],
            'volume': d['volume'],
            'rows': n,
            'intradayDays': d['intraday']['rows'] // d['intraday']['bar_minutes'] // 48 * 48 // 48 * 0 + 68,
            'firstClose': round(first_close, 4),
            'lastClose': round(last_close, 4),
            'gainPct': round((last_close - first_close) / first_close * 100.0, 4),
        },
        'holt': {
            'manual': h['manual'],
            'daily': {
                'alpha': h['daily']['alpha'],
                'beta': h['daily']['beta'],
                'sse': round(h['daily']['sse'], 2),
                'sseSes': round(h['daily']['sse_ses_same_alpha'], 2),
                'improve': round(h['daily']['improve_vs_ses'], 6),
                'lastLevel': round(h['daily']['last_level'], 6),
                'lastTrend': round(h['daily']['last_trend'], 6),
                'forecast': [round(v, 4) for v in h['daily']['forecast']],
            },
            'series': {
                'dates': dates,
                'close': close,
                'holt': holt_fit,
                'hwAdd5': add5_fit,
                'hwAdd252': add252_fit,
            },
        },
        'hw': {
            'add5': {
                'alpha': w['add_daily5']['alpha'],
                'beta': w['add_daily5']['beta'],
                'gamma': w['add_daily5']['gamma'],
                'L': w['add_daily5']['L'],
                'sse': round(w['add_daily5']['sse'], 2),
                'amp': round(w['add_daily5']['season_amp'], 4),
                'season': [round(v, 4) for v in w['add_daily5']['season']],
                'forecast': [round(v, 4) for v in w['add_daily5']['forecast']],
            },
            'add252': {
                'sse': round(w['add_daily252']['sse'], 2),
                'amp': round(w['add_daily252']['season_amp'], 4),
                'seasonHead': [round(v, 4) for v in w['add_daily252']['season_head']],
                'forecast': [round(v, 4) for v in w['add_daily252']['forecast']],
            },
            'mul5': {'sse': round(w['mul_daily5']['sse'], 2)},
            'intraday': {
                'alpha': w['add_intraday48']['alpha'],
                'beta': w['add_intraday48']['beta'],
                'gamma': w['add_intraday48']['gamma'],
                'L': w['add_intraday48']['L'],
                'sse': round(w['add_intraday48']['sse'], 2),
                'amp': round(w['add_intraday48']['season_amp'], 4),
                'corr': round(w['add_intraday48']['season_corr'], 6),
                'season': season48,
                'empirical': emp48,
                'forecast': [round(v, 4) for v in w['add_intraday48']['forecast']],
            },
            'zero': {
                'additiveSse': w['zero_volume']['additive_sse'],
                'error': w['zero_volume']['multiplicative_error'],
            },
        },
        'artifacts': {
            'fittedDaily': {
                'path': 'data/episodes/04-holt-and-holt-winters/fitted_daily.csv',
                'bytes': (TSBASE / 'fitted_daily.csv').stat().st_size,
                'sha256': sha256(TSBASE / 'fitted_daily.csv'),
            },
            'season48': {
                'path': 'data/episodes/04-holt-and-holt-winters/season_intraday48.csv',
                'bytes': (TSBASE / 'season_intraday48.csv').stat().st_size,
                'sha256': sha256(TSBASE / 'season_intraday48.csv'),
            },
        },
    }
    payload['data']['intradayDays'] = d['intraday']['rows'] // 48
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print('wrote', OUT, OUT.stat().st_size, 'bytes; rows', n, 'days', payload['data']['intradayDays'])


if __name__ == '__main__':
    main()
