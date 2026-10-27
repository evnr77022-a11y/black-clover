import visual from "@/assets/anime-visual.asset.json";
import sketch from "@/assets/keyvisual.asset.json";
import asta from "@/assets/asta-portrait.asset.json";
import yuno from "@/assets/yuno-portrait.asset.json";
import yami from "@/assets/yami-portrait.asset.json";
import noelle from "@/assets/noelle-portrait.asset.json";

export const ART = { hero: visual.url, sketch: sketch.url };
export const PORTRAITS: Record<string, string> = { asta: asta.url, yuno: yuno.url, yami: yami.url, noelle: noelle.url };