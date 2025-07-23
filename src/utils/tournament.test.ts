import {
  shuffle,
  nextPowerOfTwo,
  calculateTotalRounds,
  calculateByes,
} from "./tournament";

describe("tournament.ts", () => {
  describe("shuffle", () => {
    it("should shuffle array elements without loss", () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffle(original);

      // 길이 동일
      expect(shuffled).toHaveLength(original.length);

      // 요소는 동일
      expect(shuffled.sort()).toEqual([...original].sort());

      // 셔플과 원본이 다를 가능성이 높지만, 같을 수도 있으므로 경고만 출력
      if (shuffled.every((v, i) => v === original[i])) {
        console.warn("⚠️ Shuffle result same as original — may be coincidence");
      }
    });
  });

  describe("nextPowerOfTwo", () => {
    it("should return the same number if already power of two", () => {
      expect(nextPowerOfTwo(8)).toBe(8);
      expect(nextPowerOfTwo(16)).toBe(16);
    });

    it("should return next power of two if not already", () => {
      expect(nextPowerOfTwo(5)).toBe(8);
      expect(nextPowerOfTwo(9)).toBe(16);
    });

    it("should throw on n < 1", () => {
      expect(() => nextPowerOfTwo(0)).toThrow();
    });
  });

  describe("calculateTotalRounds", () => {
    it("should return correct number of rounds", () => {
      expect(calculateTotalRounds(2)).toBe(1);
      expect(calculateTotalRounds(5)).toBe(3);
      expect(calculateTotalRounds(9)).toBe(4);
    });
  });

  describe("calculateByes", () => {
    it("should return correct number of byes", () => {
      expect(calculateByes(5)).toBe(3); // 8 - 5
      expect(calculateByes(8)).toBe(0); // 8 - 8
      expect(calculateByes(11)).toBe(5); // 16 - 11
    });
  });
});
