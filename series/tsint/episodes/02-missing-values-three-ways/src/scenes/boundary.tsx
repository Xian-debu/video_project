import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Card, Body, Mono, K, PAD, Pages, Scene, SceneHead, M, lf } from "../shared";

/** 边界：七条不能说的话。 */
export const SBoundary: React.FC = () => {
  const id = "boundary";
  const b = (k: number) => lf(id, k);
  const items = [
    { t: "均值填充只适合平稳段", s: "有趋势的序列，均值会系统性偏移" },
    { t: "末值填充会压方差", s: "也会制造零收益" },
    { t: "线性插值假设直线路径", s: "跳空缺口会被低估" },
    { t: "价格口径的误差依赖价格水平", s: "同一只股票，早期价格低，误差也小" },
    { t: "停牌不是缺失", s: "删掉停牌行，会引入样本选择偏误" },
    { t: "遮挡是人为的", s: "真实缺失机制可能非随机：收盘价缺失常和波动有关" },
    { t: "20% 只是压力测试", s: "真实数据里 25 个点缺 1 个已经很糟" },
  ];
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.55]}>
        <div>
          {items.slice(0, 4).map((it, i) => (
            <div key={it.t} style={{ position: "absolute", left: PAD + (i % 2) * 900, top: 290 + Math.floor(i / 2) * 230, width: 860 }}>
              <Build at={b(0.03 + i * 0.03)}>
                <Card accent={i === 3 ? C.amber : C.coral} pad={20} style={{ width: 860, height: 200 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                    <Mono size={FT.h1} color={i === 3 ? C.amber : C.coral}>0{i + 1}</Mono>
                    <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>{it.t}</Body>
                  </div>
                  <Body size={FT.body} style={{ marginTop: 14 }}>{it.s}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 780, width: 1776 }}>
            <Build at={b(0.2)}>
              <Body size={FT.body} color={C.inkDim}>前四条是方法本身的边界；第五条是数据层的边界。</Body>
            </Build>
          </div>
        </div>
        <div>
          {items.slice(4).map((it, i) => (
            <div key={it.t} style={{ position: "absolute", left: PAD, top: 286 + i * 196, width: 1776 }}>
              <Build at={b(0.58 + i * 0.04)}>
                <Card accent={C.violet} pad={18} style={{ width: 1776, height: 168 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                    <Mono size={FT.h2} color={C.violet}>0{i + 5}</Mono>
                    <Body color={C.ink} size={FT.h2} style={{ fontFamily: FONT.serif }}>{it.t}</Body>
                  </div>
                  <Body size={FT.body} style={{ marginTop: 12, paddingLeft: 62 }}>{it.s}</Body>
                </Card>
              </Build>
            </div>
          ))}
          <div style={{ position: "absolute", left: PAD, top: 900, width: 1776 }}>
            <Build at={b(0.78)}>
              <Body size={FT.body}>结论只在三种填法之间成立，不构成对别的插值方法的评价。</Body>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
