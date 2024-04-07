"use client"
import { useState } from "react";
import "../globals.css";
import { useSession } from "next-auth/react";
import { signOutUser } from "../utils/signOut";

export default function Dashboard() {
  const [audioSrc, setAudioSrc] = useState("")
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    const message = event.target.message.value;
    const response = await fetch(`/api/podcasts`, { method: "POST", body: JSON.stringify({ message }) });
    const status = response.status;
    if (status !== 200) {
      const error = await response.json();
      setError(error.message);
      setIsLoading(false);
      return;
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    setAudioSrc(audioUrl);
    setIsLoading(false);
  }

  const { data: session } = useSession({required: true});

  console.log(session);
  const token = (session as any)?.token;
  console.log(token);

  return (
    <main className="min-h-screen p-24">
      Dashboard
      {isLoading && <div>Loading...</div>}
      {!isLoading && !audioSrc && (<>
        <div>Enter a message to generate a podcast</div>
        <form onSubmit={handleSubmit} className="">
          <label>
            Message:
            <input type="text" name="message" />
          </label>
          <button type="submit">Submit</button>
        </form>
        <button onClick={() => signOutUser(token) }>Log out</button> 
      </>)}

      {
        !isLoading && audioSrc && (
          <audio controls>
            <source src={audioSrc} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )
      }
      {error && <div className="text-red-500">{error}</div>}
    </main>
  );
}

(Dashboard as any).auth = true;
