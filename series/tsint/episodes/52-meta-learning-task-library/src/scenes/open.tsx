import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT } from "../../design/tokens";
import { M, Body, Card, Chip, KV, PAD, Pages, Row, Scene, SceneHead, fmtPct, pagesOf } from "../shared";
import { HitsBars, SplitBar } from "../figs";

export const OpenScene: React.FC = () => (
  <Scene id="open">
    <SceneHead id="open" />
    <Pages id="open" at={pagesOf("open")}>
      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 660 }}>
          <Body size={FT.h1} color={C.ink} style={{ lineHeight: 1.2 }}>三百只股票，<br />三百个任务。</Body>
          <Body style={{ marginTop: 26 }}>
            前两集都在省算力：少试几个候选、少拟合几次。这一集换一个问题：模型选择本身能不能被学会。每只股票是一个任务，每个任务有自己的十个候选。
          </Body>
          <div style={{ display: "flex", marginTop: 26 }}>
            <KV k="任务" v={M.data.stocks} color={C.cyan} />
            <KV k="候选" v={M.data.candidates.length} color={C.violet} />
            <KV k="拟合" v={M.fits} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 800, top: 288, width: 1040 }}>
          <Card label="一个任务 = 一只股票的一段历史 + 十个候选" accent={C.cyan}>
            <Row name="输入" value="4 维元特征" note="均值 / 标准差 / 一阶自相关 / 季节强度" width={980} />
            <Row name="输出" value="10 维误差" note="每个候选在验证段的 MAE，任务内中心化" width={980} />
            <Row name="判据" value="Hit@1" note="选中的候选是不是真值冠军" width={980} color={C.cyan} />
            <Row name="代价" value="后悔值" note="选中候选的测试误差减去冠军的" width={980} color={C.violet} />
          </Card>
          <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
            <Chip color={C.cyan}>一个任务：选一次</Chip>
            <Chip color={C.violet}>三百个任务：学一次</Chip>
            <Chip color={C.amber}>{M.data.industries} 个行业</Chip>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 300, width: 700 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.28 }}>从「一个任务<br />挑十个」，到<br />「三百个任务<br />各挑一个」。</Body>
          <Body style={{ marginTop: 24 }}>
            上一集的结论是：候选之间的冠军差距小于外推误差，排序恢复不了。这一集把同一件事推到极端——不是十个候选里挑一个，而是三百个任务，每个都要挑。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 860, top: 300, width: 960 }}>
          <Card label="任务库的两个维度" accent={C.violet}>
            <Row name="横轴" value="300 个任务" note="每只股票一段连续历史" width={900} />
            <Row name="纵轴" value="10 个候选" note="与前两集完全同一套" width={900} color={C.violet} />
            <Row name="总量" value={"300 × 10"} note="三千次拟合，一次证据程序跑完" width={900} color={C.cyan} />
            <Row name="切分" value="日历 + 任务" note="时间三段，任务级 5 折，另留 30 只" width={900} color={C.amber} />
          </Card>
          <div style={{ marginTop: 20, fontFamily: FONT.mono, fontSize: FT.meta, color: C.inkFaint }}>
            元学习要学的不是价格，是「什么样的任务该配什么模型」。
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 290, width: 640 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>结论先<br />放在这里。</Body>
          <Body style={{ marginTop: 24 }}>
            元学习命中 {fmtPct(M.hits.stats, 2)}，比行业类均值低，比恒选朴素低得更多。但它对每个候选误差的预测相关系数是 {M.corr.toFixed(4)}。打分几乎完美，选冠军却选不中。
          </Body>
          <div style={{ marginTop: 24, display: "flex", gap: 10 }}>
            <Chip color={C.coral}>命中 {fmtPct(M.hits.stats, 2)}</Chip>
            <Chip color={C.cyan}>相关 {M.corr.toFixed(4)}</Chip>
            <Chip color={C.violet}>后悔 {M.regret.mean.toFixed(4)}</Chip>
          </div>
        </div>
        <div style={{ position: "absolute", left: 760, top: 292, width: 1080 }}>
          <Card label="四条命中率，一条比一条难看" accent={C.coral}>
            <HitsBars w={980} />
          </Card>
          <div style={{ marginTop: 18, display: "flex", gap: 30 }}>
            <KV k="相关" v={M.corr.toFixed(4)} color={C.cyan} />
            <KV k="平均后悔" v={M.regret.mean.toFixed(4)} color={C.violet} />
            <KV k="最大后悔" v={M.regret.max.toFixed(4)} color={C.coral} />
            <KV k="跑完" v={M.seconds.toFixed(1) + "s"} color={C.amber} />
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 620 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>五段路线。</Body>
          <Body style={{ marginTop: 24 }}>
            建库、定义、回归、交叉验证、留出对照。每一段都有真实读数，读数都来自同一份证据程序，二十九项检查，一条命令跑完。
          </Body>
        </div>
        <div style={{ position: "absolute", left: 740, top: 296, width: 1100 }}>
          <Card label="从任务库到留出对照" accent={C.cyan}>
            <Row name="01 任务库" value={String(M.data.stocks)} note="固定种子抽 300 只，每只取最长连续段" width={1040} />
            <Row name="02 定义" value="4 + 10" note="4 维元特征，10 维误差标签" width={1040} color={C.violet} />
            <Row name="03 回归" value="多输出岭" note="一次矩阵求逆，十个输出一起解" width={1040} color={C.cyan} />
            <Row name="04 交叉验证" value="5 折" note="任务轮流留出，折间不共享信息" width={1040} color={C.amber} />
            <Row name="05 留出" value={M.hits.holdN + " 只"} note="完全没参与训练和选模型" width={1040} color={C.coral} />
          </Card>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        <div style={{ position: "absolute", left: PAD, top: 296, width: 560 }}>
          <Body size={FT.h2} color={C.ink} style={{ lineHeight: 1.3 }}>口径<br />先定死。</Body>
          <Body style={{ marginTop: 22 }}>
            三百只 A 股，固定种子从全市场抽，每只取最长连续段。日历切三段，另留三十只做最终对照。十个候选，与前两集完全同一套。
          </Body>
          <div style={{ display: "flex", marginTop: 22 }}>
            <KV k="股票" v={M.data.stocks} color={C.cyan} />
            <KV k="行业" v={M.data.industries} color={C.violet} />
            <KV k="种子" v={M.data.seed} color={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", left: 700, top: 300, width: 1130 }}>
          <Card label="日历切分：训练 / 验证 / 测试" accent={C.amber}>
            <SplitBar w={1050} />
          </Card>
          <div style={{ marginTop: 20, display: "flex", gap: 26 }}>
            <KV k="训练根数" v={M.data.split.train[0] + " – " + M.data.split.train[1]} color={C.cyan} />
            <KV k="验证根数" v={M.data.split.valid[0] + " – " + M.data.split.valid[1]} color={C.violet} />
            <KV k="测试根数" v={M.data.split.test[0] + " – " + M.data.split.test[1]} color={C.amber} />
          </div>
        </div>
      </AbsoluteFill>
    </Pages>
  </Scene>
);
