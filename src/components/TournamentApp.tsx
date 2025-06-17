"use client";

import React, { useEffect } from "react";
import { useTournamentStore } from "../store/tournamentStore";
import { getPlayerAdapter } from "../repository/playerRepository";
import WinnerModal from "./WinnerModal";
import BracketView from "./BracketView";
import TournamentSetup from "./TournamentSetup";
import PlayerList from "./PlayerList";
import PlayerSelectModal from "./PlayerSelectModal";

function TournamentApp() {
  const players = useTournamentStore((s) => s.players);
  const isTournamentStarted = useTournamentStore((s) => s.isTournamentStarted);
  const winner = useTournamentStore((s) => s.winner);
  const resetTournament = useTournamentStore((s) => s.resetTournament);

  // 어댑터를 사용하여 초기 플레이어 데이터 로드
  useEffect(() => {
    const playerAdapter = getPlayerAdapter();
    playerAdapter.getPlayers().then((initialPlayers) => {
      // 기존 players와 다를 때만 setState
      if (
        JSON.stringify(useTournamentStore.getState().players) !==
        JSON.stringify(initialPlayers)
      ) {
        useTournamentStore.setState({ players: initialPlayers });
      }
    });
  }, []);

  // // Zustand 스토어의 players 상태가 변경될 때마다 어댑터를 통해 저장
  useEffect(() => {
    const playerAdapter = getPlayerAdapter();
    playerAdapter.savePlayers(players);
  }, [players]);

  return (
    <>
      <WinnerModal winner={winner} onReset={resetTournament} />

      {isTournamentStarted ? (
        <BracketView />
      ) : (
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 h-full">
          <div className="flex-1 h-full">
            <TournamentSetup />
          </div>
          <div className="flex-1 h-full">
            <PlayerList />
          </div>
        </div>
      )}

      <PlayerSelectModal />
    </>
  );
}

export default TournamentApp;
