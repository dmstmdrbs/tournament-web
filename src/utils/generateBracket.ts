// generateBracket 구현 전략
// 참가자 수 → 가장 가까운 2의 거듭제곱으로 보정 (byes 계산)
// 전체 라운드 수 계산
// 빈 매치 트리 생성 (라운드별 match 배열)
// 1라운드에 참가자 배치 (+ 부전승 처리)
// 이후 라운드는 승자만 올라가는 구조 (player는 null로 초기화)

import { Player } from "../types/player";
import { Match } from "../types/match";
import { shuffle, nextPowerOfTwo, calculateTotalRounds } from "./tournament";
import { Bracket } from "../types/bracket";

export function generateBracket(players: Player[]): Bracket {
  const totalPlayers = players.length;

  if (totalPlayers < 2 || totalPlayers > 32) {
    throw new Error("Player count must be between 2 and 32.");
  }

  const bracketSize = nextPowerOfTwo(totalPlayers); // e.g. 5 → 8
  const totalRounds = calculateTotalRounds(totalPlayers); // e.g. 3
  const byes = bracketSize - totalPlayers;

  let idCounter = 1;
  const matchId = () => `m${String(idCounter++)}`;
  const rounds: Match[][] = Array.from({ length: totalRounds }, () => []);

  // Step 1: 빈 트리형 매치 생성
  for (let round = 0; round < totalRounds; round++) {
    const matchCount = Math.pow(2, totalRounds - round - 1);
    for (let i = 0; i < matchCount; i++) {
      rounds[round].push({
        id: matchId(),
        round,
        player1: null,
        player2: null,
        winnerId: null,
        isBye: false,
      });
    }
  }

  // Step 2: 1라운드에 참가자 셔플 배치
  const shuffled = shuffle(players);
  const firstRound = rounds[0];

  // 부전승을 균등하게 분산하기 위한 랜덤 인덱스 생성
  const byeIndexes = new Set<number>();
  while (byeIndexes.size < byes) {
    byeIndexes.add(Math.floor(Math.random() * firstRound.length));
  }

  let playerIdx = 0;

  for (let i = 0; i < firstRound.length; i++) {
    const match = firstRound[i];

    // 부전승 매치인 경우
    if (byeIndexes.has(i)) {
      match.player1 = shuffled[playerIdx++];
      match.player2 = null;
      match.isBye = true;
      match.winnerId = match.player1.id;
    } else {
      // 일반 매치: player1과 player2 모두 배치
      match.player1 = shuffled[playerIdx++];
      match.player2 = shuffled[playerIdx++];
    }
  }

  return {
    players,
    rounds,
    meta: {
      totalRounds,
      bracketSize,
      byes,
    },
  };
}
