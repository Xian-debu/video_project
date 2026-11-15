import React from "react";
import { Head, Scene } from "../shared";
import { SCENES } from "../script";

/* block — 占位，待实现。 */
export const SBlock: React.FC = () => {
  const s = SCENES.find((x) => x.id === "block")!;
  return (
    <Scene id="block">
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />
    </Scene>
  );
};
