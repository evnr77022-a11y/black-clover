import { validPlaybackTime } from "@/lib/progress";

export function playbackTimeFromMessage(data:unknown, origin:string, expectedOrigin:string, fromPlayer:boolean):number|null {
 if(!fromPlayer || origin !== expectedOrigin || !data || typeof data !== "object") return null;
 if(!("event" in data) || data.event !== "timeUpdate" || !("currentTime" in data) || !validPlaybackTime(data.currentTime)) return null;
 return data.currentTime;
}