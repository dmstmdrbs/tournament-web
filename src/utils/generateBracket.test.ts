import { generateBracket } from "./generateBracket";
import { Player } from "../types/player";

// 공통 헬퍼 함수
const createPlayers = (n: number): Player[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `p${i + 1}`,
    name: `Player ${i + 1}`,
  }));

describe("generateBracket", () => {
  it("should generate correct structure for 8 players (no byes)", () => {
    const players = createPlayers(8);
    const bracket = generateBracket(players);

    expect(bracket.meta.totalRounds).toBe(3); // log2(8) = 3
    expect(bracket.meta.bracketSize).toBe(8);
    expect(bracket.meta.byes).toBe(0);
    expect(bracket.rounds.length).toBe(3); // 3 rounds

    // Round 1 should have 4 matches
    expect(bracket.rounds[0]).toHaveLength(4);
  });

  it("should generate correct structure for 5 players (with byes)", () => {
    const players = createPlayers(5);
    const bracket = generateBracket(players);

    expect(bracket.meta.totalRounds).toBe(3); // log2(8)
    expect(bracket.meta.bracketSize).toBe(8);
    expect(bracket.meta.byes).toBe(3);
    expect(bracket.rounds.length).toBe(3);

    const firstRound = bracket.rounds[0];
    expect(firstRound).toHaveLength(4); // 8 / 2 = 4 matches

    const playerCount = firstRound.reduce((acc, match) => {
      return acc + (match.player1 ? 1 : 0) + (match.player2 ? 1 : 0);
    }, 0);

    expect(playerCount).toBe(5); // 총 참가자 5명

    const byes = firstRound.filter((m) => m.isBye);
    expect(byes.length).toBe(3); // 부전승 3개
  });

  it("should assign players to matches in round 1", () => {
    const players = createPlayers(6);
    const bracket = generateBracket(players);
    const round1 = bracket.rounds[0];

    // player1은 항상 존재해야 함
    for (const match of round1) {
      if (match.player1) {
        expect(match.player1.id).toMatch(/^p\d+$/);
      }
      if (match.player2 === null) {
        expect(match.isBye).toBe(true);
        expect(match.winnerId).toBe(match.player1?.id);
      }
    }
  });

  it("should throw error for invalid player counts", () => {
    expect(() => generateBracket(createPlayers(0))).toThrow();
    expect(() => generateBracket(createPlayers(1))).toThrow();
    expect(() => generateBracket(createPlayers(33))).toThrow();
  });
});

describe("generateBracket - expanded cases", () => {
  // 기본 정상 케이스 다수
  const playerCounts = [2, 3, 4, 5, 7, 8, 15, 16, 31, 32];

  playerCounts.forEach((count) => {
    it(`should generate valid bracket for ${count} players`, () => {
      const players = createPlayers(count);
      const bracket = generateBracket(players);

      const expectedBracketSize = Math.pow(2, Math.ceil(Math.log2(count)));
      const expectedTotalRounds = Math.ceil(Math.log2(expectedBracketSize));
      const expectedByes = expectedBracketSize - count;

      expect(bracket.meta.bracketSize).toBe(expectedBracketSize);
      expect(bracket.meta.totalRounds).toBe(expectedTotalRounds);
      expect(bracket.meta.byes).toBe(expectedByes);

      // 1라운드 매치 수 = bracketSize / 2
      expect(bracket.rounds[0].length).toBe(expectedBracketSize / 2);

      // 총 참가자 수 체크 (player1 + player2 합)
      const playerCountInFirstRound = bracket.rounds[0].reduce(
        (acc, match) => acc + (match.player1 ? 1 : 0) + (match.player2 ? 1 : 0),
        0
      );
      expect(playerCountInFirstRound).toBe(count);

      // 부전승 개수 확인
      const byeMatches = bracket.rounds[0].filter((m) => m.isBye);
      expect(byeMatches.length).toBe(expectedByes);

      // 부전승 매치 특성 확인
      for (const match of byeMatches) {
        expect(match.player2).toBeNull();
        expect(match.player1).not.toBeNull();
        expect(match.winnerId).toBe(match.player1!.id);
      }
    });
  });

  it("should distribute byes randomly across multiple runs", () => {
    const players = createPlayers(10); // 10명 참가
    const byePositionsSet = new Set<number>();
    const runs = 50;

    for (let i = 0; i < runs; i++) {
      const bracket = generateBracket(players);
      bracket.rounds[0].forEach((match, idx) => {
        if (match.isBye) {
          byePositionsSet.add(idx);
        }
      });
    }

    // 10명 참가면 bracketSize=16, byes=6
    // 여러번 돌면서 여러 인덱스가 부전승 될 가능성 기대
    expect(byePositionsSet.size).toBeGreaterThan(3);
  });
});
