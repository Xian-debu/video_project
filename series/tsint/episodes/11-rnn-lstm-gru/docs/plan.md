# 11-rnn-lstm-gru - 循环三兄弟：一条梯度路径的三种走法

> status: draft (scaffolded, not produced)
> chapter: ch02 | runtime target: 26 min | algorithms: 3

## Thesis

三者的差别不在「谁更先进」，而在梯度沿时间回传时走哪条路：vanilla RNN 走 h_t=σ(w_hh h_{t−1}+…)，每步乘一次 w_hh·σ'，w_hh=0.5、19 步就是 0.5^19≈1.9e-6，梯度必然消失；LSTM 的 cell 走 c_t=f_t⊙c_{t−1}+i_t⊙c̃_t 这条纯加法路径，f_t≈0.99995 时 20 步仍有 ≈0.999 的传递率。把同一个「延迟 10 步记忆」任务交给两者，RNN 的 loss 停在随机猜，LSTM 能压下去——这是可复现的判决实验，不是口口相传的经验。

## Verification

看完这一集，观众应能写出一个通过有限差分梯度检查的 RNN，并解释 LSTM 为什么能记住 20 步。屏幕上必须出现 4 个数字：0.5^19=1.9073486328125e-06（RNN 梯度传递率）、0.9991（LSTM c 通道 20 步传递率）、两者比值 >1e5、以及三兄弟参数量 288/1152/864。延迟记忆任务的 loss 曲线必须有实拍（不是示意图）。书中未给任何训练超参，配方是我们的选择，需在画面上标注。

## Data

合成：延迟记忆任务（序列 60、随机位置 ±1 标记、1 万条，固定 seed）；ts-admin 日线 120 只票×250 日（3 万窗口，前复权）。

## Algorithms

- ch2-rnn - 原始循环神经网络（含 BPTT） (TsBase.Algos.Ch02.Rnn)
- ch2-lstm - 长短期记忆网络 (TsBase.Algos.Ch02.Lstm)
- ch2-gru - 门控循环单元 (TsBase.Algos.Ch02.Gru)
