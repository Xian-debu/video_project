import React from "react";
import { Head, Scene } from "../shared";
import { SCENES } from "../script";

/* accuracy — 占位，待实现。 */
export const SAccuracy: React.FC = () => {
  const s = SCENES.find((x) => x.id === "accuracy")!;
  return (
    <Scene id="accuracy">
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />
    </Scene>
  );
};
