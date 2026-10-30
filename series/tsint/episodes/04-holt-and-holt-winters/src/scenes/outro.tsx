import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, Mono, PAD, Pages, Scene, SceneHead, lf } from "../shared";

/** 收尾：回到三个数，预告平稳化。 */
export const SOutro: React.FC = () => {
  const id = "outro";
  const b = (k: number) => lf(id, k);
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.5]}>
        {/* 1 · 三个数 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>回到开头三个数，再加一句判断。</Body>
          </div>
          {[
            { l: "水平 s3", v: "13.28125", s: "三步之后的状态", c: C.amber },
            { l: "趋势 b3", v: "1.296875", s: "单位：元 / 天", c: C.cyan },
            { l: "预测 ŷ4", v: "14.578125", s: "s3 + b3", c: C.violet },
          ].map((x, i) => (
            <div key={x.l} style={{ position: "absolute", left: PAD + i * 608, top: 340, width: 560 }}>
              <Build at={b(0.02 + i * 0.04)}>
                <Card label={x.l} accent={x.c} pad={22} style={{ width: 560, height: 168 }}>
                  <div style={{ fontFamily: FONT.mono, fontSize: FT.num, color: x.c, lineHeight: 1 }}>{x.v}</div>
                  <Body size={FT.meta} style={{ marginTop: 12 }}>{x.s}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 600, width: 1776 }}>
            <Build at={b(0.16)}>
              <Card accent={C.coral} pad={24} style={{ width: 1776, height: 190 }}>
                <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>先问数据能不能除，再问模型准不准。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>加法与乘法的分界是除法；真实数据有零，就必须有保护分支。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 预告 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 262, width: 1776 }}>
            <Body color={C.ink} size={FT.lead}>下一集：平稳化。差分、对数、去趋势，三条路。</Body>
          </div>
          {[
            { t: "差分", s: "把趋势变成水平", c: C.amber },
            { t: "对数", s: "把乘法变成加法", c: C.cyan },
            { t: "去趋势", s: "先拟合，再减去", c: C.violet },
          ].map((x, i) => (
            <div key={x.t} style={{ position: "absolute", left: PAD + i * 608, top: 350, width: 560 }}>
              <Build at={b(0.54 + i * 0.04)}>
                <Card label={"路径 " + (i + 1)} accent={x.c} pad={22} style={{ width: 560, height: 240 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: x.c }}>{x.t}</div>
                  <Body size={FT.body} style={{ marginTop: 10 }}>{x.s}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 640, width: 1776 }}>
            <Build at={b(0.68)}>
              <Card accent={C.inkFaint} pad={22} style={{ width: 1776, height: 140 }}>
                <Body size={FT.body}>这一集的所有数字都在证据里：ch2-holt 与 ch2-holtwinters，二十四条检查。</Body>
                <div style={{ marginTop: 10 }}><Chip color={C.cyan}>下次见</Chip></div>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
