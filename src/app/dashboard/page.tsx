"use client";
import { useState } from "react";
import "../globals.css";
import { signOutUser } from "../utils/signOut";
import PodSearch from "./components/PodSearch";
import { Button } from "@mui/material";
import AudioPlayer from "./components/AudioPlayer";
import { useQuery } from "react-query";
import { getAllPodcasts } from "./components/api";
import { handleApiError } from "../service/axios";
import CallMadeIcon from "@mui/icons-material/CallMade";
import PodCard from "./components/PodCard";

export default function Dashboard() {
  const [audioSrc, setAudioSrc] = useState("");
  const [error, setError] = useState<string>("");
  const [showPlayer, setShowPlayer] = useState(false);


  const [tracks, setTracks] = useState([
    {
      url: "https://audioplayer.madza.dev/Madza-Chords_of_Life.mp3",
      title: "Madza - Chords of Life",

    },
    {
      url: "https://audioplayer.madza.dev/Madza-Late_Night_Drive.mp3",
      title: "Madza - Late Night Drive",
      
    },
    {
      url: "https://audioplayer.madza.dev/Madza-Persistence.mp3",
      title: "Madza - Persistence",
      
    },
  ]);

  interface Podcast {
    _id: string;
    name: string;
    slug: string;
    url: string;
    user: string;
    duration: number;
    createdAt: string;
    updatedAt: string;
  }

    const [podcasts, setPodcasts] = useState<Podcast[]>([]);

  const getPodcasts = async () => {
    try {
      const { data } = await getAllPodcasts();
      console.log("program data", data.data[0]);

      setPodcasts(data.data);
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const { isLoading } = useQuery("getPodcastList", getPodcasts, {});

  const playPodcast = (podcast:{
    url: string;
    name: string;
  }) => {
    
    setShowPlayer(true);
setTracks({
      url: podcast.url,
      title: podcast.name
})
  }

  return (
    <main className="min-h-screen p-24">
      <div className="flex justify-between">
        <PodSearch />
        <Button sx="{{color:'transparent', display:'flex'}}">
          <span className="text-white text-sm">Generate Podcast</span>
          <CallMadeIcon />
        </Button>
      </div>
      <div className="">
        <h2 className="text-white text-3xl">AI Podcasts</h2>
      </div>

      <div className="flex gap-x-5">
        <PodCard podcasts={podcasts} />
      </div>

      {showPlayer && <AudioPlayer tracklist={tracks} />}
    </main>
  );
}

(Dashboard as any).auth = true;
