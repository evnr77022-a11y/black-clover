import sources from "@/lib/episode-sources.json";
import titles from "@/lib/episode-titles.json";
import seasonTwoSources from "@/lib/season-two-sources.json";
export type Season = 1 | 2;
export type Episode = { number: number; season: Season; arc: ArcId; title: string; url?: string | undefined };
export const seasonSize = (season: Season) => season === 2 ? 4 : 170;
export type ArcId = "exam" | "seabed" | "elf" | "heart-spade" | "other";

export const ARCS: { id: Exclude<ArcId, "other">; ar: string; en: string; from: number; to: number }[] = [
  { id: "exam", ar: "البداية واختبار فرسان السحر", en: "Entrance & Magic Knights Exam", from: 1, to: 13 },
  { id: "seabed", ar: "آرك معبد قاع البحر", en: "Seabed Temple Arc", from: 40, to: 50 },
  { id: "elf", ar: "آرك تناسخ الإلف", en: "Elf Reincarnation Arc", from: 90, to: 120 },
  { id: "heart-spade", ar: "آرك مملكة القلب والبستوني", en: "Heart & Spade Kingdom Arc", from: 158, to: 170 },
];

export const TOTAL_EPISODES = 170;

export function arcOf(ep: number): ArcId {
  return ARCS.find((a) => ep >= a.from && ep <= a.to)?.id ?? "other";
}

export const EPISODES: Episode[] = Array.from({ length: TOTAL_EPISODES }, (_, i) => ({
  number: i + 1,
  season: 1,
  arc: arcOf(i + 1),
  title: titles.find((row) => row.number === i + 1)?.title ?? "Black Clover",
  url: sources.find((row) => row.number === i + 1)?.url,
}));
// The uploaded "season two" labels are preserved; no unverified release titles are invented.
export const SEASON_TWO_EPISODES: Episode[] = seasonTwoSources.map((row) => ({ ...row, season: 2, arc: "other", title: `Black Clover · ${row.number}` }));
export const episodesFor = (season: Season) => season === 2 ? SEASON_TWO_EPISODES : EPISODES;

export const BATTLES = [
  { ep: 100, ar: "أستا ويونو ضد ليخت", en: "Asta & Yuno vs Licht" },
  { ep: 49, ar: "أستا ضد فيتو", en: "Asta vs Vetto" },
  { ep: 35, ar: "يامي ضد ليخت", en: "Yami vs Licht" },
  { ep: 119, ar: "المعركة ضد زاغريد", en: "The battle against Zagred" },
  { ep: 167, ar: "أستا ويامي ضد دانتي", en: "Asta & Yami vs Dante" },
  { ep: 170, ar: "أستا ضد ليبي", en: "Asta vs Liebe" },
];

export const CHARACTERS = [
  { key: "asta", ar: "أستا", en: "Asta", roleAr: "مكافح السحر — الثيران السوداء", roleEn: "Anti-Magic · Black Bulls", glyph: "☘" },
  { key: "yuno", ar: "يونو", en: "Yuno", roleAr: "سحر الرياح — الفجر الذهبي", roleEn: "Wind Magic · Golden Dawn", glyph: "✦" },
  { key: "yami", ar: "يامي", en: "Yami", roleAr: "سحر الظلام — قائد الثيران", roleEn: "Dark Magic · Captain", glyph: "◐" },
  { key: "noelle", ar: "نويل", en: "Noelle", roleAr: "سحر الماء — العائلة الملكية", roleEn: "Water Magic · Royal", glyph: "◈" },
];
