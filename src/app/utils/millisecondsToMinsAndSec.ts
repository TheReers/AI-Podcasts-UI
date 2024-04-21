import { MIN_MS } from "../../constants";

export function millisToMinutesAndSeconds(millis: number) {
    let minutes = Math.floor(millis / MIN_MS);
    let seconds = ((millis % MIN_MS) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
}
