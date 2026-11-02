import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, Formula, Verdict, CodeBlock, Stat, fmtInt, fmtP } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = pagesOf("definitions");
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        {/* 页一：SBT 三步 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.display, color: C.ink, lineHeight: 1.2 }}>先切连接，再定权重。</div>
            <Body style={{ marginTop: 24, width: 840 }}>
              SBT 不是又一种注意力，是把注意力拆成两个可以单独验证的动作：连接先切一半、样本化后冻结；保留下来的权重只取正一、零、负一。
            </Body>
            <Formula size={30} color={C.cyan} style={{ marginTop: 26 }}>
              A<sub>t</sub> = softmax((Q K<sup>T</sup> / sqrt(d)) M<sub>t</sub> + C)
            </Formula>
            <Body style={{ marginTop: 14, fontSize: FT.meta, color: C.inkDim }}>
              M 是二值掩码矩阵，C 是因果掩码：第 t 个点只看一到 t。两个掩码相乘，未来位置永远不会被看到。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 288, width: 820 }}>
            <Card label="三个动作，各自可验" accent={C.cyan} pad={22}>
              <Row name="一 · 采样掩码" value="p = 0.5" note="每个位置独立伯努利，采样后冻结" />
              <Row name="二 · 二值权重" value="{-1, 0, +1}" note="前向取符号，反向原样直通（STE）" />
              <Row name="三 · 因果" value="j <= t" note="位置一对零，位置二以后全零" color={C.cyan} />
              <Body style={{ marginTop: 12, fontSize: FT.meta, color: C.inkDim }}>
                实测掩码率 0.625：因果让一部分位置本来就没连接。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：TVAE 分数 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 870 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 46, color: C.ink }}>先验换成 t，分数换成蒙特卡洛。</div>
            <Body style={{ marginTop: 22, width: 840 }}>
              高斯 VAE 的 KL 有闭式，t 先验没有，所以分数改成对八次采样取平均：重建误差加上对数后验减对数先验。
            </Body>
            <Formula size={26} color={C.violet} style={{ marginTop: 24 }}>
              s(x) = E<sub>q</sub>[ rec(x, z) + log q(z|x) - log t<sub>5</sub>(z) ]
            </Formula>
            <div style={{ marginTop: 22, display: "flex", gap: 18 }}>
              <Stat label="先验自由度" value="5" sub="nu 固定，不参与调参" valueColor={C.violet} />
              <Stat label="采样次数" value="8" sub="逐窗确定性种子" valueColor={C.violet} />
              <Stat label="p(0) 当 nu=1" value="1/π" sub="0.3183098861837909" valueSize={30} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 296, width: 840 }}>
            <Card label="为什么需要重尾" accent={C.violet} pad={24}>
              <Body>
                高斯先验下，一个五倍标准差的跳空贡献的负对数似然近似二次增长；t 先验只有对数增长。跳空被当成异常，是因为先验把尾巴写短了。
              </Body>
              <Body style={{ marginTop: 12, fontSize: FT.meta, color: C.inkDim }}>
                书里只给名字和一句「用 Student-t」；重参数化、采样、黄金值都是本集补的。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：DCdetector */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 860 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 46, color: C.ink }}>同一个窗口，两种读法。</div>
            <Body style={{ marginTop: 22, width: 830 }}>
              两个视图不是加噪声，是换切法：一个按特征方向切 patch，一个按样本方向整段重排。同一窗口的两视图互为正样本，别的窗口都是负样本。
            </Body>
            <Formula size={26} color={C.amber} style={{ marginTop: 24 }}>
              L = -log( exp(s<sub>+</sub>/tau) / (exp(s<sub>+</sub>/tau) + sum<sub>j</sub> exp(s<sub>j</sub><sup>-</sup>/tau)) )
            </Formula>
            <Body style={{ marginTop: 12, fontSize: FT.meta, color: C.inkDim }}>
              温度 tau 取零点一。相似度全相等时，损失精确等于 log(负样本数加一)。
            </Body>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 296, width: 840 }}>
            <Card label="书里的原句" accent={C.amber} pad={24}>
              <Body>「同一窗口的不同视图互为正样本」——一句直觉，三种实现都对。这一集钉死成：特征方向切 patch 加样本方向重排。</Body>
            </Card>
            <div style={{ marginTop: 18 }}>
              <CodeBlock
                title="dcdRowLoss（完整式）"
                width={780}
                lines={[
                  { t: "dcdRowLoss cfg model w = " },
                  { t: "  let (za, zb) = dcdViews (encoder w)", dim: true },
                  { t: "      negs = map (encode . other) (others w)", dim: true },
                  { t: "  in contrastiveLoss tau (sim za zb) negs", hi: true },
                ]}
              />
            </div>
          </div>
        </AbsoluteFill>

        {/* 页四：约定 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 286, width: 1730 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 44, color: C.ink }}>五条数值约定，缺一条读数就不可复现。</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 30 }}>
              <Card label="一 · 掩码训练前采样，之后冻结" accent={C.cyan} pad={20}>
                <Body style={{ fontSize: FT.meta }}>掩码在训练开始前一次采好，训练全程不改。模型学的是这组固定连接上的权重。</Body>
              </Card>
              <Card label="二 · 推断里没有随机数" accent={C.violet} pad={20}>
                <Body style={{ fontSize: FT.meta }}>TVAE 的八次采样由窗口下标和种子决定，逐窗可复现。同一窗口两次打分必须逐位相同。</Body>
              </Card>
              <Card label="三 · 先验自由度固定" accent={C.amber} pad={20}>
                <Body style={{ fontSize: FT.meta }}>nu 等于五，不做网格搜索。换 nu 只作为敏感性分析，不进主读数。</Body>
              </Card>
              <Card label="四 · 温度固定" accent={C.coral} pad={20}>
                <Body style={{ fontSize: FT.meta }}>tau 等于零点一。书里写「小温度」，本集取一个数钉死，不按验证段调。</Body>
              </Card>
            </div>
            <div style={{ marginTop: 22 }}>
              <Card label="五 · 阈值只在验证段挑" accent={C.cyan} pad={20}>
                <Body style={{ fontSize: FT.meta }}>六个模型同一条规则：验证段扫阈值取 F1 最大，搬到测试段不再改。测试段的每个点都不参与调参。</Body>
              </Card>
            </div>
          </div>
        </AbsoluteFill>

      </Pages>
    </Scene>
  );
};
