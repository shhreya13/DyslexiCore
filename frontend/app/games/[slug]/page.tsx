"use client";

import { useState } from "react";
import Link from "next/link";

import LetterMirrorGame from "@/components/games/LetterMirrorGame";
import ReverseRecallGame from "@/components/games/ReverseRecallGame";
import MemoryBoostGame from "@/components/games/MemoryBoostGame";
import StoryBuilderGame from "@/components/games/StoryBuilderGame";

const gameMap: any = {
  "letter-mirror": LetterMirrorGame,
  "reverse-recall": ReverseRecallGame,
  "memory-boost": MemoryBoostGame,
  "story-builder": StoryBuilderGame
};

const gameTitles: any = {
  "letter-mirror": "Letter Mirror",
  "reverse-recall": "Reverse Recall",
  "memory-boost": "Memory Boost",
  "story-builder": "Story Builder"
};

export default function GamePlayPage({ params }: any) {
  const slug = params.slug;
  const GameComponent = gameMap[slug];

  const [round, setRound] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [score, setScore] = useState(0);
  const [lastResult, setLastResult] = useState("");

  if (!GameComponent) {
    return (
      <main className="min-h-screen bg-[#2c003e] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Game Not Found</h1>
          <Link href="/games" className="underline">
            Back to Games
          </Link>
        </div>
      </main>
    );
  }

  function handleAnswer(
    correct: boolean,
    responseTime: number,
    errorPattern?: string
  ) {
    if (correct) {
      setScore((prev) => prev + 10);
      setLastResult(`Correct! Response time: ${responseTime}ms`);
    } else {
      setLastResult(
        errorPattern
          ? `Try again. Pattern detected: ${errorPattern}`
          : `Try again. Response time: ${responseTime}ms`
      );
    }

    setRound((prev) => prev + 1);

    if ((round + 1) % 3 === 0) {
      setDifficulty((prev) => prev + 1);
    }
  }

  return (
    <main className="min-h-screen bg-[#2c003e] text-white px-6 py-8">
      <div className="max-w-3xl mx-auto">

        <Link href="/games" className="text-white/60 hover:text-white">
          ← Back to Games
        </Link>

        <div className="mt-6 mb-6 text-center">
          <h1 className="text-4xl font-bold">
            {gameTitles[slug]}
          </h1>

          <p className="text-white/50 mt-2">
            Round {round + 1} · Difficulty {difficulty} · Score {score}
          </p>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-3xl p-6 shadow-xl">
          <GameComponent
            onAnswer={handleAnswer}
            round={round}
            difficulty={difficulty}
          />
        </div>

        {lastResult && (
          <div className="mt-6 text-center bg-white/10 border border-white/20 rounded-xl p-4">
            {lastResult}
          </div>
        )}

      </div>
    </main>
  );
}