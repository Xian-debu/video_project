import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { PAD, M, md, pagesOf, Pages, Scene, SceneHead, Card, Row, Body, LinePlot, CodeBlock, Strip, Verdict, fmtInt } from "../shared";

const idx = (n: number) => Array.from({ length: n }, (_, i) => i);

export const SIntuition: React.FC = () => {
  const at = pagesOf("intuition");
  const sbt = M.series.sbtScore;
  const attn = M.series.attnScore;
  const tv = M.series.tvaeScore;
  const ga = M.series.gaussScore;
  const dc = M.series.dcdScore;
  const pa = M.series.patchAeScore;
  return (
    <Scene id="intuition">
      <SceneHead id="intuition" />
      <Pages id="intuition" at={at}>
        {/* 页一：SBT 打平 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 44, color: C.ink }}>切掉一半连接，分数几乎不动。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              二值稀疏注意力和同结构的稠密基线，整条测试段分数几乎重合。掩码没有把信号切掉，也没有把噪声挡在外面。两条线贴在一起，F1 也只差千分之二。
            </Body>
            <div style={{ marginTop: 24 }}>
              <Row name="SBT" value={md("sbt").f1.toFixed(4)} note={"验证段 " + md("sbt").f1Val.toFixed(4) + "，阈值 " + md("sbt").tau.toFixed(3)} color={C.cyan} />
              <Row name="稠密基线" value={md("attn").f1.toFixed(4)} note={"验证段 " + md("attn").f1Val.toFixed(4) + "，阈值 " + md("attn").tau.toFixed(3)} />
              <Row name="差" value="0.0022" note="小于一个百分点的打平线" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 300, width: 830 }}>
            <Card label="测试段分数（两条线几乎重合）" accent={C.cyan} pad={20}>
              <LinePlot
                width={760}
                height={330}
                series={[
                  { name: "SBT", color: C.cyan, values: sbt },
                  { name: "稠密", color: C.inkDim, values: attn },
                ]}
                yMin={0}
                hlines={[{ v: md("sbt").tau, color: C.coral, label: "阈值" }]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：TVAE 重尾 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 44, color: C.ink }}>重尾让分数在测试段更稳。</div>
            <Body style={{ marginTop: 20, width: 850 }}>
              高斯先验的分数在验证段偏高、测试段偏低，t 先验的分数整段抬高。同样是验证段挑阈值，t 的阈值搬到测试段还能用，高斯的搬过去就报得更多。
            </Body>
            <div style={{ marginTop: 24 }}>
              <Row name="TVAE" value={md("tvae").f1.toFixed(4)} note={"验证段 " + md("tvae").f1Val.toFixed(4)} color={C.violet} />
              <Row name="高斯 VAE" value={md("gauss").f1.toFixed(4)} note={"验证段 " + md("gauss").f1Val.toFixed(4)} />
              <Row name="提升" value="+61%" note="0.2097 对 0.1301" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1030, top: 300, width: 820 }}>
            <Card label="测试段分数（t 先验整段更高）" accent={C.violet} pad={20}>
              <LinePlot
                width={750}
                height={330}
                series={[
                  { name: "TVAE", color: C.violet, values: tv },
                  { name: "高斯", color: C.inkDim, values: ga },
                ]}
                yMin={0}
                hlines={[{ v: md("tvae").tau, color: C.coral, label: "阈值" }]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：DCD 双视图 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 282, width: 880 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 44, color: C.ink }}>双视图把异常整段顶起来。</div>
            <Body style={{ marginTop: 20, width: 840 }}>
              DCdetector 的对比损失在注入窗口整段抬高，单视图 patch-AE 只有零星几个尖刺。形态替换和相位翻转，单视图看不到差别，双视图能看到。
            </Body>
            <div style={{ marginTop: 24 }}>
              <Row name="DCdetector" value={md("dcd").f1.toFixed(4)} note={"验证段 " + md("dcd").f1Val.toFixed(4)} color={C.amber} />
              <Row name="patch-AE" value={md("patchAe").f1.toFixed(4)} note={"验证段 " + md("patchAe").f1Val.toFixed(4)} />
              <Row name="提升" value="2.13 倍" note="0.2409 对 0.1130" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1010, top: 300, width: 840 }}>
            <Card label="测试段分数（双视图整段更高）" accent={C.amber} pad={20}>
              <LinePlot
                width={770}
                height={330}
                series={[
                  { name: "DCdetector", color: C.amber, values: dc },
                  { name: "patch-AE", color: C.inkDim, values: pa },
                ]}
                yMin={0}
                hlines={[{ v: md("dcd").tau, color: C.coral, label: "阈值" }]}
              />
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};

export const SImplementation: React.FC = () => {
  const at = pagesOf("implementation");
  return (
    <Scene id="implementation">
      <SceneHead id="implementation" />
      <Pages id="implementation" at={at}>
        {/* 页一：模块 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 44, color: C.ink }}>三个模块，八百零一行。</div>
            <Body style={{ marginTop: 20, width: 850 }}>
              SBT、TVAE、DCdetector 各自一个文件，共享 VAE 的编码器和矩阵工具。不引线性代数库，反向传播与蒙特卡洛采样手写。
            </Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 26 }}>
              <Card label="Ch04/SBT.hs" accent={C.cyan} pad={16}>
                <Row name="行数" value="314" />
                <Row name="测试" value="14 条" />
              </Card>
              <Card label="Ch04/TVAE.hs" accent={C.violet} pad={16}>
                <Row name="行数" value="227" />
                <Row name="测试" value="18 条" />
              </Card>
              <Card label="Ch04/DCDetector.hs" accent={C.amber} pad={16}>
                <Row name="行数" value="260" />
                <Row name="测试" value="23 条" />
              </Card>
            </div>
            <div style={{ marginTop: 18 }}>
              <Row name="合计" value="801 行 · 55 条测试" note="新增断言，全部在新文件里" color={C.cyan} />
              <Row name="依赖" value="纯 Haskell" note="VAE 复用上一集的编码器与反向传播" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1050, top: 296, width: 810 }}>
            <CodeBlock
              title="核心入口（纯函数）"
              width={770}
              lines={[
                { t: "sbtRecon :: SBTCfg -> Matrix -> Vector Double", hi: true },
                { t: "tvaeScore :: TVAECfg -> Matrix -> Vector Double", hi: true },
                { t: "dcdetectorScore :: DCCfg -> Matrix -> Vector Double", hi: true },
                { t: "" },
                { t: "baseline: attnCfg = cfg { scBinary = False }", dim: true },
                { t: "baseline: gaussScore = tvaegaussScore vaeCfg", dim: true },
                { t: "baseline: patchAe = AE trained on patches", dim: true },
              ]}
            />
            <Body style={{ marginTop: 12, fontSize: FT.meta, color: C.inkDim }}>三个方法同签名：吃一段窗口矩阵，吐一个分数向量。</Body>
          </div>
        </AbsoluteFill>

        {/* 页二：内存事故 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 44, color: C.ink }}>一次内存事故：注意力把十二吉吃满。</div>
            <Body style={{ marginTop: 20, width: 850 }}>
              SBT 每个窗口都要算一张一百乘一百的注意力矩阵，三十轮乘两千个窗口很快把容器打到上限。进程被杀，退出码一百三十七。修法不是加内存，是把训练窗口按每五个取一个抽样，分数仍在全量窗口上算。
            </Body>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 26 }}>
              <Card label="事故现场" accent={C.coral} pad={18}>
                <Row name="上限" value="12 GB" />
                <Row name="退出码" value="137" color={C.coral} />
                <Row name="单轮耗时" value="98 s" />
              </Card>
              <Card label="修法" accent={C.cyan} pad={18}>
                <Row name="训练窗" value="417" note="每五个取一个" />
                <Row name="轮次" value="10" />
                <Row name="一次证据跑" value="402 s" color={C.cyan} />
              </Card>
            </div>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 296, width: 820 }}>
            <CodeBlock
              title="训练抽样（抽样只在训练侧）"
              width={770}
              lines={[
                { t: "fitSub = V.fromList [ w | (i, w) <- zip [0..] ws, i mod 5 == 0 ]" },
                { t: "scores = V.map (sbtRecon cfg) valW ++ V.map (sbtRecon cfg) testW", dim: true },
                { t: "-- 分数不抽样，读数才可比", dim: true },
              ]}
            />
            <Card label="教训" accent={C.amber} pad={18} style={{ marginTop: 16 }}>
              <Body style={{ fontSize: FT.meta }}>
                注意力类模型的成本在窗口长度的平方。窗口一百点时，代价不在单次前向，在轮次乘窗口数。先量单轮耗时，再定轮次。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：两个 bug */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 44, color: C.ink }}>两个 bug，都藏在一个等号里。</div>
            <Body style={{ marginTop: 20, width: 850 }}>
              第一个：STE 往回传梯度时多乘了一个符号函数，负权重的梯度被翻号，二值权重越训越偏。第二个：输出层初始化成零向量，投影梯度恒为零，整组权重从头到尾没动过。两个都不报错，读数只是「没提升」。
            </Body>
            <div style={{ marginTop: 24 }}>
              <Row name="bug 一" value="signum(W) 乘进梯度" note="负权重反方向走，检查表里二值集仍然通过" color={C.coral} />
              <Row name="bug 二" value="输出层零初始化" note="梯度恒零，权重动了但看不出" color={C.coral} />
              <Row name="修法" value="直通 + 随机小初始化" note="两条都用同一条检查钉住：权重必须真的移动" color={C.cyan} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 300, width: 820 }}>
            <CodeBlock
              title="STE 与初始化（修好之后）"
              width={770}
              lines={[
                { t: "-- 反向：原样直通，不乘符号", dim: true },
                { t: "dwq = dwq0; dwk = dwk0; dwv = dwv0; dwo = dwo0", hi: true },
                { t: "-- 初始化：输出层给一个小的随机量", dim: true },
                { t: "smWr = V.generate d (randUniform (s+41+i))", hi: true },
              ]}
            />
            <Card label="怎么发现的" accent={C.violet} pad={18} style={{ marginTop: 16 }}>
              <Body style={{ fontSize: FT.meta }}>
                训练后权重和初始化逐位相同。检查表里所有损失都在降，只有「权重移动」这一条过不去。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：冻结与因果 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 900 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: 44, color: C.ink }}>掩码是数据，不是参数。</div>
            <Body style={{ marginTop: 20, width: 850 }}>
              掩码在训练开始前采样，之后当常量用。因果掩码只管时间：第 t 个点看得到一到 t，看不到任何未来。两条都用单测钉住：训练前后掩码逐位相同；把未来点改成一亿，前面位置的输出不变。
            </Body>
            <div style={{ marginTop: 24 }}>
              <Row name="掩码冻结" value="训练前后逐位相同" note="检查表 mask frozen" color={C.cyan} />
              <Row name="因果" value="未来扰动不影响过去" note="位置十和位置五的输出在容差内不变" />
              <Row name="掩码率" value="0.625" note="因果让一部分位置本来就看不了" />
            </div>
          </div>
          <div style={{ position: "absolute", left: 1040, top: 300, width: 820 }}>
            <CodeBlock
              title="因果掩码（位置 t 只允许 j <= t）"
              width={770}
              lines={[
                { t: "causal t j = if j > t then 0 else 1", hi: true },
                { t: "mask = zipWith (*) sampled causal" },
                { t: "-- 采样后冻结：mask 只在 init 里生成一次", dim: true },
              ]}
            />
            <Card label="注意" accent={C.amber} pad={18} style={{ marginTop: 16 }}>
              <Body style={{ fontSize: FT.meta }}>
                位置零只能看自己：它的分数退化成重建误差。这不是 bug，是因果注意力的边界，读数时要在验证段体现。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
