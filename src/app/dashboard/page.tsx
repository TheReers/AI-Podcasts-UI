"use client";
import { useState } from "react";
import "../globals.css";
import PodSearch from "./components/PodSearch";
import { Button } from "@mui/material";
import { useQuery } from "react-query";
import { getAllPodcasts, Podcast } from "../utils/api";
import { handleApiError } from "../service/axios";
import CallMadeIcon from "@mui/icons-material/CallMade";
import PodCard from "./components/PodCard";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { signOutUser } from "../utils/signOut";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Dashboard() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [searchParam, setSearchParam] = useState('')
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const getPodcasts = async (search?: string) => {
    try {
      const { data } = await getAllPodcasts(search);
      setPodcasts(data);
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const { isLoading } = useQuery(["getPodcastList", searchParam], () => getPodcasts(searchParam), {});

  const playPodcast = (index: number) => {
    setCurrentIndex(index);
  };

  const onSearchChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
    event.preventDefault()
    setSearchParam(event.target.value)
  }

  return (
    <main className="min-h-screen p-16">
      <div className="flex justify-between">
        <PodSearch onChange={onSearchChange} />
        <Button sx={{color:'transparent', display:'flex'}}>
          <span className="text-white  capitalize text-lg">Generate Podcast</span>
          <CallMadeIcon sx={{ color: "#6936c9", ml:1 }} />
        </Button>
      </div>
      <div className="mt-4">
        <h2 className="text-white text-3xl">AI Podcasts</h2>
      </div>

      <div className="flex gap-x-5 mt-4">
        {!isLoading ? (
          <PodCard
            podcasts={podcasts}
            playPodcast={playPodcast}
            currentIndex={currentIndex}
          />
        ) : (
          <Box sx={{ display: "flex", justify: "center" }}>
            <CircularProgress />
          </Box>
        )}
      </div>

      <div
        onClick={()=> signOutUser()}
        className="cursor-pointer flex items-center">
          <LogoutIcon/>
          <span className="text-white ml-1">Logout</span>
      </div>
    </main>
  );
}

(Dashboard as any).auth = true;
