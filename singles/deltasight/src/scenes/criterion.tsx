import React from "react";
import { Head, Scene } from "../shared";
import { SCENES } from "../script";

/* criterion — 占位，待实现。 */
export const SCriterion: React.FC = () => {
  const s = SCENES.find((x) => x.id === "criterion")!;
  return (
    <Scene id="criterion">
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />
    </Scene>
  );
};
