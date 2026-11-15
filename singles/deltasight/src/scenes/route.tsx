import React from "react";
import { Head, Scene } from "../shared";
import { SCENES } from "../script";

/* route — 占位，待实现。 */
export const SRoute: React.FC = () => {
  const s = SCENES.find((x) => x.id === "route")!;
  return (
    <Scene id="route">
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />
    </Scene>
  );
};
