import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, Formula,
  fmt4, fmt2, fmtInt,
} from "../shared";
import { ConvKernelFig, DimChainFig, ResBlockFig } from "../figs";

const cv = M.conv;
const md = M.models;
const rs = M.residual;

export const SProblem: React.FC = () => {
  const at = pagesOf("problem");
  return (
    <Scene id="problem">
      <SceneHead id="problem" />
      <Pages id="problem" at={at}>
        {/* 页一：拉平丢位置 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              拉平之后，
              <br />
              位置就没了。
            </div>
            <Body style={{ marginTop: 20, width: 740 }}>
              最直接的做法是把 300 个数拉平，接全连接。三个类共 900 个权重，本集的线性对照就是这么干的，测试 {fmt4(md.linear.testAcc)}。问题不在参数量，在位置：第 3 天的数和第 40 天的数，在拉平之后是两个无关的分量。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.inkDim}>线性 {fmt4(md.linear.testAcc)}</Chip>
              <Chip color={C.coral}>局部形状被拆散</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 850, top: 292, width: 1000 }}>
            <Card label="同一条窗口，两种看法" accent={C.coral} pad={20}>
              <svg width={950} height={250} style={{ display: "block" }}>
                <text x={0} y={20} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"序列：60 步 × 5 通道"}</text>
                {Array.from({ length: 60 }).map((_, i) => (
                  <rect key={i} x={i * 15.6} y={36} width={13} height={26} rx={2} fill={i === 2 || i === 39 ? "rgba(251,113,133,0.55)" : C.panelLine} />
                ))}
                <text x={2 * 15.6} y={80} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.tiny}>d3</text>
                <text x={39 * 15.6} y={80} fill={C.coral} fontFamily={FONT.mono} fontSize={FT.tiny}>d40</text>
                <text x={0} y={118} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"拉平后：两个数各占一个位置，谁也不认识谁"}</text>
                {Array.from({ length: 60 }).map((_, i) => (
                  <rect key={"f" + i} x={i * 15.6} y={132} width={13} height={26} rx={2} fill={i === 2 || i === 39 ? "rgba(251,113,133,0.35)" : C.panel} stroke={C.panelLine} strokeWidth={0.6} />
                ))}
                <text x={0} y={196} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"卷积：核长 8 的窗口一起看，相邻八天的形状被同一个核认出来"}</text>
                {Array.from({ length: 8 }).map((_, i) => (
                  <rect key={"w" + i} x={i * 15.6} y={210} width={13} height={22} rx={2} fill="rgba(94,234,212,0.55)" />
                ))}
                <text x={9 * 15.6} y={228} fill={C.cyan} fontFamily={FONT.mono} fontSize={FT.tiny}>{"一个核，53 个位置"}</text>
              </svg>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：核滑过去 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 720 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              八个参数，
              <br />
              用五十三次。
            </div>
            <Body style={{ marginTop: 20, width: 700 }}>
              取一个长 {cv.k} 的小核，在整条序列上滑动。同一个核用 53 次，参数只有八个，不是三百个。它学的是「局部形状」而不是「第几天」：形状出现在哪一段，都能被同一个核认出来。这叫平移共享。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>核长 {cv.k}</Chip>
              <Chip color={C.amber}>53 次共享</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 800, top: 296, width: 1020 }}>
            <Card label="一次卷积：核 [1, 0, −1] 滑过四个点" accent={C.cyan} pad={22}>
              <ConvKernelFig width={950} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：维度账 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 740 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              一层一层，
              <br />
              算到二百八十八。
            </div>
            <Body style={{ marginTop: 20, width: 720 }}>
              60 过一遍长 {cv.k} 的核变 53；池化减半变 26；再过一遍变 19；再池化变 9。九个位置、每个三十二通道，展平 {cv.flat}。数目和输入差不多，但含义完全不同：原来一天一个数，现在一个位置一小段形状。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>长度 {cv.dims.join(" → ")}</Chip>
              <Chip color={C.amber}>通道 5 → 16 → 32</Chip>
              <Chip color={C.violet}>展平 {cv.flat}</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 830, top: 292, width: 1000 }}>
            <Card label="通道数：5 → 16 → 32" accent={C.amber} pad={22}>
              <DimChainFig width={940} />
              <div style={{ height: 10 }} />
              <MiniTable
                head={["步骤", "核", "输出长度", "通道"]}
                rows={[
                  ["输入", "—", "60", "5"],
                  ["卷积一", "k=8", "53", "16"],
                  ["池化一", "2", "26", "16"],
                  ["卷积二", "k=8", "19", "32"],
                  ["池化二", "2", "9", "32"],
                ]}
                colW={[180, 150, 180, 120]}
                width={720}
                rowH={34}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：残差没加分 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 290, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              加深，
              <br />
              没有换来更强。
            </div>
            <Body style={{ marginTop: 20, width: 760 }}>
              残差块给梯度留一条直路：输出等于输入加残差。书里说这让深层能训起来。我们照着做四块，测试 {fmt4(rs.deepAcc)}；只做一块，{fmt4(rs.shallowAcc)}。深的反倒低了 {fmt4(-rs.deepMinusShallowPp, 1)} 个百分点。这条预期，在这批数据上没站住。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.violet}>四块 {fmt4(rs.deepAcc)}</Chip>
              <Chip color={C.amber}>一块 {fmt4(rs.shallowAcc)}</Chip>
              <Chip color={C.coral}>{fmt4(rs.deepMinusShallowPp, 1)} pp</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 288, width: 960 }}>
            <Card label="残差块：一条捷径把输入送到加法口" accent={C.amber} pad={20}>
              <ResBlockFig width={900} />
            </Card>
            <div style={{ marginTop: 12 }}>
              <Card label="同一个模型，只改块数" accent={C.violet} pad={18}>
                <Row name="四块 · 训练 / 测试" value={fmt4(md.resnet.trainAcc) + " / " + fmt4(md.resnet.testAcc)} note="比四块浅的还高" color={C.violet} />
                <Row name="一块 · 测试" value={fmt4(md.resnetShallow.testAcc)} note="参数少，泛化好" color={C.amber} />
              </Card>
            </div>
          </div>
        </AbsoluteFill>

        {/* 页五：感受野 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 292, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              核长八，
              <br />
              看到的就是八天。
            </div>
            <Body style={{ marginTop: 20, width: 740 }}>
              八天以外的信息，一层卷积一次看不到。要覆盖整个窗口，得叠层：第一层看八天，第二层看到十五天，池化再放大一倍。这就是感受野，一层层叠出来的。叠得越多看得越远，也越难训。下一集专门讲感受野之争。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>一层 8 天</Chip>
              <Chip color={C.amber}>两层 15 天</Chip>
              <Chip color={C.inkDim}>下一集：RNN / 空洞卷积</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 860, top: 300, width: 980 }}>
            <Card label="感受野怎么长出来" accent={C.cyan} pad={20}>
              <svg width={920} height={250} style={{ display: "block" }}>
                <text x={0} y={18} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"第一层：核长 8，每个输出看 8 天"}</text>
                {Array.from({ length: 48 }).map((_, i) => (
                  <rect key={i} x={i * 19} y={30} width={17} height={24} rx={2} fill={i < 8 ? "rgba(94,234,212,0.5)" : C.panel} stroke={C.panelLine} strokeWidth={0.6} />
                ))}
                <text x={0} y={96} fill={C.inkFaint} fontFamily={FONT.mono} fontSize={FT.micro}>{"第二层：再叠一层核长 8，看到 15 天"}</text>
                {Array.from({ length: 48 }).map((_, i) => (
                  <rect key={"b" + i} x={i * 19} y={108} width={17} height={24} rx={2} fill={i < 15 ? "rgba(251,191,36,0.45)" : C.panel} stroke={C.panelLine} strokeWidth={0.6} />
                ))}
                <text x={0} y={176} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"池化隔一格取一个，等效步长变成 2；两层之后一个输出覆盖 15 天。"}</text>
                <text x={0} y={210} fill={C.inkDim} fontFamily={FONT.sans} fontSize={FT.meta}>{"想覆盖 60 天，要么继续叠，要么换一种能记长程的结构。"}</text>
              </svg>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
