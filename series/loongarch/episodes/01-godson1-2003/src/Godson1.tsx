import React from "react";
import { Episode } from "../series/loongarch/scenes";
import { CONTENT } from "./content";
import { LINES, SCENES, TOTAL } from "./script";

export { FPS, TOTAL } from "./script";

const META = {
  seriesId: "loongarch",
  seriesTitle: "龙芯：从跟跑到自主指令系统",
  order: 1,
  total: 7,
  year: "2003",
  label: "龙芯1号",
};

export const Godson1: React.FC<{ music?: string | null; narration?: string | null }> = ({ music = null }) => (
  <Episode meta={META} scenes={SCENES} lines={LINES} total={TOTAL} content={CONTENT} music={music} />
);
