declare module "@madzadev/audio-player" {
  import * as React from "react";
  export interface Track {
    url: string;
    title: string;
    tags: string[];
  }
  interface Props {
    trackList: Track[];
    includeTags?: boolean;
    includeSearch?: boolean;
    showPlaylist?: boolean;
    sortTracks?: boolean;
    autoPlayNextTrack?: boolean;
  }
  export default function Player(props: Props): JSX.Element;
}
