import React from "react";
import { Head, Scene } from "../shared";
import { SCENES } from "../script";

/* system — 占位，待实现。 */
export const SSystem: React.FC = () => {
  const s = SCENES.find((x) => x.id === "system")!;
  return (
    <Scene id="system">
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />
    </Scene>
  );
};
