"use client";

import React, { useMemo } from "react";
import { X } from "lucide-react";
import { useTournamentStore } from "../store/tournamentStore";

const PlayerSelectModal = () => {
  const isOpen = useTournamentStore((s) => s.isPlayerSelectModalOpen);
  const closeModal = useTournamentStore((s) => s.closePlayerSelectModal);
  const players = useTournamentStore((s) => s.players);
  const rounds = useTournamentStore((s) => s.rounds);

  const assignedPlayerIds = useMemo(() => {
    return new Set(
      rounds.flatMap((r) =>
        r.seeds.flatMap((s) => s.teams.map((t) => t.id).filter(Boolean))
      )
    );
  }, [rounds]);

  const assignPlayer = useTournamentStore((s) => s.assignPlayerToSlot);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">플레이어 선택</h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {players.map((player) => {
            const isAssigned = assignedPlayerIds.has(player.id);
            return (
              <li key={player.id}>
                <button
                  onClick={() => assignPlayer(player)}
                  disabled={isAssigned}
                  className={`w-full text-left p-3 rounded-md transition-colors ${
                    isAssigned
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-600 text-white hover:bg-indigo-600"
                  }`}
                >
                  {player.name} {isAssigned && "(배치됨)"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PlayerSelectModal;
