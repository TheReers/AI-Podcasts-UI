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
import { useRouter } from "next/navigation";
import { signOutUser } from "../utils/signOut";
import LogoutIcon from "@mui/icons-material/Logout";
import AuthWrapper from "./components/AuthWrapper";
import CreateButton from "./components/CreateButton";
import Image from "next/image";

export default function Dashboard() {
  const router = useRouter();
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [searchParam, setSearchParam] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const getPodcasts = async (search?: string) => {
    try {
      const { data } = await getAllPodcasts(search);
      setPodcasts(data);
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const { isLoading } = useQuery(
    ["getPodcastList", searchParam],
    () => getPodcasts(searchParam),
    {}
  );

  const playPodcast = (index: number) => {
    setCurrentIndex(index);
  };

  const onSearchChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    event.preventDefault();
    setSearchParam(event.target.value);
  };

  return (
    <AuthWrapper>
      <main className="min-h-screen px-8 py-16">
        <div className="flex justify-between">
          <PodSearch onChange={onSearchChange} />

          <CreateButton />
        
        </div>
        <div className="mt-10 mb-4 flex justify-between">
          <h2 className="text-black text-3xl">Explore</h2>
          <div className="flex gap-x-2">
          <Image
            src="/dashboard/caretcircle.svg"
            alt="caret circle icon"
            width={24}
            height={24}
            priority
          />

<Image
            src="/dashboard/caretcircle-fade.svg"
            alt="caret circle icon faded"
            width={24}
            height={24}
            priority
            className="rotate-180"
          />
          
          </div>
        </div>

        <div className="flex flex-nowrap md:flex-wrap gap-x-5 mt-4 gap-y-6 overflow-x-scroll md:overflow-x-hidden">
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
          onClick={() => signOutUser()}
          className="cursor-pointer flex items-center absolute bottom-10">
          <LogoutIcon/>
          <span className="text-white ml-1">Logout</span>
        </div>
    </main>
  </AuthWrapper>
  );
}

(Dashboard as any).auth = true;
