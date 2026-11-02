#!/usr/bin/env python3
"""Synthesize this episode's narration, measure every clip, emit voice.json + clips.json.

Run from the pack root (requires edge-tts, ffmpeg/ffprobe):

    python3 build/tts_narration.py \
        --lines data/lines.json --clips assets/audio/clips \
        --voice-out data/voice.json --clips-json data/clips.json

lines.json comes from the engine's dump_script.mjs (or is committed), and the clip
durations written here are what script.ts uses to lay out the timeline. The wav itself
is built by scripts/tts/build_narration_lines.py in the engine repo.
"""
import argparse, asyncio, json, pathlib, subprocess, sys

import edge_tts

VOICE = "zh-CN-YunyangNeural"


def ffprobe_dur(path: pathlib.Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of",
         "default=noprint_wrappers=1:nokey=1", str(path)],
        capture_output=True, text=True, check=True).stdout.strip()
    return float(out)


async def synth(text: str, out: pathlib.Path, sem: asyncio.Semaphore) -> None:
    async with sem:
        for attempt in range(4):
            try:
                await edge_tts.Communicate(text, VOICE).save(str(out))
                if out.exists() and out.stat().st_size > 800:
                    return
            except Exception as e:  # noqa: BLE001
                if attempt == 3:
                    raise
                await asyncio.sleep(1.5 * (attempt + 1))


async def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--lines", required=True)
    ap.add_argument("--clips", required=True)
    ap.add_argument("--voice-out", required=True)
    ap.add_argument("--clips-json", required=True)
    ap.add_argument("--concurrency", type=int, default=4)
    ap.add_argument("--only", default=None, help="comma separated keys")
    a = ap.parse_args()

    doc = json.loads(pathlib.Path(a.lines).read_text(encoding="utf-8"))
    lines = doc["lines"]
    only = set(a.only.split(",")) if a.only else None
    clips_dir = pathlib.Path(a.clips)
    clips_dir.mkdir(parents=True, exist_ok=True)

    sem = asyncio.Semaphore(a.concurrency)
    todo = []
    for line in lines:
        key = "%s#%d" % (line["scene"], line["index"])
        if only and key not in only:
            continue
        f = clips_dir / (key.replace("#", "-") + ".mp3")
        if not (f.exists() and f.stat().st_size > 800):
            todo.append((line["speech"], f))
    print("synth %d clips (concurrency %d)" % (len(todo), a.concurrency), flush=True)
    await asyncio.gather(*(synth(t, f, sem) for t, f in todo))

    voice, clips = {}, {}
    for line in lines:
        key = "%s#%d" % (line["scene"], line["index"])
        f = clips_dir / (key.replace("#", "-") + ".mp3")
        if not f.exists():
            print("missing", key)
            return 1
        d = ffprobe_dur(f)
        voice[key] = round(d, 3)
        clips[key] = {"file": f.name, "dur": round(d, 3)}
    pathlib.Path(a.voice_out).parent.mkdir(parents=True, exist_ok=True)
    pathlib.Path(a.voice_out).write_text(json.dumps(voice, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    pathlib.Path(a.clips_json).write_text(json.dumps(clips, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    total = sum(voice.values())
    print("measured %d clips, speech %.1fs, mean %.2fs" % (len(voice), total, total / len(voice)))
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
