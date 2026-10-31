import React from "react";
import { C, FONT, FT } from "../../design/tokens";
import { Body, CW, Card, Chip, Head, K, M, PAD, Pages, Row, Stat, Verdict, fmtInt, pageAt } from "../shared";

const ez = (v: number) => (v === 0 ? "0" : v.toExponential(1));

const P1: React.FC = () => (
  <>
    <Head kicker="05 / 验证" title="三十四项，四组" goal="结构先钉定义，再看数据" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: CW, display: "flex", gap: 22 }}>
      <Stat label="数据" value={M.meta.checks.data + " 项"} accent={C.inkDim} style={{ flex: 1, height: 150 }} sub={<span>形状、哈希、样本量</span>} />
      <Stat label="结构" value={M.meta.checks.struct + " 项"} accent={C.cyan} style={{ flex: 1, height: 150 }} sub={<span>定义、边界、恒等</span>} />
      <Stat label="梯度" value={M.meta.checks.grad + " 项"} accent={C.amber} style={{ flex: 1, height: 150 }} sub={<span>中心差分逐参数</span>} />
      <Stat label="真实数据" value={M.meta.checks.real + " 项"} accent={C.violet} style={{ flex: 1, height: 150 }} sub={<span>周期、趋势、缺样本</span>} />
    </div>
    <div style={{ position: "absolute", left: PAD, top: 530, width: CW }}>
      <Card label="结构断言 · 手算与边界" accent={C.cyan}>
        <Row name="参数量（4 层 · 3 通道）" value="逐层查表" note="形状由定义推出，不从论文抄" color={C.inkDim} width={CW - 60} />
        <Row name="手算卷积" value={ez(M.struct.handErr)} note="w = [3,2,1]，输入 1..7 → 前五个 1,4,10,16,22" color={C.cyan} width={CW - 60} />
        <Row name="感受野" value={M.meta.rf} note="滞后 30 还有差，滞后 31 是零" color={C.amber} width={CW - 60} />
        <Row name="因果性" value={M.causal.sameRows + " 行相同"} note={"前九十行逐位相等；第九十五行差 " + M.causal.diffAt95.toFixed(4)} color={C.violet} width={CW - 60} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 870, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>四组检查全部进同一份证据 JSON：命令行、提交号、环境、逐项通过与否。</Body>
    </div>
  </>
);

const P2: React.FC = () => (
  <>
    <Head kicker="05 / 验证" title="数值断言：对拍与恒等" goal="每一步都能量出来" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1080 }}>
      <Card label="频谱与折叠" accent={C.violet} style={{ height: 420 }}>
        <Row name="DFT 对 FFT" value={M.struct.dftErr.toExponential(1)} note="两种算法互相对拍" color={C.violet} width={1020} />
        <Row name="往返变换" value={ez(M.struct.fftRoundTrip)} note="FFT → IFFT 逐位还原" color={C.violet} width={1020} />
        <Row name="合成周期" value={M.struct.synthTop1 + " 根"} note="序列里埋的 48，挑出来还是 48" color={C.amber} width={1020} />
        <Row name="折叠再展开" value={ez(M.struct.foldErr)} note={M.fold.rows * M.fold.cols + " 个元素逐位比较"} color={C.cyan} width={1020} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1110, top: 330, width: CW - 1110 }}>
      <Card label="二维卷积与聚合" accent={C.cyan} style={{ height: 420 }}>
        <Row name="1×1 核恒等" value={ez(M.struct.conv1x1Err)} note="核中心对齐之后，误差到零" color={C.cyan} width={CW - 1160} />
        <Row name="列方向环形" value={M.struct.circularAt.toString()} note="绕回读到同一相位的值" color={C.violet} width={CW - 1160} />
        <Row name="行方向零填充" value={M.struct.zeroRowAt.toString()} note="越界是零，不是另一个周期" color={C.amber} width={CW - 1160} />
        <Row name="振幅和" value={M.struct.ampSum.toFixed(1)} note="归一化之后 ΣA = 1" color={C.inkDim} width={CW - 1160} />
        <Row name="整块恒等" value={ez(M.struct.blockIdentityErr)} note="权重全一、残差关闭" color={C.coral} width={CW - 1160} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 800, width: CW }}>
      <Body size={FT.lead} color={C.ink}>这些数都是 0 或 10 的负十几次方，没有一个是「差不多」。</Body>
    </div>
  </>
);

