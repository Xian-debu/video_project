# 素材政策（material policy）

> 适用范围：所有"素材型"影片——论文解读、标准解读、文档/历史资料解读，以及任何以别人的图表/原文/影像作为论据的片子。
> 目的：让"原文本身"成为可见、可查、可授权、可门禁的素材，而不是只把数字抄进我们自己的图里。

## 1. 为什么要有这份政策

六阶段工程（见 gen24-admin/docs/52–54）的教训：龙芯六集把论文当"事实来源"，画面里的图表全部重画，原文图版 0 处。观众无法判断我们有没有读原文，也无法自己核对；这不是美学问题，是证据链问题。

因此：**素材型影片默认必须让原文可见。** 只有当原文不可获得、不可授权或不可读时，才允许只用重画图，并在影片/文档里说明原因。

## 2. 素材清单：data/source-figures.json

每个 pack 可选一个清单文件；文件名固定，避免和其他台账（如 data/plates.json 是 char 片的贴片账）冲突。

```json
{
  "schemaVersion": 1,
  "plates": [
    {
      "id": "fig1a",
      "file": "assets/public/plates/fig1a.png",
      "source": "3GPP TS 45.003 V18.0.0 (2024-05), ETSI TS 145 003",
      "doc": "TS 45.003",
      "page": "22 (PDF 23)",
      "figure": "Figure 1a",
      "license": "3GPP/ETSI specification excerpt",
      "attribution": "3GPP TS 45.003 V18.0.0, Figure 1a (p.22)",
      "note": "整条信道编码/交织链；高亮 TCH/FS 卷积码框"
    }
  ]
}
```

字段硬要求：id、file、source、doc、page、figure、license、attribution 都非空；file 必须在 assets/public/plates/ 下（这样会随 public 挂载进引擎，staticFile 才能读到）；图片 ≤6 MB；声明了 width/height 时必须与文件一致。

## 3. 电影声明与门禁

- film.json 可选字段 `"material": "required" | "optional"`。
- `required` 时：至少 2 张原文图；每张的 id 必须在其 src/ 里被引用（防止"清单里有、片子里没有"）；否则 `tools/check.mjs` / `tools/plates.mjs` 失败。
- `optional` 时：可 0 张，但清单里出现的每条仍按上面的字段校验。
- 素材型影片若选择 required，应在 pack 的 docs/plan.md 写明为什么这些图不可替代。

## 4. 画面纪律

- 每张原文图带"原文"徽标 + 出处条（作者/机构、文档号、页码/图号）。出处条不遮挡原图内容。
- 我们的标注（高亮框、圈、箭头）只画在空白区或图外；绝不覆盖原文自己的标注、坐标轴、图例。
- 裁剪留边：至少 9 px 呼吸边；裁完必须 read_image 亲眼核对（数字/单位/图例没被切掉）。
- 原文图占全片屏幕数 ≤ 1/5；其余用重画/动画，讲"机制"而不是"截图轮播"。
- 原文图不是装饰：每一张都要在旁白里被解释，并在 claims 台账里能对上原文句子。

## 5. 许可证白名单

允许：
- 3GPP/ETSI 标准文本的摘录（注明文档号/版本/页码；不整页复印）；
- CC BY / CC BY-SA / CC0 / 公有领域（注明作者、来源、许可证）；
- 自己拍摄/自己绘制（own-work）；
- 明确获得授权的材料（在 note 里写授权方与范围）。

禁止：
- IEEE/ACM/Elsevier 等未授权论文整页或整图复印（可以引用数字/短句，图要重画）；
- 来源不明、许可证不明、水印/付费墙截图；
- 把"引用比例很小"当成不需要授权的理由。

## 6. 工具

- `node tools/plates.mjs`：列出每片素材数与许可证，校验失败即非零退出。
- `node tools/check.mjs`：包含同一套校验。
- `tools/verify.sh`：check → plates → status。
- `node tools/new-pack.mjs --with-plates`：新片脚手架（source-figures.json + assets/public/plates/）。

## 7. 反例（本次要修的那个）

"图 3 显示缓存命中率提升 12%"——如果图 3 是重画的、且全片没有任何原文图，观众只能相信我们。正确做法：至少给一张原文图（哪怕是表格截图），把 12% 指出来，再在旁白里解释它为什么成立；如果原文图不可用，就在片头和文档里明确说"本片图表为作者重绘，原始数据见论文第 X 页"。
