import React from "react";
import { Head, Scene } from "../shared";
import { SCENES } from "../script";

/* limits — 占位，待实现。 */
export const SLimits: React.FC = () => {
  const s = SCENES.find((x) => x.id === "limits")!;
  return (
    <Scene id="limits">
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />
    </Scene>
  );
};
