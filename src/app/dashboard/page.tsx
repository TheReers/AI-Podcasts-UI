"use client"
import { useState } from "react";
import "../globals.css";

export default function Dashboard() {
  const [data, setData] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    const message = event.target.message.value;
    const api = await fetch(`/api/create_podcast`, { method: "POST", body: JSON.stringify({ message }) });
    const status = api.status;
    const response = await api.json();
    if (status !== 200) {
      setError(response.error?.message || 'An error occurred');
      setIsLoading(false);
      return;
    }

    setData(response.data);
    setIsLoading(false);
  }

  return (
    <main className="min-h-screen p-24">
      Dashboard
      {isLoading && <div>Loading...</div>}
      {!isLoading && !data && (<>
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
        !isLoading && data && (
          <div>
            {data}
          </div>
        )
      }
      {error && <div className="text-red-500">{error}</div>}
    </main>
  );
}
