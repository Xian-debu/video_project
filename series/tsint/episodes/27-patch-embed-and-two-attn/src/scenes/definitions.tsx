import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT, FT, FT_T } from "../../design/tokens";
import { PAD, CW, M, pageAt, Pages, Scene, SceneHead, Stat, Mono, Body, Card, Row, Formula, K, Chip } from "../shared";

export const SDefinitions: React.FC = () => {
  const at = [0, pageAt("definitions", 10), pageAt("definitions", 17), pageAt("definitions", 25), pageAt("definitions", 30), pageAt("definitions", 36)];
  const p = M.patch;
  const t = M.patchtst;
  return (
    <Scene id="definitions">
      <SceneHead id="definitions" />
      <Pages id="definitions" at={at}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1150 }}>
            <Card label="定义一 · 块嵌入：九十六步铺成十一个块" accent={C.cyan} style={{ width: 1150 }}>
              <Formula size={40}>{"p_i = x_{(i-1)s+1 : (i-1)s+P},   i = 1 … n"}</Formula>
              <Formula size={40} style={{ marginTop: 14 }}>{"z_i = p_i W_p + b_p,   W_p ∈ R^{P×d},  b_p ∈ R^{d}"}</Formula>
              <Row name="块长 P" value="16" note="每块十六步" width={1050} />
              <Row name="步长 s" value="8" note="相邻块重叠八个点" width={1050} />
              <Row name="块数 n" value={"⌊(96−16)/8⌋ + 1 = 11"} note="不是书上写的十二" color={C.cyan} width={1050} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 320, width: 558 }}>
            <Stat label="块数" value={String(p.n)} sub={"书上写的 " + p.naive + " 是 96 除以 8"} accent={C.cyan} style={{ width: 558, height: 210 }} />
            <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 12 }}>
              <Chip color={C.cyan}>最后一块 81–96</Chip>
              <Chip color={C.cyan}>块必须整块落在窗口里</Chip>
            </div>
            <Card label="口径" style={{ width: 558, marginTop: 26 }}>
              <Body size={FT.label}>块数不是窗口除以步长。除法算的是能走几步，块数比步数多一。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1150 }}>
            <Card label="块嵌入参数 · 每块一套权重，所有块共享" accent={C.cyan} style={{ width: 1150 }}>
              <Row name="权重 W_p" value="16 × 32 = 512" note="十六步压成三十二维" width={1050} />
              <Row name="偏置 b_p" value="32" note="每维一个" width={1050} />
              <Row name="合计" value={String(p.params)} note="十六乘三十二，加三十二" color={C.cyan} width={1050} />
              <Row name="位置编码" value={String(p.posParams)} note="十一个位置，每个三十二维" width={1050} />
              <Row name="输出" value={"11 × 32"} note="十一个块，每块三十二维" width={1050} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 330, width: 558 }}>
            <Stat label="参数" value={String(p.params)} sub="块嵌入本体，不含位置" style={{ width: 558, height: 210 }} />
            <Stat label="位置" value={String(p.posParams)} sub="可学习，不是正弦公式" accent={C.amber} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1150 }}>
            <Card label="定义二 · 编码器：每个通道自己走一遍" accent={C.amber} style={{ width: 1150 }}>
              <Formula size={40}>{"z' = LN(z + MHSA(z)),   z'' = LN(z' + FFN(z'))"}</Formula>
              <Row name="维度" value={"d = " + t.d} note="三十二维，四个头" width={1050} />
              <Row name="注意力" value="4 × (4 × 32 × 32) = 4096" note="Q、K、V、O 四个方阵，每头三十二维" width={1050} />
              <Row name="前馈" value="2 × 32 × 128 = 8192" note="两层，中间宽一百二十八" width={1050} />
              <Row name="编码器合计" value={String(t.encParams)} note="一层，一层就是全部" color={C.amber} width={1050} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 330, width: 558 }}>
            <Stat label="编码器参数" value={String(t.encParams)} sub="4,096 加 8,192" accent={C.amber} style={{ width: 558, height: 210 }} />
            <Stat label="层数" value={String(t.layers)} sub="两层就是三万三千零二十四" accent={C.amber} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 340, width: 1150 }}>
            <Card label="预测头 · 十一块三十二维，读出二十四步" accent={C.violet} style={{ width: 1150 }}>
              <Formula size={44}>{"y = Z_{11×32} W_h + b_h,   W_h ∈ R^{32×24}"}</Formula>
              <Row name="权重" value="11 × 32 × 24 = 8,448" note="每块每维对每步一条边" width={1050} />
              <Row name="偏置" value="24" note="每步一个" width={1050} />
              <Row name="合计" value={String(t.totalParams)} note="编码器一万二千二百八十八加头八千四百四十八" color={C.violet} width={1050} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 340, width: 558 }}>
            <Stat label="预测头" value={String(t.headParams)} sub="十一乘三十二，再乘二十四" accent={C.violet} style={{ width: 558, height: 210 }} />
            <Stat label="合计" value={String(t.totalParams)} sub="一层编码器加一个头" style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 320, width: 1150 }}>
            <Card label="定义三 · 交叉注意力解码器：查询在解码端，键值在编码端" accent={C.coral} style={{ width: 1150 }}>
              <Formula size={38}>{"Z_{cross} = softmax(Q_d K_e^T / √d_k) V_e"}</Formula>
              <Row name="查询 Q_d" value={"24 × 32"} note="二十四个可学习向量，N(0, 0.02)" width={1050} />
              <Row name="键值 K_e, V_e" value={"96 × 32"} note="编码端的九十六个记忆" width={1050} />
              <Row name="自注意力" value="因果掩码" note="上三角精确为零" color={C.coral} width={1050} />
              <Row name="交叉注意力" value="不掩" note="每个查询都能看全部记忆" color={C.cyan} width={1050} />
              <Row name="归一化" value="都在残差之后" note="Post-LN，不是 Pre-LN" width={1050} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 320, width: 558 }}>
            <Stat label="查询" value={String(M.cross.queries)} sub={"初始化标准差 " + M.cross.querySd.toFixed(4)} accent={C.coral} style={{ width: 558, height: 210 }} />
            <Card label="方向不能反" style={{ width: 558, marginTop: 26 }}>
              <Body size={FT.label}>交换查询和记忆也能跑，但那就不是解码器了。两个翻转测试钉死这个方向。</Body>
            </Card>
          </div>
        </AbsoluteFill>

        <AbsoluteFill>
          <div style={{ position: "absolute", left: PAD, top: 330, width: 1150 }}>
            <Card label="交叉解码器参数 · 八个方阵，两段前馈，二十四个查询" accent={C.coral} style={{ width: 1150 }}>
              <Row name="八个方阵" value="8 × 32 × 32 = 8,192" note="自注意力的 QKVO，交叉的 QKVO" width={1050} />
              <Row name="两段前馈" value="2 × 32 × 128 = 8,192" note="每段两层，宽一百二十八" width={1050} />
              <Row name="查询" value="24 × 32 = 768" note="可学习，随机初始化" width={1050} />
              <Row name="合计" value={String(M.cross.params)} note="一万七千一百五十二" color={C.coral} width={1050} />
              <Row name="书上给的" value={String(M.cross.bookParams)} note="只数了一个注意力块，漏了交叉投影和查询" color={C.amber} width={1050} />
            </Card>
          </div>
          <div style={{ position: "absolute", left: 1290, top: 330, width: 558 }}>
            <Stat label="实现参数" value={String(M.cross.params)} sub="八个方阵加两段前馈加查询" accent={C.coral} style={{ width: 558, height: 210 }} />
            <Stat label="书本口径" value={String(M.cross.bookParams)} sub="漏了交叉投影与查询" accent={C.amber} style={{ width: 558, height: 210, marginTop: 26 }} />
          </div>
        </AbsoluteFill>
      </Pages>
    </Scene>
  );
};
