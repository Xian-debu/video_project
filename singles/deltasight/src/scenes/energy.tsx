import React from "react";
import { Head, Scene } from "../shared";
import { SCENES } from "../script";

/* energy — 占位，待实现。 */
export const SEnergy: React.FC = () => {
  const s = SCENES.find((x) => x.id === "energy")!;
  return (
    <Scene id="energy">
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />
    </Scene>
  );
};
