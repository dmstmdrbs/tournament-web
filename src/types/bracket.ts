import { Match } from "./match";
import { Player } from "./player";

export interface TournamentBracketMeta {
  totalRounds: number;
  bracketSize: number;
  byes: number;
}

export interface Bracket {
  players: Player[];
  rounds: Match[][];
  meta: TournamentBracketMeta;
}
