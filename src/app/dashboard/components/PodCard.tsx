import * as React from "react";
import Image from "next/image";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Podcast } from "../../utils/api";
import AudioPlayer from "./AudioPlayer";
import { millisToMinutesAndSeconds } from "../../utils/millisecondsToMinsAndSec";

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
  const getAudioTracklist = (podcasts: Podcast[], index: number) => {
    return podcasts.slice(index).map(p => ({
      url: p.url,
      title: p.name,
      tags: [],
    }))
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
            <PlayCircleIcon onClick={() => playPodcast(index)} />
            <span className="text-[#CBC3E3] text-sm mt-1 ml-1">
              {millisToMinutesAndSeconds(podcast.duration)} min
            </span>
          </div>
          <p className="mt-1">Reers Podcasts</p>
        </div>
      </div>
      <div className="absolute left-0 mt-4">
        {currentIndex === index && (
          <AudioPlayer tracklist={getAudioTracklist(podcasts, index)} />
        )}
      </div>
    </div>
  ));
}
