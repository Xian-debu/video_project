#!/usr/bin/env python3
"""E05 派生数据：把 ts-base 的证据裁剪成画面要用的 stationarize.json。

输入：/root/ts-base/data/episodes/05-stationarize-three-ways/{summary.json,diff_daily.csv,log_daily.csv,synthetic.csv}
输出：data/stationarize.json（派生文件，不入库；脚本入库）
"""
from __future__ import annotations

import csv
import hashlib
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
TSBASE = pathlib.Path('/root/ts-base/data/episodes/05-stationarize-three-ways')
OUT = ROOT / 'data' / 'stationarize.json'


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_diff(path: pathlib.Path):
    with path.open(encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    dates = [r['date'] for r in rows]
    close = [round(float(r['close']), 4) for r in rows]
    ret = [round(float(r['ret']), 4) for r in rows]
    return dates, close, ret


def read_log(path: pathlib.Path):
    with path.open(encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    dates = [r['date'] for r in rows]
    log_close = [round(float(r['log_close']), 4) for r in rows]
    log_volume = [round(float(r['log_volume']), 4) for r in rows]
    return dates, log_close, log_volume


def read_synthetic(path: pathlib.Path):
    with path.open(encoding='utf-8') as f:
        rows = list(csv.DictReader(f))
    walk = [round(float(r['walk']), 4) for r in rows]
    diff = [None if r['diff'] == '' else round(float(r['diff']), 4) for r in rows]
    hetero = [round(float(r['hetero']), 4) for r in rows]
    log_hetero = [round(float(r['log_hetero']), 4) for r in rows]
    return walk, diff, hetero, log_hetero


def main() -> None:
    summary = json.loads((TSBASE / 'summary.json').read_text(encoding='utf-8'))
    d_dates, d_close, d_ret = read_diff(TSBASE / 'diff_daily.csv')
    l_dates, l_close, l_vol = read_log(TSBASE / 'log_daily.csv')
    walk, walk_diff, hetero, log_hetero = read_synthetic(TSBASE / 'synthetic.csv')

    data = summary['data']
    diff = summary['diff']
    log = summary['log']
    zs = summary['zscore']
    syn = summary['synthetic']['random_walk']
    chk = summary['checks']

    # 图只画前 400 个点，密度足够；数值统计仍用全量。
    step = max(1, len(walk) // 400)
    walk_s = walk[::step]
    walk_diff_s = [walk_diff[i] for i in range(0, len(walk_diff), step)]
    hetero_s = hetero[::step]
    log_hetero_s = log_hetero[::step]

    payload = {
        'meta': {
            'episode': 5,
            'bookPages': summary['meta']['bookPages'],
            'tsBaseCommit': summary['meta']['tsBaseCommit'],
            'evidenceRunAt': summary['meta']['runAt'],
            'command': summary['meta']['command'],
            'seed': summary['meta']['seed'],
            'checks': chk,
            'evidencePath': 'inventory/evidence/ch2-{diff,log,zscore}/',
        },
        'data': {
            'daily': data['daily'],
            'bull': data['bull'],
        },
        'series': {
            'dates': d_dates,
            'close': d_close,
            'ret': d_ret,
            'logDates': l_dates,
            'logClose': l_close,
            'logVolume': l_vol,
            'walk': walk_s,
            'walkDiff': walk_diff_s,
            'hetero': hetero_s,
            'logHetero': log_hetero_s,
        },
        'stats': {
            'retMean': diff['daily']['ret_mean'],
            'retSd': diff['daily']['ret_sd'],
            'acfLevel': diff['daily']['acf_level'],
            'acfDiff': diff['daily']['acf_diff'],
            'varianceRatio5': diff['daily']['variance_ratio5'],
            'bullAcfLevel': diff['daily']['bull_acf_level'],
            'bullAcfDiff': diff['daily']['bull_acf_diff'],
            'manualD1': diff['manual']['d1'],
            'manualD2': diff['manual']['d2'],
            'manualSeasonal2': diff['manual']['seasonal2'],
            'volumeZeros': log['daily']['volume_zeros'],
            'corrLevel': log['hetero']['corr_level'],
            'corrLog': log['hetero']['corr_log'],
            'window': log['hetero']['window'],
            'mu': zs['daily']['mu'],
            'sd': zs['daily']['sd'],
            'sumZ': zs['daily']['sum_z'],
            'sumZ2': zs['daily']['sum_z2'],
            'acfZ': zs['daily']['acf_zscore'],
            'acfDelta': zs['daily']['acf_delta'],
            'inverseMaxErr': zs['daily']['inverse_max_err'],
            'walkN': syn['n'],
            'walkVarLevel': syn['var_level'],
            'walkVarDiff': syn['var_diff'],
            'walkAcfLevel': syn['acf_level'],
            'walkAcfDiff': syn['acf_diff'],
        },
        'artifacts': {
            'diffDaily': {'path': 'diff_daily.csv', 'sha256': sha256(TSBASE / 'diff_daily.csv')},
            'logDaily': {'path': 'log_daily.csv', 'sha256': sha256(TSBASE / 'log_daily.csv')},
            'synthetic': {'path': 'synthetic.csv', 'sha256': sha256(TSBASE / 'synthetic.csv')},
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('wrote', OUT, OUT.stat().st_size, 'bytes')


if __name__ == '__main__':
    main()
