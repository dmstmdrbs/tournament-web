import { Player } from "./player";

export interface Match {
  id: string;
  round: number;
  player1: Player | null;
  player2: Player | null;
  winnerId: string | null;
  isBye: boolean;
}
