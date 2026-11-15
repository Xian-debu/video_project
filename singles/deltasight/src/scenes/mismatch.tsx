import React from "react";
import { Head, Scene } from "../shared";
import { SCENES } from "../script";

/* mismatch — 占位，待实现。 */
export const SMismatch: React.FC = () => {
  const s = SCENES.find((x) => x.id === "mismatch")!;
  return (
    <Scene id="mismatch">
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />
    </Scene>
  );
};
