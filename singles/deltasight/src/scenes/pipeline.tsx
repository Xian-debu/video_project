import React from "react";
import { Head, Scene } from "../shared";
import { SCENES } from "../script";

/* pipeline — 占位，待实现。 */
export const SPipeline: React.FC = () => {
  const s = SCENES.find((x) => x.id === "pipeline")!;
  return (
    <Scene id="pipeline">
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />
    </Scene>
  );
};
