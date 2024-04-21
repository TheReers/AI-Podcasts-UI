import * as React from "react";
import Image from "next/image";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";

interface Props {
  podcasts: [];
  playPodcast: (podcast: {}) => void;
}

export default function PodCard({ podcasts, playPodcast }: Props) {
  function millisToMinutesAndSeconds(millis: number) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
  }

  return podcasts.map((podcast: {}, index: number) => (
    <div key={index} className="">
      <Image
        src="/pod-image.jpg"
        alt="podcast image"
        width={150}
        height={100}
        priority
      />
      <div className="">
        <h1 className="">{podcast.name}</h1>
        <div className="flex items-center">
          <PlayCircleIcon
            onClick={() => {
              playPodcast(podcast);
            }}
          />
          <span className="text-[#CBC3E3] text-sm">
            {millisToMinutesAndSeconds(podcast.duration)} min
          </span>
        </div>
        <p className="">Reers Podcasts</p>
      </div>
    </div>
  ));
}
