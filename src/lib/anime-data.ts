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

export const EPISODES = Array.from({ length: TOTAL_EPISODES }, (_, i) => ({
  number: i + 1,
  arc: arcOf(i + 1),
}));

/** Placeholder stream — replace with your licensed episode sources. */
export const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const BATTLES = [
  { ep: 10, ar: "أستا ضد يونو — النهائي", en: "Asta vs Yuno" },
  { ep: 49, ar: "أستا ضد فيتو", en: "Asta vs Vetto" },
  { ep: 63, ar: "يامي ضد ليختي", en: "Yami vs Licht" },
  { ep: 117, ar: "أستا ويونو ضد ليختي", en: "Asta & Yuno vs Licht" },
  { ep: 157, ar: "أستا ضد داتي (الشيطان)", en: "Asta vs Dante" },
  { ep: 170, ar: "أستا ويامي في وجه الشيطان", en: "Asta & Yami vs Devil" },
];

export const CHARACTERS = [
  { key: "asta", ar: "أستا", en: "Asta", roleAr: "مكافح السحر — الثيران السوداء", roleEn: "Anti-Magic · Black Bulls", glyph: "☘" },
  { key: "yuno", ar: "يونو", en: "Yuno", roleAr: "سحر الرياح — الفجر الذهبي", roleEn: "Wind Magic · Golden Dawn", glyph: "✦" },
  { key: "yami", ar: "يامي", en: "Yami", roleAr: "سحر الظلام — قائد الثيران", roleEn: "Dark Magic · Captain", glyph: "◐" },
  { key: "noelle", ar: "نويل", en: "Noelle", roleAr: "سحر الماء — العائلة الملكية", roleEn: "Water Magic · Royal", glyph: "◈" },
];
