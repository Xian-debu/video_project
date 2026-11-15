import React from "react";
import { Head, Scene } from "../shared";
import { SCENES } from "../script";

/* adc — 占位，待实现。 */
export const SAdc: React.FC = () => {
  const s = SCENES.find((x) => x.id === "adc")!;
  return (
    <Scene id="adc">
      <Head kicker={s.kicker} title={s.title} goal={s.goal} />
    </Scene>
  );
};
