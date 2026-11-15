import React from "react";
import { Head, Scene } from "../shared";
import { SCENES } from "../script";

/* problem — 占位，待实现。 */
export const SProblem: React.FC = () => {
  const s = SCENES.find((x) => x.id === "problem")!;
  return (
    <Scene id="problem">
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />
    </Scene>
  );
};
