import React from "react";
import { Build } from "../../design/primitives";
import { C, FONT, FT } from "../../design/tokens";
import { Body, Card, Chip, K, Mono, PAD, Pages, Scene, SceneHead, lf } from "../shared";

/** 定义：Holt 两式、加法/乘法 Holt-Winters 各三式，以及初始化。 */
export const SDefinitions: React.FC = () => {
  const id = "definitions";
  const b = (k: number) => lf(id, k);
  return (
    <Scene id={id}>
      <SceneHead id={id} />
      <Pages id={id} at={[0, 0.28, 0.55, 0.78]}>
        {/* 1 · Holt */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 248, width: 860 }}>
            <Build at={b(0.01)}>
              <Card label="式 2.17 · 水平" accent={C.amber} pad={24} style={{ width: 860, height: 210 }}>
                <Mono size={FT.math} color={C.ink}>s_t = α · x_t + (1 − α) · (s_{"{t−1}"} + b_{"{t−1}"})</Mono>
                <Body size={FT.body} style={{ marginTop: 16 }}>比一次平滑多了一项 b：上一刻的趋势。</Body>
              </Card>
            </Build>
            <Build at={b(0.04)}>
              <Card label="式 2.18 · 趋势" accent={C.cyan} pad={24} style={{ width: 860, height: 210, marginTop: 22 }}>
                <Mono size={FT.math} color={C.ink}>b_t = β · (s_t − s_{"{t−1}"}) + (1 − β) · b_{"{t−1}"}</Mono>
                <Body size={FT.body} style={{ marginTop: 16 }}>先算 s_t，再用新的 s_t 算 b_t；顺序不能反。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 248, width: 876 }}>
            <Build at={b(0.06)}>
              <Card label="式 2.19 / 2.20 · 初始化" accent={C.violet} pad={24} style={{ width: 876, height: 442 }}>
                <Mono size={FT.mono} color={C.ink}>s_0 = mean(x_1 … x_n)</Mono>
                <div style={{ marginTop: 12 }}><Mono size={FT.mono} color={C.ink}>b_0 = mean(x_{"{i+1}"} − x_i)，i = 1 … n−1</Mono></div>
                <Body size={FT.body} style={{ marginTop: 18 }}>n 默认取三；不给 b_0、又不够三个点，返回 HoltMissingInit。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>初值不是随便给的：它的影响会随 (1−α) 的幂衰减，开头几步的拟合因此不同。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.violet}>初值是一条边界，不是一个细节</Chip></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 714, width: 1776 }}>
            <Build at={b(0.09)}>
              <Card accent={C.inkFaint} pad={18} style={{ width: 1776, height: 100 }}>
                <Body size={FT.body}>两行递推、三个参数：α 管水平，β 管趋势，n 只管开头。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 2 · 加法 HW */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 244, width: 900 }}>
            <Build at={b(0.3)}>
              <Card label="加法 Holt-Winters · 式 2.21 到 2.26" accent={C.cyan} pad={24} style={{ width: 900, height: 430 }}>
                <div style={{ lineHeight: 2.15 }}>
                  <Mono size={FT.mono} color={C.ink}>s_t = α (x_t − p_{"{t−L}"}) + (1−α)(s_{"{t−1}"} + b_{"{t−1}"})</Mono>
                  <div />
                  <Mono size={FT.mono} color={C.ink}>b_t = β (s_t − s_{"{t−1}"}) + (1−β) b_{"{t−1}"}</Mono>
                  <div />
                  <Mono size={FT.mono} color={C.ink}>p_t = γ (x_t − s_{"{t−1}"} − b_{"{t−1}"}) + (1−γ) p_{"{t−L}"}</Mono>
                </div>
                <Body size={FT.body} style={{ marginTop: 16 }}>季节项 p 减掉之后，水平只负责剩余的部分；这是「加法」的含义。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 244, width: 836 }}>
            <Build at={b(0.34)}>
              <Card label="式 2.24 到 2.26 · 初始化" accent={C.violet} pad={24} style={{ width: 836, height: 430 }}>
                <Mono size={FT.mono} color={C.ink}>s_0 = mean(x_1 … x_L)</Mono>
                <div style={{ marginTop: 12 }}><Mono size={FT.mono} color={C.ink}>b_0 = mean(x_{"{L+1}"} … x_{"{2L}"}) − s_0</Mono></div>
                <div style={{ marginTop: 12 }}><Mono size={FT.mono} color={C.ink}>p_i = x_i − s_0，i = 1 … L</Mono></div>
                <Body size={FT.body} style={{ marginTop: 18 }}>所以序列至少要两个 L 长；不够长直接报错，不许猜。</Body>
                <div style={{ marginTop: 12 }}><Chip color={C.coral}>TwoShortL · 长度不够就是错误</Chip></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 714, width: 1776 }}>
            <Build at={b(0.38)}>
              <Card accent={C.cyan} pad={18} style={{ width: 1776, height: 100 }}>
                <Body size={FT.body}>三个状态、三个旋钮、一个周期；加法的季节项单位，和原序列相同。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 3 · 乘法 HW */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 244, width: 900 }}>
            <Build at={b(0.57)}>
              <Card label="乘法 Holt-Winters · 式 2.27 到 2.33" accent={C.coral} pad={24} style={{ width: 900, height: 430 }}>
                <div style={{ lineHeight: 2.15 }}>
                  <Mono size={FT.mono} color={C.ink}>s_t = α (x_t / p_{"{t−L}"}) + (1−α)(s_{"{t−1}"} + b_{"{t−1}"})</Mono>
                  <div />
                  <Mono size={FT.mono} color={C.ink}>b_t = β (s_t − s_{"{t−1}"}) + (1−β) b_{"{t−1}"}</Mono>
                  <div />
                  <Mono size={FT.mono} color={C.ink}>p_t = γ (x_t / (s_{"{t−1}"} + b_{"{t−1}"})) + (1−γ) p_{"{t−L}"}</Mono>
                </div>
                <Body size={FT.body} style={{ marginTop: 16 }}>两处除法；任何一个分母小于等于零，结果没有定义。</Body>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 940, top: 244, width: 836 }}>
            <Build at={b(0.61)}>
              <Card label="式 2.30 到 2.33 · 初始化" accent={C.violet} pad={24} style={{ width: 836, height: 430 }}>
                <Mono size={FT.mono} color={C.ink}>s_0 = mean(x_1 … x_L)</Mono>
                <div style={{ marginTop: 12 }}><Mono size={FT.mono} color={C.ink}>b_0 = mean(x_{"{L+1}"} … x_{"{2L}"}) − s_0</Mono></div>
                <div style={{ marginTop: 12 }}><Mono size={FT.mono} color={C.ink}>p_i = (x_i / s_0) / mean(x / s_0)</Mono></div>
                <Body size={FT.body} style={{ marginTop: 18 }}>先按水平归一，再把季节项的均值校成 1；乘法的季节是倍数。</Body>
                <div style={{ marginTop: 12 }}><Chip color={C.coral}>p 的均值是 1，不是一个细节</Chip></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 714, width: 1776 }}>
            <Build at={b(0.65)}>
              <Card accent={C.coral} pad={18} style={{ width: 1776, height: 100 }}>
                <Body size={FT.body}>书里没写周期归一化；长序列上季节项会漂，我们的做法是每 L 步校一次。</Body>
              </Card>
            </Build>
          </div>
        </div>

        {/* 4 · 归一化 */}
        <div>
          <div style={{ position: "absolute", left: PAD, top: 250, width: 860 }}>
            <Build at={b(0.8)}>
              <Card label="本仓补充 · 周期归一化" accent={C.cyan} pad={24} style={{ width: 860, height: 400 }}>
                <Body size={FT.body} color={C.ink}>加法：最近 L 个 p 去均值，均值加回水平。</Body>
                <Body size={FT.body} style={{ marginTop: 10 }}>乘法：最近 L 个 p 除以均值归一，水平与趋势同乘这个均值。</Body>
                <Body size={FT.body} style={{ marginTop: 18 }}>两种调整都不改变下一步预测：加回去的均值，正好抵消。</Body>
                <div style={{ marginTop: 14 }}><Chip color={C.cyan}>测试专门钉住「预测不变」</Chip></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD + 900, top: 250, width: 876 }}>
            <Build at={b(0.83)}>
              <Card label="为什么不校就会漂" accent={C.amber} pad={24} style={{ width: 876, height: 400 }}>
                <Body size={FT.body} color={C.ink}>浮点误差会让季节项整体缓慢移动；水平跟着补偿，误差看起来不大，但状态已经漂了。</Body>
                <Body size={FT.body} style={{ marginTop: 12 }}>归一化把「季节项的参考点」钉回零或一，长序列才可复现。</Body>
                <div style={{ marginTop: 14 }}><K>这是实现选择，不是书本公式；SELF-AUTH 里写明</K></div>
              </Card>
            </Build>
          </div>
          <div style={{ position: "absolute", left: PAD, top: 700, width: 1776 }}>
            <Build at={b(0.87)}>
              <Card accent={C.violet} pad={18} style={{ width: 1776, height: 104 }}>
                <Body size={FT.body}>公式到此为止。下一页看每个旋钮实际管什么，以及坏的时候长什么样。</Body>
              </Card>
            </Build>
          </div>
        </div>
      </Pages>
    </Scene>
  );
};
