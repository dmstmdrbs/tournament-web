import { generateBracket } from "./generateBracket";

import { Player } from "../types/player";
import { updateMatchWinner } from "./updateWinner";

describe("updateMatchWinner", () => {
  const createPlayers = (n: number): Player[] =>
    Array.from({ length: n }, (_, i) => ({
      id: `p${i + 1}`,
      name: `Player ${i + 1}`,
    }));

  it("should update winner and advance player to next round (player1 slot)", () => {
    const players = createPlayers(4);
    let bracket = generateBracket(players);

    // 첫 라운드 첫 매치의 player1 승자로 기록
    const firstMatch = bracket.rounds[0][0];
    const winnerId = firstMatch.player1!.id;

    bracket = updateMatchWinner({
      bracket,
      round: 0,
      matchId: firstMatch.id,
      winnerId,
    });

    // 다음 라운드 첫 매치 player1에 승자가 배치됐는지 확인
    const nextMatch = bracket.rounds[1][0];
    expect(nextMatch.player1).not.toBeNull();
    expect(nextMatch.player1!.id).toBe(winnerId);
  });

  it("should update winner and advance player to next round (player2 slot)", () => {
    const players = createPlayers(4);
    let bracket = generateBracket(players);

    // 첫 라운드 두 번째 매치의 player2 승자로 기록
    const secondMatch = bracket.rounds[0][1];
    const winnerId = secondMatch.player2!.id;

    bracket = updateMatchWinner({
      bracket,
      round: 0,
      matchId: secondMatch.id,
      winnerId,
    });

    // 다음 라운드 첫 매치 player2에 승자가 배치됐는지 확인
    const nextMatch = bracket.rounds[1][0];
    expect(nextMatch.player2).not.toBeNull();
    expect(nextMatch.player2!.id).toBe(winnerId);
  });

  it("should set isBye and winnerId if only one player in next match", () => {
    const players = createPlayers(3); // 3명 → 4 슬롯, 부전승 1개
    let bracket = generateBracket(players);

    // 1라운드 첫 매치 승자 업데이트 (player1만 있음, 부전승 가능)
    const matchWithBye = bracket.rounds[0][0];
    const winnerId = matchWithBye.player1!.id;

    bracket = updateMatchWinner({
      bracket,
      round: 0,
      matchId: matchWithBye.id,
      winnerId,
    });

    // 2라운드 첫 매치에서 player1만 존재하면 부전승 처리
    const nextMatch = bracket.rounds[1][0];
    expect(nextMatch.isBye).toBe(true);
    expect(nextMatch.winnerId).toBe(winnerId);
  });

  it("should throw error if matchId not found", () => {
    const players = createPlayers(4);
    const bracket = generateBracket(players);

    expect(() =>
      updateMatchWinner({
        bracket,
        round: 0,
        matchId: "invalid-id",
        winnerId: players[0].id,
      })
    ).toThrow("Match not found.");
  });

  it("should throw error if next round match not found", () => {
    const players = createPlayers(4);
    const bracket = generateBracket(players);

    // 4명 참가자: 2라운드 생성 (rounds[0], rounds[1])
    // 존재하지 않는 2라운드에서 updateMatchWinner 호출 시 에러 발생
    const nonExistentMatch = {
      id: "non-existent",
      round: 2,
      player1: null,
      player2: null,
      winnerId: null,
      isBye: false,
    };

    expect(() =>
      updateMatchWinner({
        bracket,
        round: 2, // 존재하지 않는 라운드
        matchId: nonExistentMatch.id,
        winnerId: players[0].id,
      })
    ).toThrow("Round not found.");
  });
});
