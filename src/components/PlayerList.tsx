"use client";

import React, { useState } from "react";
import { Users, Trash2 } from "lucide-react";
import { useTournamentStore } from "../store/tournamentStore";

const PlayerList = () => {
  const [newPlayerName, setNewPlayerName] = useState("");
  const players = useTournamentStore((s) => s.players);
  const addPlayer = useTournamentStore((s) => s.addPlayer);
  const removePlayer = useTournamentStore((s) => s.removePlayer);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    addPlayer(newPlayerName);
    setNewPlayerName("");
  };

  return (
    <div className="w-full md:w-80 bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
        <Users className="mr-2" /> 참가 플레이어 목록
      </h3>
      <form onSubmit={handleAddPlayer} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          placeholder="플레이어 이름 입력"
          className="flex-grow bg-gray-700 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors font-semibold"
        >
          추가
        </button>
      </form>
      <ul className="space-y-2 h-auto overflow-y-auto pr-2">
        {players.length === 0 && (
          <p className="text-gray-400 text-center py-4">
            플레이어를 추가해주세요.
          </p>
        )}
        {players.map((player) => (
          <li
            key={player.id}
            className="flex justify-between items-center bg-gray-700 p-2 rounded-md"
          >
            <span className="text-white font-medium">
              {player.name}{" "}
              <span className="text-yellow-400 text-sm">({player.wins}승)</span>
            </span>
            <button
              onClick={() => removePlayer(player.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;
