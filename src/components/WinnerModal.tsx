"use client";

import React, { useEffect } from "react";
import { Crown } from "lucide-react";
import type { Player } from "../store/tournamentStore";

const WinnerModal = ({
  winner,
  onReset,
}: {
  winner: Player | null;
  onReset: () => void;
}) => {
  useEffect(() => {
    if (!winner) return;
    const showConfetti = async () => {
      const confetti = (await import("canvas-confetti")).default;
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 1000,
      };

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval: NodeJS.Timeout = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    };
    showConfetti();
  }, [winner]);

  if (!winner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border-2 border-yellow-400 transform scale-100 transition-transform duration-500">
        <Crown className="w-24 h-24 mx-auto text-yellow-400 mb-4 animate-bounce" />
        <h2 className="text-4xl font-bold text-white mb-2">최종 우승!</h2>
        <p className="text-5xl font-extrabold text-yellow-300 mb-6">
          {winner.name}
        </p>
        <button
          onClick={onReset}
          className="mt-4 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
        >
          새 토너먼트 시작하기
        </button>
      </div>
    </div>
  );
};

export default WinnerModal;
