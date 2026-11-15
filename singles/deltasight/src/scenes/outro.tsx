import React from "react";
import { Head, Scene } from "../shared";
import { SCENES } from "../script";

/* outro — 占位，待实现。 */
export const SOutro: React.FC = () => {
  const s = SCENES.find((x) => x.id === "outro")!;
  return (
    <Scene id="outro">
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />
    </Scene>
  );
};
