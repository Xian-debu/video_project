#!/usr/bin/env python3
"""E07 派生数据：把 ts-base 的频域证据裁剪成画面要用的 fft.json。

输入：/root/ts-base/data/episodes/07-fft-basis-patch/
      {summary.json,fft.manifest.json,sh600519_daily.csv,sh600519_5min.csv,
       spectrum.csv,patches.csv,synthetic_fft.csv,basis_fit.csv,patch_recon.csv}
输出：data/fft.json（派生文件，不入库；脚本入库）
"""
from __future__ import annotations

import csv
import hashlib
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
TSBASE = pathlib.Path('/root/ts-base/data/episodes/07-fft-basis-patch')
OUT = ROOT / 'data' / 'fft.json'


def sha256(path: pathlib.Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def read_csv(path: pathlib.Path):
    with path.open(encoding='utf-8') as f:
        return list(csv.DictReader(f))


def main() -> int:
    summary = json.loads((TSBASE / 'summary.json').read_text())
    manifest = json.loads((TSBASE / 'fft.manifest.json').read_text())

    daily_rows = read_csv(TSBASE / 'sh600519_daily.csv')
    daily = {
        'dates': [r['date'] for r in daily_rows],
        'close': [round(float(r['close_qfq']), 3) for r in daily_rows],
    }

    minute_rows = read_csv(TSBASE / 'sh600519_5min.csv')
    minute = {
        'times': [r['bar_time'] for r in minute_rows],
        'close': [round(float(r['close']), 3) for r in minute_rows],
        'volume': [int(r['volume']) for r in minute_rows],
    }

    spec_rows = read_csv(TSBASE / 'spectrum.csv')
    spectrum = {
        'k': [int(r['k']) for r in spec_rows],
        'freq': [round(float(r['freq']), 6) for r in spec_rows],
        'magnitude': [round(float(r['magnitude']), 3) for r in spec_rows],
    }

    synth_rows = read_csv(TSBASE / 'synthetic_fft.csv')
    synthetic = {
        't': [int(r['t']) for r in synth_rows],
        'x': [round(float(r['x']), 4) for r in synth_rows],
        'bandStop': [round(float(r['band_stop']), 4) for r in synth_rows],
    }

    basis_rows = read_csv(TSBASE / 'basis_fit.csv')
    basis = {
        't': [int(r['t']) for r in basis_rows],
        'close': [round(float(r['close']), 3) for r in basis_rows],
        'fitted': [round(float(r['fitted']), 3) for r in basis_rows],
        'residual': [round(float(r['residual']), 3) for r in basis_rows],
    }

    patch_rows = read_csv(TSBASE / 'patches.csv')
    patches = {
        'start': [int(r['start']) for r in patch_rows],
        'rows': [[round(float(r['p%d' % j]), 2) for j in range(8)] for r in patch_rows],
    }

    recon_rows = read_csv(TSBASE / 'patch_recon.csv')
    patch_recon = {
        't': [int(r['t']) for r in recon_rows],
        'close': [round(float(r['close']), 3) for r in recon_rows],
        'recon': [round(float(r['recon']), 3) for r in recon_rows],
    }

    by_path = {a['path'].split('/')[-1]: a['sha256'] for a in summary['artifacts']}

    stats = {
        'fft': summary['fft'],
        'basis': summary['basis'],
        'patch': summary['patch'],
        'checks': summary['checks'],
        'cost': {
            'n': 512,
            'dft': 512 * 512,
            'fft': 256 * 9,
            'speedup': round(512 * 512 / (256 * 9), 1),
            'pad': 1024,
            'padOverhead': round((1024 - 730) / 730, 4),
        },
        'tests': {'fft': 18, 'basis': 14, 'patch': 15, 'suite': 550},
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
            'inventory/evidence/ch2-fft/20261030T155411-ch2-fft.json',
            'inventory/evidence/ch2-basis-exp/20261030T155411-ch2-basis-exp.json',
            'inventory/evidence/ch2-patchify/20261030T155411-ch2-patchify.json',
        ],
    }

    payload = {
        'meta': meta,
        'data': {
            'daily': summary['data']['daily'],
            'minute': summary['data']['minute'],
        },
        'series': {
            'daily': daily,
            'minute': minute,
            'spectrum': spectrum,
            'synthetic': synthetic,
            'basis': basis,
            'patches': patches,
            'patchRecon': patch_recon,
        },
        'stats': stats,
        'artifacts': {
            'spectrum': by_path['spectrum.csv'],
            'patches': by_path['patches.csv'],
            'synthetic': by_path['synthetic_fft.csv'],
            'basis': by_path['basis_fit.csv'],
            'patchRecon': by_path['patch_recon.csv'],
            'daily': summary['data']['daily']['sha256'],
            'minute': summary['data']['minute']['sha256'],
        },
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f'wrote {OUT} {OUT.stat().st_size} bytes')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
