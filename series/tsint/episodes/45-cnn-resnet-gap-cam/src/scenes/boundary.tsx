import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import {
  PAD, M, pagesOf, Pages, Scene, SceneHead, Card, Body, Chip, Row, MiniTable, CodeBlock,
  fmt4,
} from "../shared";

const ds = M.dataset;
const rs = M.residual;
const md = M.models;
const mt = M.meta;

export const SBoundary: React.FC = () => {
  const at = pagesOf("boundary");
  return (
    <Scene id="boundary">
      <SceneHead id="boundary" />
      <Pages id="boundary" at={at}>
        {/* 页一：数据口径 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              数据是借来的，
              <br />
              口径要写清楚。
            </div>
            <Body style={{ marginTop: 20, width: 760 }}>
              {mt.deviation}
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.coral}>计划：HS300 内凑三类</Chip>
              <Chip color={C.cyan}>实际：全市场同门类</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 288, width: 950 }}>
            <Card label="计划与实际的四处偏移" accent={C.coral} pad={22}>
              <Row name="来源" value="全市场 C39/C27/C35" note="计划写 HS300" color={C.coral} />
              <Row name="规模" value="三类各 100 只" note="HS300 内凑不出" color={C.cyan} />
              <Row name="区间" value="2018-01-02 → 2025-12-31" note="延到与 43/44 集一致" color={C.cyan} />
              <Row name="筛选" value="非 ST · 2018 前上市" note="有效日 ≥ 900，按代码升序" color={C.cyan} />
            </Card>
            <div style={{ height: 16 }} />
            <Card label="窗口与切分" accent={C.inkDim} pad={20}>
              <Row name="窗口" value="60 步，步长 150" note={"共 " + ds.windows + " 个"} color={C.inkDim} />
              <Row name="切分" value={ds.train + " / " + ds.test} note="按股票切，不按窗口" color={C.inkDim} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页二：数据冗余 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              五个通道，
              <br />
              其实只有一路半。
            </div>
            <Body style={{ marginTop: 20, width: 760 }}>
              开、高、低、收、量五个字段，两两平均绝对相关 {fmt4(ds.meanAbsCorr)}。卷积比线性只高 {fmt4((md.cnn.testAcc - md.linear.testAcc) * 100, 1)} 个百分点，和这条对得上：通道之间没有多少互补信息可学。想再往上，得换字段，不是换结构。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="平均 |r|" value={fmt4(ds.meanAbsCorr)} note="五个字段" color={C.coral} />
              <Row name="卷积 − 线性" value={"+" + fmt4((md.cnn.testAcc - md.linear.testAcc) * 100, 1) + " pp"} note="互补信息有限" color={C.amber} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 300, width: 950 }}>
            <Card label="五个字段的关系" accent={C.amber} pad={22}>
              <Row name="开高低收" value="同一根 K 线" note="四列近似线性" color={C.coral} />
              <Row name="成交量" value="略独立" note="但同向变化" color={C.amber} />
              <Row name="平均 |r|" value={fmt4(ds.meanAbsCorr)} note="两两取绝对值再平均" color={C.cyan} />
              <div style={{ height: 12 }} />
              <Body color={C.inkDim} size={FT.meta}>
                四列价格不是四个独立通道；想让卷积有活干，得先换掉这些高度冗余的字段。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页三：残差不可外推 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              「加深没用」
              <br />
              只在一档上成立。
            </div>
            <Body style={{ marginTop: 20, width: 760 }}>
              只比了一块和四块。四块测试 {fmt4(rs.deepAcc)}，一块 {fmt4(rs.shallowAcc)}，差 {(-rs.deepMinusShallowPp).toFixed(1)} 个百分点。八块、十六块、瓶颈结构都没试。所以这句话的准确说法是：在这个窗口长度和样本量上，四块已经过了拐点。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="一块" value={fmt4(rs.shallowAcc)} note="测试，最好" color={C.cyan} />
              <Row name="四块" value={fmt4(rs.deepAcc)} note="测试，掉 3.4 pp" color={C.coral} />
              <Row name="八块" value="未测" note="不敢外推" color={C.inkFaint} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 950 }}>
            <Card label="四块残差：训练上去了，测试没上去" accent={C.coral} pad={22}>
              <Row name="训练" value={fmt4(md.resnet.trainAcc)} note="比测试高很多" color={C.violet} />
              <Row name="测试" value={fmt4(md.resnet.testAcc)} note={rs.blocks + " 块"} color={C.coral} />
              <div style={{ height: 14 }} />
              <CodeBlock
                width={880}
                lines={[
                  { t: "-- 只测了两档：块数 = 1 和 4" },
                  { t: "results = [ shallow, deep ]   -- 没有 8、16", dim: true },
                  { t: "-- 结论只能写成：这一档上加深不划算", hi: true },
                ]}
              />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页四：可解释性的代价 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              热图不是白拿的。
            </div>
            <Body style={{ marginTop: 20, width: 760 }}>
              GAP-CAM 测试 {fmt4(md.gapcam.testAcc)}，比卷积低 {fmt4((md.cnn.testAcc - md.gapcam.testAcc) * 100, 1)} 个百分点。GAP 把整段时间压成一个均值，位置信息被抹平；CAM 能指回时间轴，靠的是最后那层线性权。要热图，就得接受这个精度损失。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="卷积" value={fmt4(md.cnn.testAcc)} note="没有热图" color={C.cyan} />
              <Row name="GAP-CAM" value={fmt4(md.gapcam.testAcc)} note="有热图" color={C.amber} />
              <Row name="价" value={"−" + fmt4((md.cnn.testAcc - md.gapcam.testAcc) * 100, 1) + " pp"} note="换可解释性" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 950 }}>
            <Card label="热图能说的和不能说的" accent={C.amber} pad={22}>
              <Row name="能说" value="哪几天权重大" note="60 天里的定位" color={C.cyan} />
              <Row name="不能说" value="这几天就是原因" note="权重不等于因果" color={C.coral} />
              <div style={{ height: 14 }} />
              <Body color={C.inkDim} size={FT.meta}>
                CAM 是「模型看哪里」，不是「市场为什么这样」。这张热图只能当线索，不能当解释。
              </Body>
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页五：单种子 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 780 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              一次训练，
              <br />
              一个种子。
            </div>
            <Body style={{ marginTop: 20, width: 760 }}>
              所有模型都只跑了一次，种子固定为七。表里那些小数点后四位的差，没有置信区间——差三个百分点以内，当成噪声更稳妥。这一集给的是「方向和量级」，不是「精确排名」。
            </Body>
            <div style={{ marginTop: 20 }}>
              <Row name="种子" value="7" note="所有模型同一个" color={C.cyan} />
              <Row name="重复" value="未跑" note="没有多次初始化" color={C.coral} />
              <Row name="切分" value="一次" note="没做交叉验证" color={C.coral} />
            </div>
          </div>
          <div style={{ position: "absolute", left: 900, top: 292, width: 950 }}>
            <Card label="哪些数能当真" accent={C.violet} pad={22}>
              <Row name="方向" value="可当真" note="卷积 > 线性" color={C.cyan} />
              <Row name="量级" value="可当真" note="几个百分点" color={C.cyan} />
              <Row name="排名" value="存疑" note="小数点后两位" color={C.coral} />
            </Card>
          </div>
        </AbsoluteFill>

        {/* 页六：未验证清单 + 下一集 */}
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 288, width: 760 }}>
            <div style={{ fontFamily: FONT.serif, fontSize: FT.h1, color: C.ink, lineHeight: 1.18 }}>
              四件没验证的事，
              <br />
              和下一集。
            </div>
            <Body style={{ marginTop: 20, width: 740 }}>
              第一，八块十六块的深残差没测；第二，空洞卷积没碰；第三，热图在不同种子下稳不稳没试；第四，热图与真实事件对不对得上，没有标注，无从验证。
            </Body>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              <Chip color={C.cyan}>{mt.evidence.checks} 组检查</Chip>
              <Chip color={C.amber}>新增 {mt.newCases} 条断言</Chip>
            </div>
          </div>
          <div style={{ position: "absolute", left: 880, top: 288, width: 970 }}>
            <Card label="未验证清单" accent={C.coral} pad={22}>
              <Row name="更深残差" value="未测" note="8 / 16 块" color={C.coral} />
              <Row name="空洞卷积" value="未测" note="留给下一集" color={C.coral} />
              <Row name="热图稳定性" value="未测" note="换种子重跑" color={C.coral} />
              <Row name="热图对事件" value="未证" note="没有标注" color={C.coral} />
            </Card>
            <div style={{ height: 16 }} />
            <Card label={"下一集 · " + mt.next.minutes + " 分钟"} accent={C.cyan} pad={20}>
              <div style={{ fontFamily: FONT.serif, fontSize: FT.h2, color: C.ink }}>{mt.next.title}</div>
              <div style={{ marginTop: 10 }}>
                <Chip color={C.inkDim}>{mt.next.id}</Chip>
              </div>
            </Card>
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
