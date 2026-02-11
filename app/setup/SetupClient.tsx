"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function SetupClient() {
  const params = useSearchParams();
  const router = useRouter();

  const sport = params.get("sport") ?? "football";

  const [teamA, setTeamA] = useState("Team A");
  const [teamB, setTeamB] = useState("Team B");

  function startGame() {
    const q = new URLSearchParams({ sport, teamA, teamB });
    router.push(`/game?${q.toString()}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black text-white px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <h1 className="text-4xl font-bold text-center">Setup Teams</h1>

        <p className="text-center text-gray-300 mt-2">
          Mode: {sport === "football" ? "⚽ Football" : "🏀 Basketball"}
        </p>

        <div className="mt-8 flex flex-col gap-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Team A Name
            </label>
            <input
              className="w-full p-3 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-4 focus:ring-blue-500/40"
              value={teamA}
              onChange={(e) => setTeamA(e.target.value)}
              placeholder="π.χ. Liverpool"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Team B Name
            </label>
            <input
              className="w-full p-3 rounded-xl bg-white text-black placeholder-gray-500 outline-none focus:ring-4 focus:ring-blue-500/40"
              value={teamB}
              onChange={(e) => setTeamB(e.target.value)}
              placeholder="π.χ. Juventus"
            />
          </div>

          <button
            onClick={startGame}
            className="mt-2 p-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-xl font-semibold"
          >
            Start Game
          </button>
        </div>
      </div>
    </main>
  );
}
