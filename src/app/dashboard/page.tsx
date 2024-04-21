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

export default function Dashboard() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const getPodcasts = async () => {
    try {
      const { data } = await getAllPodcasts();
      setPodcasts(data);
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const { isLoading } = useQuery("getPodcastList", getPodcasts, {});

  const playPodcast = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <main className="min-h-screen p-16">
      <div className="flex justify-between">
        <PodSearch />
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
    </main>
  );
}

(Dashboard as any).auth = true;
