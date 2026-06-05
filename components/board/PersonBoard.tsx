"use client";

import { useEffect, useState } from "react";
import type { PersonBoardData } from "@/data/newsletter";
import { PersonBoardV1 } from "@/components/board/PersonBoardV1";
import { PersonBoardV2 } from "@/components/board/PersonBoardV2";
import { PersonBoardV3 } from "@/components/board/PersonBoardV3";

/** 据 ?v=1/2/3 选白板视觉版本，默认 1。供并行做几版对比。 */
export function PersonBoard({ data, isActive }: { data: PersonBoardData; isActive: boolean }) {
  const [v, setV] = useState("1");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setV(params.get("v") || "1");
  }, []);
  if (v === "2") return <PersonBoardV2 data={data} isActive={isActive} />;
  if (v === "3") return <PersonBoardV3 data={data} isActive={isActive} />;
  return <PersonBoardV1 data={data} isActive={isActive} />;
}
