/**
 * 배열을 무작위로 섞는다 (Fisher–Yates Shuffle)
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 주어진 숫자보다 크거나 같은 2의 거듭제곱을 반환
 * ex) 5 → 8, 8 → 8, 13 → 16
 */
export function nextPowerOfTwo(n: number): number {
  if (n < 1) throw new Error("n must be >= 1");
  return 2 ** Math.ceil(Math.log2(n));
}

/**
 * 주어진 참가자 수에 맞는 총 라운드 수 계산
 * ex) 5명 → 8명 토너먼트 → 라운드 수 3
 */
export function calculateTotalRounds(playerCount: number): number {
  return Math.ceil(Math.log2(nextPowerOfTwo(playerCount)));
}

/**
 * 주어진 참가자 수에 필요한 부전승 수 계산
 * ex) 5명 → 8자리 트리 필요 → 3명 부전승
 */
export function calculateByes(playerCount: number): number {
  return nextPowerOfTwo(playerCount) - playerCount;
}
