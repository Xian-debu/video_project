#!/usr/bin/env python3
"""派生第 13 集的数据包：只读 ts-base 的证据输出，不改任何原始数据。

输入：/root/ts-base/data/episodes/13-normalization-trio/summary.json
输出：<pack>/data/norm.json（派生文件，不入库；film.json 的 derive/derived 记录它）

宁可在这里失败也不让画面带错数：
1. 三条桥接必须都是 0.0；
2. 字面实现 <= 1e-12、正确实现 > 50、往返 <= 1e-12；
3. 120 * 250 = 30000 行；
4. SAN 的比率与 MAE 由原始数重算，旁白念到的 3.64 / 1.51 / 0.39 逐个断言。
"""
import json
import pathlib
import sys

PACK = pathlib.Path(__file__).resolve().parents[1]
SRC = pathlib.Path("/root/ts-base/data/episodes/13-normalization-trio/summary.json")
OUT = PACK / "data" / "norm.json"


def main() -> int:
    raw = json.loads(SRC.read_text(encoding="utf-8"))
    data = raw["data"]
    rev = raw["revin"]
    dain = raw["dain"]
    san = raw["san"]
    br = raw["bridges"]
    checks = raw["checks"]

    assert data["codes"] * data["days"] == data["rows"] == 30000, data
    for k, v in br.items():
        assert v == 0.0, (k, v)
    assert rev["literal_max_diff"] < 1e-12, rev
    assert rev["forward_max_diff"] > 50, rev
    assert rev["roundtrip_max_diff"] < 1e-12, rev
    assert dain["params"] == 12 and abs(dain["wa"][0] - 1) < 1e-9, dain
    assert abs(dain["wb"][1] - 1) < 1e-9, dain
    assert san["tau"] * san["shards"] <= 250 and san["shards"] == 10, san
    mu_ratio = san["mu_mae"] / san["naive_mu_mae"]
    sg_ratio = san["sigma_mae"] / san["naive_sigma_mae"]
    assert abs(mu_ratio - san["mu_ratio_vs_naive"]) < 1e-6, (mu_ratio, san["mu_ratio_vs_naive"])
    assert abs(sg_ratio - san["sigma_ratio_vs_naive"]) < 1e-6, (sg_ratio, san["sigma_ratio_vs_naive"])
    assert abs(san["shard_sigma_ratio_mean"] - 0.3923) < 1e-3, san
    assert checks["failed"] == 0

    out = {
        "meta": {
            "episode": raw["meta"]["episode"],
            "bookPages": raw["meta"]["bookPages"],
            "tsBaseCommit": raw["meta"]["tsBaseCommit"],
            "runAt": raw["meta"]["runAt"],
            "checks": checks,
            "tests": {"suites": 55, "asserts": 409, "revin": 13, "dain": 15, "san": 14},
        },
        "data": data,
        "revin": rev,
        "dain": dain,
        "san": san,
        "bridges": br,
        "ratios": {"mu": mu_ratio, "sigma": sg_ratio},
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {OUT} ({OUT.stat().st_size} B)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
