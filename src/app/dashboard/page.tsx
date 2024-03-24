"use client"
import { useRef, useState } from "react";
import "../globals.css";

export default function Dashboard() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    const message = event.target.message.value;
    const response = await fetch(`/api/create_podcast`, { method: "POST", body: JSON.stringify({ message }) });
    const status = response.status;
    if (status !== 200) {
      const error = await response.json();
      setError(error.message);
      setIsLoading(false);
      return;
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
  
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
    }

    setIsLoading(false);
  }

  return (
    <main className="min-h-screen p-24">
      Dashboard
      {isLoading && <div>Loading...</div>}
      {!isLoading && !audioRef.current && (<>
        <div>Enter a message to generate a podcast</div>
        <form onSubmit={handleSubmit} className="">
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
      {error && <div className="text-red-500">{error}</div>}
    </main>
  );
}
