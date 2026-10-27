import React from "react";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { Build, CountRoll } from "../../design/primitives";
import { Card, Mono, Body, Line, Head, Scene, PAD, beatAt, DEMO, EV, pct } from "../shared";

const CH_W = 1100;
const CH_H = 430;
const LO = 1e-6;
const HI = 1;
const N = 8;

const yOf = (v: number) => CH_H - ((Math.log10(v) - Math.log10(LO)) / (Math.log10(HI) - Math.log10(LO))) * CH_H;
const xOf = (i: number) => (i / (N - 1)) * CH_W;

const series = (key: "uncoded" | "hard" | "soft") =>
  DEMO.ber.map((p) => (p[key] > 0 ? p[key] : null));

/** 实测：三条误比特率曲线，加上两个增益数、以及「翻多少还能救回来」。 */
export const SDemo: React.FC = () => {
  const beats = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((i) => beatAt("demo", i, 14));
  const gain = DEMO.gain;
  return (
    <Scene id="demo">
      <Head kicker="06 / 复现" title="到底好多少，跑一遍" goal="同样一套参数，在加性白噪声里量出误比特率" />

      <Build at={beats[3]} style={{ position: "absolute", left: PAD, top: 268, width: CH_W + 78 }}>
        <div style={{ position: "relative", marginLeft: 60 }}>
          {[1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6].map((v) => (
            <div key={v} style={{ position: "absolute", top: yOf(v), left: -8, width: CH_W + 8, height: 1, background: v === 1e-3 ? C.panelLine : C.panel, opacity: v === 1e-3 ? 1 : 0.9 }} />
          ))}
          {[1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6].map((v) => (
            <div key={"l" + v} style={{ position: "absolute", top: yOf(v) - 11, left: -66, width: 54, textAlign: "right", fontFamily: FONT.mono, fontSize: FT.micro, color: v === 1e-3 ? C.amber : C.inkFaint }}>
              {"1e" + Math.round(Math.log10(v))}
            </div>
          ))}
          <div style={{ position: "relative", height: CH_H }}>
            <div style={{ position: "absolute", left: 0, top: 0 }}><Line values={series("uncoded")} w={CH_W} h={CH_H} lo={LO} hi={HI} log color={C.inkFaint} at={beats[2]} dur={36} width={2.5} /></div>
            <div style={{ position: "absolute", left: 0, top: 0 }}><Line values={series("hard")} w={CH_W} h={CH_H} lo={LO} hi={HI} log color={C.amber} at={beats[3]} dur={36} width={2.5} /></div>
            <div style={{ position: "absolute", left: 0, top: 0 }}><Line values={series("soft")} w={CH_W} h={CH_H} lo={LO} hi={HI} log color={C.cyan} at={beats[4]} dur={36} width={3} /></div>
            {(["uncoded", "hard", "soft"] as const).map((k, si) => (
              <svg key={k} width={CH_W} height={CH_H} style={{ position: "absolute", left: 0, top: 0 }}>
                {DEMO.ber.map((p, i) => {
                  const v = p[k];
                  if (!v) return null;
                  return <circle key={i} cx={xOf(i)} cy={yOf(v)} r={3} fill={k === "soft" ? C.cyan : k === "hard" ? C.amber : C.inkFaint} />;
                })}
              </svg>
            ))}
            {DEMO.ber.map((p, i) => (
              <div key={"x" + i} style={{ position: "absolute", top: CH_H + 8, left: xOf(i) - 20, width: 40, textAlign: "center", fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>
                {p.ebn0Db}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26, textAlign: "center", fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            {"Eb/N0 (dB)"}
          </div>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 30 }}>
            {[
              { k: "不编码", c: C.inkFaint },
              { k: "硬判决维特比", c: C.amber },
              { k: "软判决维特比", c: C.cyan },
            ].map((l) => (
              <div key={l.k} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: l.c }} />
                <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkDim }}>{l.k}</div>
              </div>
            ))}
            <div style={{ fontFamily: FONT.mono, fontSize: FT.micro, color: C.inkFaint }}>{"纵轴：误比特率（对数）"}</div>
          </div>
        </div>
      </Build>

      <Build at={beats[6]} style={{ position: "absolute", right: PAD, top: 268, width: 560 }}>
        <Card label="千分之一处 / Eb/N0" accent={C.cyan} pad={22}>
          {[
            { k: "不编码", v: gain.uncodedDb, c: C.inkFaint },
            { k: "硬判决", v: gain.hardDb, c: C.amber },
            { k: "软判决", v: gain.softDb, c: C.cyan },
          ].map((r) => (
            <div key={r.k} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: r.c }} />
                <div style={{ fontFamily: FONT.sans, fontSize: FT.body, color: C.inkDim }}>{r.k}</div>
              </div>
              <Mono size={FT.num} color={r.c}>{r.v.toFixed(1) + " dB"}</Mono>
            </div>
          ))}
          <div style={{ fontFamily: FONT.sans, fontSize: FT.meta, color: C.inkFaint, marginTop: 14 }}>
            {"同样达到 1e-3，软判决比不编码少要 " + (gain.uncodedDb - gain.softDb).toFixed(1) + " dB 的功率"}
          </div>
        </Card>
      </Build>

      <Build at={beats[11]} style={{ position: "absolute", right: PAD, top: 640, width: 560 }}>
        <Card label="纠错 / 一帧 456 位里随机翻几位" accent={C.violet} pad={22}>
          {DEMO.frameRecovery.map((r) => (
            <div key={r.flips} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
              <Mono size={FT.meta} color={C.inkFaint} style={{ width: 56 }}>{r.flips + " 位"}</Mono>
              <div style={{ flex: 1, height: 10, borderRadius: 5, background: C.panelLine }}>
                <div style={{ width: (r.recoveredPct * 3.2).toFixed(0) + "px", height: 10, borderRadius: 5, background: r.recoveredPct > 50 ? C.cyan : C.coral }} />
              </div>
              <Mono size={FT.meta} color={C.ink}>{r.recoveredPct.toFixed(0) + "%"}</Mono>
            </div>
          ))}
          <div style={{ fontFamily: FONT.sans, fontSize: FT.micro, color: C.inkFaint, marginTop: 12 }}>
            {"硬判决维特比 · 每档 3000 帧 · 随机位置"}
          </div>
        </Card>
      </Build>

      <Build at={beats[13]} style={{ position: "absolute", left: PAD, top: 860, width: 1120 }}>
        <Mono size={FT.micro} color={C.inkFaint}>
          {"Python 复现：速率 1/2、K=5、G0=19、G1=27；BPSK/AWGN；每点 4000 帧（" + DEMO.meta.berFramesPerPoint * 189 + " 个信息比特）；软判决用相关度量"}
        </Mono>
      </Build>
    </Scene>
  );
};