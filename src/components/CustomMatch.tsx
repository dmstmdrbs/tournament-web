"use client";

import React from "react";
import { Crown } from "lucide-react";
import { useTournamentStore } from "../store/tournamentStore";
import { Tooltip } from "react-tooltip";
import type { IRenderSeedProps, SeedTeam } from "react-brackets";

const CustomMatch = ({ seed, roundIndex, seedIndex }: IRenderSeedProps) => {
  const setMatchWinner = useTournamentStore((s) => s.setMatchWinner);
  const openPlayerSelectModal = useTournamentStore(
    (s) => s.openPlayerSelectModal
  );
  const [teamA, teamB] = seed.teams;
  const hasPlayers = teamA?.id && teamB?.id;

  const handleWinnerSelect = (winner: typeof SeedTeam) => {
    if (!hasPlayers || seed.winnerId) return;
    setMatchWinner(winner, roundIndex, seedIndex);
  };

  const TeamComponent = ({
    team,
    teamIndex,
  }: {
    team: typeof SeedTeam;
    teamIndex: number;
  }) => {
    const isWinner = seed.winnerId && team.id === seed.winnerId;
    const isLoser = seed.winnerId && team.id !== seed.winnerId;

    const handleClick = () => {
      if (!team.id) {
        openPlayerSelectModal(roundIndex, seedIndex, teamIndex);
      }
    };

    const teamName = team?.name || "...";
    const teamClassName = `
      relative flex items-center justify-between w-full h-12 px-3 rounded-md cursor-pointer transition-all duration-300
      ${isWinner ? "bg-green-600 text-white font-bold" : ""}
      ${isLoser ? "bg-gray-600 text-gray-400 opacity-70" : ""}
      ${
        !seed.winnerId && team.id
          ? "bg-gray-700 hover:bg-gray-600 text-white"
          : ""
      }
      ${
        !team.id
          ? "bg-gray-800 border-2 border-dashed border-gray-600 hover:border-indigo-500 hover:text-indigo-400 text-gray-500"
          : ""
      }
    `;

    return (
      <div
        data-tooltip-id={`team-tooltip-${team.id}`}
        data-tooltip-content={team.name && `(통산 ${team.wins || 0}승)`}
      >
        <div className={teamClassName} onClick={handleClick}>
          <span>{teamName}</span>
          {hasPlayers && !seed.winnerId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleWinnerSelect(team);
              }}
              className="text-yellow-400 hover:text-yellow-300 z-10"
              aria-label={`${team.name}을(를) 승자로 지정`}
            >
              <Crown size={20} />
            </button>
          )}
        </div>
        {team.id && <Tooltip id={`team-tooltip-${team.id}`} />}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 justify-center w-52 bg-gray-900/50 p-2 rounded-lg mb-16">
      <TeamComponent team={teamA} teamIndex={0} />
      <div className="text-center text-gray-400 text-sm font-bold">VS</div>
      <TeamComponent team={teamB} teamIndex={1} />
    </div>
  );
};

export default CustomMatch;
