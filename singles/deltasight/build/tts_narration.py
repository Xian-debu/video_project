#!/usr/bin/env python3
"""Build assets/audio/narration.wav from the measured TTS slices.

Inputs:
  data/lines.json     —— dump_script.mjs 的输出：每句 scene#index、start、dur、文本
  data/clips.json     —— synth 的输出：scene#index -> 切片文件名与字节数
  assets/audio/clips/ —— 切片本体（由 build/tts/synthesize_deltasight.py 在 gen24 上生成后拷入）

只按 data/lines.json 里已经算好的起点把切片铺到时间轴上，不再合成，所以是确定性的。
只用标准库（wave + array/numpy），ds 上的 python3 没有 soundfile。
"""
import argparse
import json
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48000
PEAK = 0.72
FADE = 0.02


def read_wav(path: Path) -> np.ndarray:
    with wave.open(str(path), "rb") as w:
        ch = w.getnchannels()
        sw = w.getsampwidth()
        sr = w.getframerate()
        raw = w.readframes(w.getnframes())
    if sw != 2:
        raise SystemExit("only 16-bit PCM clips are supported: " + str(path))
    x = np.frombuffer(raw, dtype="<i2").astype(np.float32) / 32768.0
    if ch > 1:
        x = x.reshape(-1, ch).mean(axis=1)
    if sr != SR:
        n = int(round(len(x) * SR / sr))
        idx = np.linspace(0, len(x) - 1, n, dtype=np.float64)
        x = np.interp(idx, np.arange(len(x)), x).astype(np.float32)
    return x


def write_wav(path: Path, x: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    pcm = np.clip(x, -1.0, 1.0)
    pcm = (pcm * 32767.0).astype("<i2")
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


def main() -> int:
    here = Path(__file__).resolve().parent
    pack = here.parent
    ap = argparse.ArgumentParser()
    ap.add_argument("--lines", default=str(pack / "data/lines.json"))
    ap.add_argument("--clips", default=str(pack / "data/clips.json"))
    ap.add_argument("--clip-dir", default=str(pack / "assets/audio/clips"))
    ap.add_argument("--out", default=str(pack / "assets/audio/narration.wav"))
    args = ap.parse_args()

    lines = json.loads(Path(args.lines).read_text(encoding="utf-8"))
    clips = json.loads(Path(args.clips).read_text(encoding="utf-8"))
    clip_dir = Path(args.clip_dir)

    total = float(lines["totalSec"])
    buf = np.zeros(int(round(total * SR)) + SR, dtype=np.float32)

    missing = []
    for line in lines["lines"]:
        key = line["scene"] + "#" + str(line["index"])
        rec = clips.get(key)
        if not rec:
            missing.append(key)
            continue
        wav = clip_dir / rec["file"]
        if not wav.exists():
            missing.append(key + " (" + rec["file"] + ")")
            continue
        audio = read_wav(wav)
        start = int(round(float(line["start"]) * SR))
        end = start + len(audio)
        if end > len(buf):
            buf = np.pad(buf, (0, end - len(buf) + SR))
        buf[start:end] += audio

    if missing:
        sys.stderr.write("missing clips: " + ", ".join(missing[:8]) + "\n")
        return 2

    peak = float(np.max(np.abs(buf))) or 1.0
    buf = (buf / peak * PEAK).astype(np.float32)
    n = int(FADE * SR)
    buf[:n] *= np.linspace(0, 1, n, dtype=np.float32)
    buf[-n:] *= np.linspace(1, 0, n, dtype=np.float32)

    out = Path(args.out)
    write_wav(out, buf)
    print("narration: %.2f s, %d lines -> %s" % (len(buf) / SR, len(lines["lines"]), out))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
