"use client"
import { useRef, useState } from "react";
import "../globals.css";

export default function Dashboard() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    const message = event.target.message.value;
    const response = await fetch(`/api/create_podcast`, { method: "POST", body: JSON.stringify({ message }) });
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
  
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
    }

    setIsLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      Dashboard
      {isLoading && <div>Loading...</div>}
      {!isLoading && !audioRef.current && (<>
        <div>Enter a message to generate a podcast</div>
        <form onSubmit={handleSubmit}>
          <label>
            Message:
            <input type="text" name="message" />
          </label>
          <button type="submit">Submit</button>
        </form>
      </>)}

      {audioRef.current && (
        <audio ref={audioRef} controls className="w-full mt-4" />
      )}
    </main>
  );
}