const P3: React.FC = () => (
  <>
    <Head kicker="05 / 验证" title="梯度与真实数据" goal="解析梯度要经得起数值差分" />
    <div style={{ position: "absolute", left: PAD, top: 330, width: 1040 }}>
      <Card label="中心差分 · 门槛 1e-6" accent={C.amber} style={{ height: 400 }}>
        <Row name="权重误差" value={M.grad.weightErr.toExponential(1)} note="逐元素抽查" color={C.cyan} width={980} />
        <Row name="偏置误差" value={M.grad.biasErr.toExponential(1)} note="同上" color={C.cyan} width={980} />
        <Row name="输入误差" value={M.grad.inputErr.toExponential(1)} note="同上" color={C.cyan} width={980} />
        <Body size={FT.body} style={{ marginTop: 12 }}>
          过门槛四个数量级；解析梯度和数值差分对得上，训练出来的数才可信。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1070, top: 330, width: CW - 1070 }}>
      <Card label="真实五分钟线 · 前三个峰" accent={C.violet} style={{ height: 400 }}>
        <Row name="第一峰" value={M.real.top1Period + " 根"} note={"振幅 " + M.spectrum.top1.toFixed(3) + " · 一个交易日"} color={C.amber} width={CW - 1120} />
        <Row name="第二峰" value="24 根" note={"振幅 " + M.spectrum.peaks[1].amp.toFixed(3) + " · 半天"} color={C.cyan} width={CW - 1120} />
        <Row name="第三峰" value={M.spectrum.peaks[2].period + " 根"} note="趋势，接近全样本" color={C.violet} width={CW - 1120} />
        <Row name="周周期 240" value={"第 " + M.spectrum.weekly240Rank + " 位"} note="前三个峰里没有它" color={C.coral} width={CW - 1120} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 790, width: CW, display: "flex", gap: 22 }}>
      <Stat label="测试套件" value={fmtInt(M.meta.tests.suites)} accent={C.cyan} style={{ width: 560 }} sub={<span>断言 {fmtInt(M.meta.tests.asserts)}</span>} />
      <Stat label="本集三个模块" value={M.meta.tests.conv + " / " + M.meta.tests.fft + " / " + M.meta.tests.twod} accent={C.amber} style={{ width: 560 }} sub={<span>卷积 / 频率 / 聚合</span>} />
      <Stat label="零失败" value={"0"} accent={C.violet} style={{ width: 560 }} sub={<span>证据运行的失败计数</span>} />
    </div>
  </>
);

const P4: React.FC = () => (
  <>
    <Head kicker="05 / 验证" title="写测试踩的三个坑" goal="也是讲稿里的三个提醒" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: CW, display: "flex", gap: 22 }}>
      <Card label="坑一 · 1×1 核的中心" accent={C.coral} style={{ flex: 1, height: 430 }}>
        <Body size={FT.h2} color={C.ink}>硬编码减一，读到上一行。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          卷积核中心偏移写死成 a − 1、b − 1；核宽为 1 时中心错位，读到上一行。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          修法：half = ks / 2，用 a − half、b − half。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.coral}>已修 · 有回归测试</Chip></div>
      </Card>
      <Card label="坑二 · 权重次序" accent={C.amber} style={{ flex: 1, height: 430 }}>
        <Body size={FT.h2} color={C.ink}>k = 0 是最旧，不是最新。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          测试以为核序号零是最新抽头，于是把「读四步前」写成了「读当前」。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          修法：权重摆成 [1,0,0]，并断言读的是 t − 4。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.amber}>布局写进注释</Chip></div>
      </Card>
      <Card label="坑三 · ReLU 死路径" accent={C.violet} style={{ flex: 1, height: 430 }}>
        <Body size={FT.h2} color={C.ink}>随机权重让扰动传不过去。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          随机初始化加 ReLU，死激活切断了传播路径；感受野测试误判成不敏感。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          修法：正权重、单通道，只比较目标那一行。
        </Body>
        <div style={{ marginTop: 12 }}><Chip color={C.violet}>测试改成确定性</Chip></div>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 820, width: CW }}>
      <Body size={FT.body} color={C.inkDim}>三个坑都写进模块注释；测试不是证明「我写对了」，是让下一次改动露出破绽。</Body>
    </div>
  </>
);

const P5: React.FC = () => (
  <>
    <Head kicker="05 / 验证" title="为什么因果性必须做扰动" goal="形状对，读未来也照样过" />
    <div style={{ position: "absolute", left: PAD, top: 340, width: 1100 }}>
      <Card label="只数形状会漏掉什么" accent={C.coral} style={{ height: 380 }}>
        <Body size={FT.h2} color={C.ink}>输出形状永远对。</Body>
        <Body size={FT.body} style={{ marginTop: 12 }}>
          两侧都补零、是否对称填充，输出形状都一样；只有在前九十行加扰动，才能看出谁读了未来。
        </Body>
        <Body size={FT.body} style={{ marginTop: 10 }}>
          所以这一集的因果性断言是「逐位相同」，不是「形状正确」。
        </Body>
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD + 1130, top: 340, width: CW - 1130 }}>
      <Card label="证据里怎么留痕" accent={C.cyan} style={{ height: 380 }}>
        <Row name="检查总数" value={M.meta.checks.ok + " / " + M.meta.checks.total} note="失败为零" color={C.cyan} width={CW - 1180} />
        <Row name="可复现命令" value="一条" note="证据 JSON 里带完整命令行" color={C.violet} width={CW - 1180} />
        <Row name="数据哈希" value={M.data.sha256.slice(0, 10) + "…"} note="文件变了，检查就该失败" color={C.amber} width={CW - 1180} />
        <Row name="提交号" value={M.meta.tsBaseCommit.slice(0, 7)} note="算法与证据同版本" color={C.inkDim} width={CW - 1180} />
      </Card>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 780, width: CW }}>
      <Body size={FT.lead} color={C.ink}>先验要钉死，然后才谈它在数据上的表现。</Body>
    </div>
    <div style={{ position: "absolute", left: PAD, top: 850, width: CW }}>
      <Verdict ok label="34 / 34 · 0 失败" />
    </div>
  </>
);

export const SVerification: React.FC = () => (
  <Pages
    id="verification"
    at={[0, pageAt("verification", 10), pageAt("verification", 20), pageAt("verification", 30), pageAt("verification", 42)]}
  >
    <P1 />
    <P2 />
    <P3 />
    <P4 />
    <P5 />
  </Pages>
);
