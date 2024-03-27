"use client"
import { useRef, useState } from "react";
import "../globals.css";

export default function Dashboard() {
  const [audio, setAudio] = useState<AudioBuffer | null>(null);
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
    const ctx = new AudioContext();
    const audioBuffer = await ctx.decodeAudioData(await audioBlob.arrayBuffer());
    const audioBufferSource = ctx.createBufferSource();
    audioBufferSource.buffer = audioBuffer;
    setAudio(audioBuffer);

    setIsLoading(false);
  }

  const playAudio = () => {
    const ctx = new AudioContext();
    const audioBuffer = ctx.createBufferSource();
    audioBuffer.buffer = audio;
    audioBuffer.connect(ctx.destination);
    audioBuffer.start();
  }

  return (
    <main className="min-h-screen p-24">
      Dashboard
      {isLoading && <div>Loading...</div>}
      {!isLoading && !audio && (<>
        <div>Enter a message to generate a podcast</div>
        <form onSubmit={handleSubmit} className="">
          <label>
            Message:
            <input type="text" name="message" />
          </label>
          <button type="submit">Submit</button>
        </form>
      </>)}

      {
        !isLoading && audio && (
          <audio controls>
            <source onPlay={playAudio} type="audio/mpeg" />
          </audio>
        )
      }
      {error && <div className="text-red-500">{error}</div>}
    </main>
  );
}
