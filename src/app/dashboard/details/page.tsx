"use client";
import { useState } from "react";
import "../../globals.css";
import { useQuery } from "react-query";
import { getDetails, Podcast } from "../../utils/api";
import { handleApiError } from "../../service/axios";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useRouter, useSearchParams } from "next/navigation";
import AudioPlayer from "../components/AudioPlayer";
import Image from "next/image";
import AuthWrapper from "../components/AuthWrapper";
import toast from "react-hot-toast";

export default function PodcastDetailsComponent() {
  const router = useRouter();
  const [podcastDetails, setPodcast] = useState<Podcast>();
  const useParam = useSearchParams();
  const slug = useParam.get("slug");

  const getPodcastDetails = async (slug?: string | null) => {
    try {
      const { data } = await getDetails(slug);
      setPodcast(data);
    } catch (error) {
      throw handleApiError(error);
    }
  };

  const { isLoading } = useQuery(
    ["getPodcastDetails", slug],
    () => getPodcastDetails(slug),
    {}
  );

  if (!slug) {
    router.push("/dashboard");
  }

  if (isLoading && !podcastDetails) {
    setTimeout(() => {
      toast.error("Podcast not found");
    }, 1000);
    router.push("/dashboard");
  }

  return (
    <AuthWrapper>
      <main className="min-h-screen p-16">
        <div className="flex justify-between"></div>

        <div className="flex gap-x-5 mt-4">
          {!isLoading ? (
            <div className="">
              <div className="mt-4">
                <h2 className="text-white text-3xl capitalize">{podcastDetails?.name}</h2>
                <Image
                  src="/pod-image-large.jpg"
                  alt="podcast image"
                  width={800}
                  height={300}
                  priority
                  className="mt-4"
                  style={{ width: "100%", height: 380 }}
                />
                <div className="mt-4">
                  <AudioPlayer
                    tracklist={[
                      {
                        url: podcastDetails?.url || "",
                        title: podcastDetails?.name || "",
                        tags: [],
                      },
                    ]}
                  />
                </div>
                <h5 className="text-white text-2xl capitalize mt-4">
                  Transcript
                </h5>
                <p className="text-white text-base mt-4">{podcastDetails?.transcript}</p>
              </div>
            </div>
          ) : (
            <Box sx={{ display: "flex", justify: "center" }}>
              <CircularProgress />
            </Box>
          )}
        </div>
      </main>
    </AuthWrapper>
  );
}

(PodcastDetailsComponent as any).auth = true;
