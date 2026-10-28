import { describe, expect, it } from "vitest";
import { EPISODES, SEASON_TWO_EPISODES } from "@/lib/anime-data";
import { EMPTY_PROGRESS, normalizeEpisode, rankFor, readProgress, toggleEpisode, watchedThrough } from "@/lib/progress";
import { playbackTimeFromMessage } from "@/lib/player-events";

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
    expect(readProgress('{"watched":[1,1,171],"favorites":[170,0],"lastEpisode":500}')).toEqual({...EMPTY_PROGRESS,watched:[1],favorites:[170],lastEpisode:170,hasVisited:true});
  });
  it("marks all episodes up to and including the current one without losing later watched episodes",()=>{
    expect(watchedThrough([2,10],5)).toEqual([1,2,3,4,5,10]);
    expect(watchedThrough([1,2,3,4,5],5)).toEqual([1,2,3,4,5]);
  });
  it("keeps season two limited to the four supplied episodes",()=>{
    expect(SEASON_TWO_EPISODES.map(e=>e.number)).toEqual([1,2,3,4]);
    expect(new Set(SEASON_TWO_EPISODES.map(e=>e.url)).size).toBe(4);
    expect(SEASON_TWO_EPISODES[0]?.url).toBe("https://animeslayer.to/assets/player/__wit.php?idHD=CQUDCEICHh4zJRMHEgofS1BfKS0EXxkdRRdnWCQlDl5GSgEJAx5xbgwBQw");
    expect(normalizeEpisode(5,2)).toBe(4);
    expect(watchedThrough([],9,2)).toEqual([1,2,3,4]);
  });
  it("preserves old season-one progress and restores independent season-two progress and preferences",()=>{
    const saved=readProgress('{"watched":[52],"favorites":[1],"lastEpisode":3,"lastSeason":2,"seasonTwo":{"watched":[1,2],"favorites":[3]},"preferences":{"query":"3","tab":"favorites","cinema":true,"hideSpoilers":true},"timestamps":{"2:3":290,"1:52":92}}');
    expect(saved.watched).toEqual([52]); expect(saved.seasonTwo).toEqual({watched:[1,2],favorites:[3]});
    expect(saved.lastSeason).toBe(2);expect(saved.lastEpisode).toBe(3);expect(saved.timestamps["2:3"]).toBe(290);
    expect(saved.preferences).toEqual({query:"3",tab:"favorites",cinema:true,hideSpoilers:true,arc:"all"});
  });
  it("accepts time updates only from the exact mounted player origin and window",()=>{
    const data={event:"timeUpdate",currentTime:290};
    expect(playbackTimeFromMessage(data,"https://animeslayer.to","https://animeslayer.to",true)).toBe(290);
    expect(playbackTimeFromMessage(data,"https://evil.example","https://animeslayer.to",true)).toBeNull();
    expect(playbackTimeFromMessage(data,"https://animeslayer.to","https://animeslayer.to",false)).toBeNull();
    expect(playbackTimeFromMessage({...data,currentTime:Infinity},"https://animeslayer.to","https://animeslayer.to",true)).toBeNull();
    expect(playbackTimeFromMessage({...data,currentTime:-1},"https://animeslayer.to","https://animeslayer.to",true)).toBeNull();
  });
});