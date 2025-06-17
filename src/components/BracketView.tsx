"use client";

import { Bracket } from "react-brackets";
import { Tooltip } from "react-tooltip";
import CustomMatch from "./CustomMatch";
import { Shuffle } from "lucide-react";
import { useTournamentStore } from "@/store/tournamentStore";

/**
 * 대진표 전체를 렌더링하고 관리하는 컴포넌트
 */
const BracketView = () => {
  const rounds = useTournamentStore((s) => s.rounds);
  const resetTournament = useTournamentStore((s) => s.resetTournament);
  const assignPlayersRandomly = useTournamentStore(
    (s) => s.assignPlayersRandomly
  );
  const players = useTournamentStore((s) => s.players);
  const tournamentSize = useTournamentStore((s) => s.tournamentSize);

  // `react-brackets`가 빈 rounds 배열을 받으면 에러를 발생시키므로, 렌더링 전에 확인합니다.
  if (rounds.length === 0) {
    return (
      <div className="text-white text-center p-8">토너먼트를 시작해주세요.</div>
    );
  }

  const canRandomAssign = players.length >= tournamentSize;

  return (
    <div className="w-full h-full">
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 p-4 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-white">대진표 설정</h2>
        <div className="flex gap-2">
          <button
            onClick={assignPlayersRandomly}
            disabled={!canRandomAssign}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            data-tooltip-id="random-assign-tooltip"
            data-tooltip-content={
              !canRandomAssign
                ? `플레이어가 최소 ${tournamentSize}명 필요합니다.`
                : "랜덤으로 플레이어를 배치합니다."
            }
          >
            <Shuffle size={18} /> 랜덤 배치
          </button>
          <button
            onClick={resetTournament}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            초기화
          </button>
        </div>
        <Tooltip id="random-assign-tooltip" />
      </div>
      <div className="flex-1 h-full">
        <div className="text-white bg-gray-900 p-4 sm:p-8 rounded-lg max-h-screen overflow-y-auto">
          <Bracket
            rounds={rounds}
            renderSeedComponent={CustomMatch}
            swipeableProps={{ enableMouseEvents: true, onSwiped: () => {} }}
            roundClassName="!mr-12 !mb-12 sm:!mr-24"
            bracketClassName="!min-w-[100%]"
          />
        </div>
      </div>
    </div>
  );
};
export default BracketView;
