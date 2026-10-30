#!/usr/bin/env python3
"""E06 派生数据：把 ts-base 的分解证据裁剪成画面要用的 decomposition.json。

输入：/root/ts-base/data/episodes/06-decomposition-and-strength/
      {summary.json,decomp_maotai.csv,season_profile_5min.csv,synthetic.csv,
       sh600519_daily.csv,sz000001_daily.csv,sh600519_5min.csv,
       sh000001_2015_flat.csv,decomp.manifest.json}
输出：data/decomposition.json（派生文件，不入库；脚本入库）
"""
from __future__ import annotations

import csv
import hashlib
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
TSBASE = pathlib.Path('/root/ts-base/data/episodes/06-decomposition-and-strength')
EVIDENCE = pathlib.Path('/root/ts-base/inventory/evidence')
OUT = ROOT / 'data' / 'decomposition.json'


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_csv(path: pathlib.Path):
    with path.open(encoding='utf-8') as f:
        return list(csv.DictReader(f))


def num(v: str, digits: int):
    return None if v == '' else round(float(v), digits)


def series_from_manifest(name: str):
    return read_csv(TSBASE / f'{name}.csv')


def main() -> int:
    summary = json.loads((TSBASE / 'summary.json').read_text())
    manifest = json.loads((TSBASE / 'decomp.manifest.json').read_text())
    files = {f['path']: f for f in manifest['files']}

    maotai_rows = read_csv(TSBASE / 'decomp_maotai.csv')
    maotai = {
        'dates': [r['date'] for r in maotai_rows],
        'close': [num(r['close'], 3) for r in maotai_rows],
        'trend': [num(r['trend'], 3) for r in maotai_rows],
        'seasonal': [num(r['seasonal'], 3) for r in maotai_rows],
        'residual': [num(r['residual'], 3) for r in maotai_rows],
    }

    pingan_rows = series_from_manifest('sz000001_daily')
    pingan = {
        'dates': [r['date'] for r in pingan_rows],
        'close': [round(float(r['close_qfq']), 3) for r in pingan_rows],
    }

    minute_rows = series_from_manifest('sh600519_5min')
    minute = {
        'times': [r['bar_time'] for r in minute_rows],
        'close': [round(float(r['close']), 3) for r in minute_rows],
        'volume': [int(r['volume']) for r in minute_rows],
    }

    index_rows = series_from_manifest('sh000001_2015_flat')
    index = {
        'dates': [r['date'] for r in index_rows],
        'close': [round(float(r['close']), 3) for r in index_rows],
    }

    profile_rows = read_csv(TSBASE / 'season_profile_5min.csv')
    profile = {
        'phase': [int(r['phase']) for r in profile_rows],
        'value': [round(float(r['seasonal']), 3) for r in profile_rows],
    }

    synth_rows = read_csv(TSBASE / 'synthetic.csv')
    synth = {
        'i': [int(r['i']) for r in synth_rows],
        'linear': [round(float(r['linear']), 4) for r in synth_rows],
        'cycle': [round(float(r['cycle']), 4) for r in synth_rows],
        'noise': [round(float(r['noise']), 4) for r in synth_rows],
        'trend_noise': [round(float(r['trend_noise']), 4) for r in synth_rows],
        'season_noise': [round(float(r['season_noise']), 4) for r in synth_rows],
    }

    decomp = summary['decomp']
    syn = summary['synthetic']
    swap_trend = round(syn['trend_noise']['trend'] - syn['season_noise']['trend'], 12)
    swap_season = round(syn['season_noise']['seasonal'] - syn['trend_noise']['seasonal'], 12)

    def describe(name: str):
        f = files[name + '.csv']
        return {k: f[k] for k in ('rows', 'first', 'last', 'bytes', 'sha256', 'period')}

    data = {
        'maotai': describe('sh600519_daily'),
        'pingan': describe('sz000001_daily'),
        'minute': describe('sh600519_5min'),
        'index': describe('sh000001_2015_flat'),
        'indexNote': {
            'netChange': files['sh000001_2015_flat.csv'].get('net_change'),
            'rangeRatio': files['sh000001_2015_flat.csv'].get('range_ratio'),
        },
    }

    kernel4 = [0.125, 0.25, 0.25, 0.25, 0.125]
    phase_cycle = [10.0, 13.0, 16.0, 19.0]
    cycle_mean = sum(phase_cycle) / 4
    cycle_seasonal = [round(v - cycle_mean, 4) for v in phase_cycle]

    stats = {
        'decomp': {k: dict(v) for k, v in decomp.items() if k not in ('reconstruction_max_err', 'season_sum')},
        'synth': {k: dict(v) for k, v in syn.items()},
        'reconstructionMaxErr': decomp['reconstruction_max_err'],
        'seasonSum': decomp['season_sum'],
        'swapTrendGap': swap_trend,
        'swapSeasonGap': swap_season,
        'noiseTrend': syn['noise']['trend'],
        'noiseSeason': syn['noise']['seasonal'],
        'ma4': kernel4,
        'ma4Sum': sum(kernel4),
        'cyclePhase': phase_cycle,
        'cycleMean': cycle_mean,
        'cycleSeasonal': cycle_seasonal,
        'cycleTrendStrength': syn['cycle']['trend'],
        'cycleSeasonalStrength': syn['cycle']['seasonal'],
    }

    meta = {
        'episode': summary['meta']['episode'],
        'bookPages': summary['meta']['bookPages'],
        'tsBaseCommit': summary['meta']['tsBaseCommit'],
        'tsAdminCommit': manifest['tsAdminCommit'],
        'evidenceRunAt': summary['meta']['runAt'],
        'command': summary['meta']['command'],
        'seed': summary['meta']['seed'],
        'checks': summary['checks'],
        'evidence': [
            'inventory/evidence/ch2-classical/20261030T150458-ch2-classical.json',
            'inventory/evidence/ch2-trendstrength/20261030T150458-ch2-trendstrength.json',
            'inventory/evidence/ch2-seasonalstrength/20261030T150458-ch2-seasonalstrength.json',
        ],
    }

    payload = {
        'meta': meta,
        'data': data,
        'series': {'maotai': maotai, 'pingan': pingan, 'minute': minute, 'index': index, 'profile': profile, 'synthetic': synth},
        'stats': stats,
        'artifacts': {
            'decompMaotai': sha256(TSBASE / 'decomp_maotai.csv'),
            'seasonProfile': sha256(TSBASE / 'season_profile_5min.csv'),
            'synthetic': sha256(TSBASE / 'synthetic.csv'),
            'summary': sha256(TSBASE / 'summary.json'),
        },
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f'wrote {OUT} {OUT.stat().st_size} bytes')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
