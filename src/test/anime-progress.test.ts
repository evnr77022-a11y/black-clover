import { describe, expect, it } from "vitest";
import { EPISODES } from "@/lib/anime-data";
import { normalizeEpisode, rankFor, readProgress, toggleEpisode } from "@/lib/progress";

describe("Black Clover episode catalog", () => {
  it("contains the supplied 170 sequential episode sources", () => {
    expect(EPISODES.map((ep) => ep.number)).toEqual(Array.from({length:170},(_,i)=>i+1));
    expect(EPISODES.every((ep) => ep.url?.startsWith("https://animeslayer.to/assets/player/__wit.php?idFHD="))).toBe(true);
    expect(new Set(EPISODES.map((ep)=>ep.url)).size).toBe(170);
  });
  it("has factual titles at both ends of the catalog", () => {
    expect(EPISODES[0]?.title).toBe("Asta and Yuno");
    expect(EPISODES[169]?.title).toBe("The Faraway Future");
    expect(EPISODES.every((ep)=>ep.title!=="Black Clover")).toBe(true);
  });
  it("restricts episode navigation to integer episodes 1 through 170", () => {
    expect(normalizeEpisode(-1)).toBe(1); expect(normalizeEpisode(171)).toBe(170);
    expect(normalizeEpisode(4.7)).toBe(4); expect(normalizeEpisode(Infinity)).toBe(1);
  });
});
describe("Device-local Magic Knight progress", () => {
  it("starts at Magic Novice and reaches Wizard King only at 170 completions", () => {
    expect(rankFor(0).en).toBe("Magic Novice");
    expect(rankFor(169).en).not.toBe("Wizard King");
    expect(rankFor(170).en).toBe("Wizard King");
  });
  it("counts each watched episode once and permits unmarking", () => {
    expect(toggleEpisode([1],2)).toEqual([1,2]); expect(toggleEpisode([1,2],2)).toEqual([1]);
  });
  it("recovers from corrupted storage and discards out-of-range episode entries", () => {
    expect(readProgress("bad").watched).toEqual([]);
    expect(readProgress('{"watched":[1,1,171],"favorites":[170,0],"lastEpisode":500}')).toEqual({watched:[1],favorites:[170],lastEpisode:170});
  });
});