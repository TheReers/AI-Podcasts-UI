import * as React from "react";
import Image from "next/image";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Podcast } from "../../utils/api";
import AudioPlayer from "./AudioPlayer";
import { millisToMinutesAndSeconds } from "../../utils/millisecondsToMinsAndSec";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  return podcasts.map((podcast, index: number) => (
    <div  onClick={()=>{router.push(`/dashboard/details?slug=${podcast.slug}`)}} key={index} className="relative cursor-pointer shadow-md w-[273px] min-w-[273px] px-3 py-2 rounded-[7px] min-h-[290px]">
      <div className="">
        <Image
          src="/pod-image.png"
          alt="podcast image"
          width={249}
          height={182}
          priority
        />
        <div className="">
          <h1 className="mt-2 capitalize w-[150px] text-ellipsis overflow-hidden text-nowrap text-black font-medium">
            {podcast.name}
          </h1>
          <div className="flex items-center mt-9">
            <PlayCircleIcon onClick={() => playPodcast(index)} />
            <span className="text-[#878787] text-sm">Reers Podcast</span>
            <span className="text-[#878787] text-sm  ml-4">
              {millisToMinutesAndSeconds(podcast.duration)} min
            </span>
          </div>
          
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
