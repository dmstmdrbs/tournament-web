import type { Player } from "../store/tournamentStore";

export interface PlayerRepository {
  getPlayers: () => Promise<Player[]>;
  savePlayers: (players: Player[]) => Promise<void>;
  updatePlayer: (player: Player) => Promise<void>;
}

const localStoragePlayerRepository: PlayerRepository = {
  getPlayers: async () => {
    if (typeof window === "undefined") return [];
    const storedPlayers = localStorage.getItem("tournament_players");
    return storedPlayers ? JSON.parse(storedPlayers) : [];
  },
  savePlayers: async (players: Player[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("tournament_players", JSON.stringify(players));
  },
  updatePlayer: async (updatedPlayer: Player) => {
    if (typeof window === "undefined") return;
    const players = await localStoragePlayerRepository.getPlayers();
    const newPlayers = players.map((p) =>
      p.id === updatedPlayer.id ? updatedPlayer : p
    );
    await localStoragePlayerRepository.savePlayers(newPlayers);
  },
};

export const getPlayerAdapter = (): PlayerRepository => {
  return localStoragePlayerRepository;
};
