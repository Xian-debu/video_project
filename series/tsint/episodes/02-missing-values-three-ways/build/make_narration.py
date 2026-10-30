#!/usr/bin/env python3
"""Assemble assets/audio/narration.wav from per-line TTS clips.

Clips are placed at the exact start times dumped into data/lines.json, so the
narration track matches the composition timeline frame-for-frame.
"""
import json
import subprocess
import sys
import wave
from pathlib import Path

RATE = 24000
PACK = Path(__file__).resolve().parent.parent


def decode(path: Path) -> bytes:
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-f", "s16le",
         "-ac", "1", "-ar", str(RATE), "-"],
        check=True, capture_output=True,
    )
    return out.stdout


def main() -> int:
    lines = json.loads((PACK / "data/lines.json").read_text())["lines"]
    clips = json.loads((PACK / "data/clips.json").read_text())
    total_sec = json.loads((PACK / "data/lines.json").read_text())["totalSec"]
    total = int(round(total_sec * RATE))
    track = bytearray(total * 2)
    for line in lines:
        key = f"{line['scene']}#{line['index']}"
        clip = PACK / "assets/audio/clips" / clips[key]["file"]
        pcm = decode(clip)
        at = int(round(line["start"] * RATE)) * 2
        end = at + len(pcm)
        if end > len(track):
            print(f"clip {key} overruns track: {end} > {len(track)}", file=sys.stderr)
            return 1
        track[at:end] = pcm
    out = PACK / "assets/audio/narration.wav"
    out.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(out), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(RATE)
        wav.writeframes(bytes(track))
    print(f"narration.wav: {out.stat().st_size} bytes, {total_sec} s, {len(lines)} lines")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
