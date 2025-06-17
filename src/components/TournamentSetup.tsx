"use client";

import React from "react";
import { ChevronsRight } from "lucide-react";
import { useTournamentStore } from "../store/tournamentStore";
import { TOURNAMENT_SIZES } from "../utils/tournament";

const TournamentSetup = () => {
  const tournamentSize = useTournamentStore((s) => s.tournamentSize);
  const setTournamentSize = useTournamentStore((s) => s.setTournamentSize);
  const startTournament = useTournamentStore((s) => s.startTournament);
  const players = useTournamentStore((s) => s.players);

  const handleStart = () => {
    if (players.length < tournamentSize) {
      alert(
        `플레이어가 최소 ${tournamentSize}명 이상 필요합니다. 현재 ${players.length}명.`
      );
      return;
    }
    startTournament();
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">
      <h3 className="text-xl font-bold text-white">토너먼트 규모 선택</h3>
      <div className="flex gap-3">
        {TOURNAMENT_SIZES.map((size) => (
          <button
            key={size}
            onClick={() => setTournamentSize(size)}
            className={`px-6 py-2 rounded-md font-semibold transition-all ${
              tournamentSize === size
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {size}강
          </button>
        ))}
      </div>
      <button
        onClick={handleStart}
        disabled={players.length < tournamentSize}
        className="w-full mt-4 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        토너먼트 시작! <ChevronsRight />
      </button>
    </div>
  );
};

export default TournamentSetup;
