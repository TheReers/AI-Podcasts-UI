import * as React from "react";
import Player from "@madzadev/audio-player";
import "@madzadev/audio-player/dist/index.css";

interface Props {
  tracklist: {
    url: string;
    title: string;
    tags: string[];
  }[];
}

export default function AudioPlayer({ tracklist }: Props) {
  return (
    <div className="">
      <Player
        trackList={tracklist}
        includeTags={false}
        includeSearch={false}
        showPlaylist={false}
        sortTracks={false}
        autoPlayNextTrack={true}
      />
    </div>
  );
}
