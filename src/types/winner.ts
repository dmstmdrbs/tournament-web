import { Bracket } from "./bracket";

export type UpdateWinnerParams = {
  bracket: Bracket;
  round: number; // 승자가 결정된 매치의 라운드 번호 (0-based)
  matchId: string; // 승자 등록할 매치 ID
  winnerId: string; // 승자 플레이어 ID
};
