import * as React from "react";
import Player from "@madzadev/audio-player";
import "@madzadev/audio-player/dist/index.css";

   interface Props {
    tracklist: string[];
   }

export default function AudioPlayer({
tracklist 
}: Props) {


 
  return (
    <div className="">
      <Player
        trackList={tracklist}
        includeTags={true}
        includeSearch={true}
        showPlaylist={true}
        sortTracks={true}
        autoPlayNextTrack={true}
      />
    </div>
  );
}
