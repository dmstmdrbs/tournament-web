import { Bracket } from "@/types/bracket";
import { UpdateWinnerParams } from "@/types/winner";

export function updateMatchWinner({
  bracket,
  round,
  matchId,
  winnerId,
}: UpdateWinnerParams): Bracket {
  // 깊은 복사해서 불변성 유지 (간단하게 JSON 복사, 실제로는 immer 등 권장)
  const updatedBracket: Bracket = JSON.parse(JSON.stringify(bracket));

  // 현재 라운드 매치 찾기
  const currentRoundMatches = updatedBracket.rounds[round];
  if (!currentRoundMatches) throw new Error("Round not found.");

  const currentMatch = currentRoundMatches.find((m) => m.id === matchId);
  if (!currentMatch) throw new Error("Match not found.");

  // 승자 기록
  currentMatch.winnerId = winnerId;

  // 다음 라운드가 없으면(결승) 리턴
  if (round + 1 >= updatedBracket.rounds.length) return updatedBracket;

  // 다음 라운드 매치 인덱스 계산
  const nextRoundMatches = updatedBracket.rounds[round + 1];
  const currentMatchIndex = currentRoundMatches.findIndex(
    (m) => m.id === matchId
  );
  const nextMatchIndex = Math.floor(currentMatchIndex / 2);
  const nextMatch = nextRoundMatches[nextMatchIndex];

  // 다음 라운드 매치가 없으면 에러
  if (!nextMatch) throw new Error("Next round match not found.");

  // 다음 라운드 매치 player1 or player2 결정 (짝수 matchIndex → player1, 홀수 → player2)
  if (currentMatchIndex % 2 === 0) {
    nextMatch.player1 =
      updatedBracket.players.find((p) => p.id === winnerId) || null;
  } else {
    nextMatch.player2 =
      updatedBracket.players.find((p) => p.id === winnerId) || null;
  }

  // 만약 player2가 null인데 player1만 있으면 부전승 처리 가능 (옵션)
  if (nextMatch.player1 && !nextMatch.player2) {
    nextMatch.isBye = true;
    nextMatch.winnerId = nextMatch.player1.id;
  } else {
    nextMatch.isBye = false;
    nextMatch.winnerId = null; // 아직 승자 미결정
  }

  return updatedBracket;
}
