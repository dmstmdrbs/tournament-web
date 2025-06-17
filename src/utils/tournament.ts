// 토너먼트 기본 사이즈 옵션
export const TOURNAMENT_SIZES = [4, 8, 16];

// 다음 라운드 및 매치 인덱스를 계산하는 함수
export const getNextMatchIndices = (
  roundIndex: number,
  matchIndex: number
) => ({
  roundIndex: roundIndex + 1,
  matchIndex: Math.floor(matchIndex / 2),
});
