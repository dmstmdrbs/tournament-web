"use client";

import { useState } from "react";

export default function Home() {
  const [playerCount, setPlayerCount] = useState<number>(4);

  const handleGenerateBracket = () => {
    console.log("대진표 생성");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          토너먼트 대진표
        </h1>
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="mb-4">
              <label
                htmlFor="playerCount"
                className="block text-sm font-medium text-gray-700"
              >
                플레이어 수
              </label>
              <input
                type="number"
                id="playerCount"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value))}
              />
            </div>
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              onClick={handleGenerateBracket}
            >
              대진표 생성
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
