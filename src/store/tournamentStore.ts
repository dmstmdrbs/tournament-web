import { create } from "zustand";
import { produce } from "immer";
import { getNextMatchIndices } from "../utils/tournament";
import { getPlayerAdapter } from "../repository/playerRepository";
import type { IRoundProps } from "react-brackets";

// --- TYPE DEFINITIONS ---
export interface Player {
  id: string;
  name: string;
  wins: number;
}

export interface TournamentState {
  players: Player[];
  tournamentSize: number;
  rounds: IRoundProps[];
  isTournamentStarted: boolean;
  winner: Player | null;
  isPlayerSelectModalOpen: boolean;
  targetMatchInfo: {
    roundIndex: number;
    matchIndex: number;
    teamIndex: number;
  } | null;
}

export interface TournamentActions {
  setTournamentSize: (size: number) => void;
  addPlayer: (name: string) => void;
  removePlayer: (id: string) => void;
  startTournament: () => void;
  resetTournament: () => void;
  assignPlayersRandomly: () => void;
  assignPlayerToSlot: (player: Player) => void;
  setMatchWinner: (
    winner: Player,
    roundIndex: number,
    matchIndex: number
  ) => void;
  openPlayerSelectModal: (
    roundIndex: number,
    matchIndex: number,
    teamIndex: number
  ) => void;
  closePlayerSelectModal: () => void;
  incrementWin: (playerId: string) => void;
}

export const useTournamentStore = create<TournamentState & TournamentActions>(
  (set, get) => ({
    players: [],
    tournamentSize: 8,
    rounds: [],
    isTournamentStarted: false,
    winner: null,
    isPlayerSelectModalOpen: false,
    targetMatchInfo: null,

    setTournamentSize: (size) => set({ tournamentSize: size }),
    addPlayer: (name) => {
      if (!name.trim()) return;
      const newPlayer: Player = { id: crypto.randomUUID(), name, wins: 0 };
      set(
        produce((state) => {
          state.players.push(newPlayer);
        })
      );
    },
    removePlayer: (id) => {
      set(
        produce((state) => {
          state.players = state.players.filter((p: Player) => p.id !== id);
        })
      );
    },
    startTournament: () => {
      const { tournamentSize } = get();
      const roundsCount = Math.log2(tournamentSize);
      if (roundsCount < 1) return;
      const initialRounds: IRoundProps[] = [];
      for (let i = 0; i < roundsCount; i++) {
        const matchesInRound = tournamentSize / Math.pow(2, i + 1);
        initialRounds.push({
          title:
            i === 0
              ? `${tournamentSize}강`
              : i === roundsCount - 1
              ? "결승"
              : `${matchesInRound * 2}강`,
          seeds: Array(matchesInRound)
            .fill({})
            .map(() => ({
              id: crypto.randomUUID(),
              teams: [{ name: "Player A" }, { name: "Player B" }],
            })),
        });
      }
      set({ rounds: initialRounds, isTournamentStarted: true, winner: null });
    },
    resetTournament: () =>
      set({
        isTournamentStarted: false,
        rounds: [],
        winner: null,
        isPlayerSelectModalOpen: false,
        targetMatchInfo: null,
      }),
    assignPlayersRandomly: () => {
      const { players, tournamentSize, rounds } = get();
      if (players.length < tournamentSize) {
        alert(`플레이어가 최소 ${tournamentSize}명 필요합니다.`);
        return;
      }
      const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
      const selectedPlayers = shuffledPlayers.slice(0, tournamentSize);
      const newRounds = produce(rounds, (draftRounds) => {
        if (draftRounds.length > 0) {
          let playerIndex = 0;
          draftRounds[0].seeds.forEach((seed) => {
            seed.teams[0] = { ...selectedPlayers[playerIndex] };
            playerIndex++;
            seed.teams[1] = { ...selectedPlayers[playerIndex] };
            playerIndex++;
          });
        }
      });
      set({ rounds: newRounds });
    },
    assignPlayerToSlot: (player) => {
      const { targetMatchInfo } = get();
      if (!targetMatchInfo) return;
      const { roundIndex, matchIndex, teamIndex } = targetMatchInfo;
      set(
        produce((state) => {
          const match = state.rounds[roundIndex].seeds[matchIndex];
          match.teams[teamIndex] = { ...player };
        })
      );
      get().closePlayerSelectModal();
    },
    setMatchWinner: (winner, roundIndex, matchIndex) => {
      const { rounds } = get();
      const isFinalMatch = roundIndex === rounds.length - 1;
      if (isFinalMatch) {
        set({ winner });
        get().incrementWin(winner.id);
        return;
      }
      const nextMatch = getNextMatchIndices(roundIndex, matchIndex);
      set(
        produce((state) => {
          const currentMatch = state.rounds[roundIndex].seeds[matchIndex];
          currentMatch.winnerId = winner.id;
          const nextRound = state.rounds[nextMatch.roundIndex];
          const nextMatchInRound = nextRound.seeds[nextMatch.matchIndex];
          const teamIndexToUpdate = matchIndex % 2;
          nextMatchInRound.teams[teamIndexToUpdate] = { ...winner };
        })
      );
    },
    openPlayerSelectModal: (roundIndex, matchIndex, teamIndex) => {
      set({
        isPlayerSelectModalOpen: true,
        targetMatchInfo: { roundIndex, matchIndex, teamIndex },
      });
    },
    closePlayerSelectModal: () => {
      set({ isPlayerSelectModalOpen: false, targetMatchInfo: null });
    },
    incrementWin: (playerId: string) => {
      const playerAdapter = getPlayerAdapter();
      set(
        produce((state) => {
          const player = state.players.find((p: Player) => p.id === playerId);
          if (player) {
            player.wins += 1;
            playerAdapter.updatePlayer(player);
          }
        })
      );
    },
  })
);
