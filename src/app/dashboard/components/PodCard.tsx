import * as React from "react";
import Image from "next/image";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Podcast } from "../page";
import AudioPlayer from "./AudioPlayer";

interface Props {
  podcasts: Podcast[];
  playPodcast: (index: number) => void;
  currentIndex: number | null;
}

export default function PodCard({
  podcasts,
  playPodcast,
  currentIndex,
}: Props) {
  function millisToMinutesAndSeconds(millis: number) {
    let minutes = Math.floor(millis / 60000);
    let seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
  }

  return podcasts.map((podcast, index: number) => (
    <div key={index} className="relative">
      <div className="">
        <Image
          src="/pod-image.jpg"
          alt="podcast image"
          width={150}
          height={100}
          priority
        />
        <div className="">
          <h1 className="mt-2 capitalize w-[150px] text-ellipsis overflow-hidden text-nowrap">
            {podcast.name}
          </h1>
          <div className="flex items-center">
            <PlayCircleIcon
              onClick={() => {
                playPodcast(index);
              }}
            />
            <span className="text-[#CBC3E3] text-sm mt-1 ml-1">
              {millisToMinutesAndSeconds(podcast.duration)} min
            </span>
          </div>
          <p className="mt-1">Reers Podcasts</p>
        </div>
      </div>
      <div className="absolute left-0 mt-4">
        {currentIndex === index && (
          <AudioPlayer
            tracklist={[
              {
                url: podcast.url,
                title: podcast.name,
                tags: [],
              },
            ]}
          />
        )}
      </div>
    </div>
  ));
}
