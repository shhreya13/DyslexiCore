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
  "story-builder": StoryBuilderGame,
};

const gameTitles: any = {
  "letter-mirror": "Letter Mirror",
  "reverse-recall": "Reverse Recall",
  "memory-boost": "Memory Boost",
  "story-builder": "Story Builder",
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
      <main className="container">
        <h1>Game Not Found</h1>
        <p>Current slug: {slug}</p>

        <Link href="/games">
          Back to Games
        </Link>
      </main>
    );
  }

  function handleAnswer(correct: boolean, responseTime: number, errorPattern?: string) {
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
    <main
      style={{
        minHeight: "100vh",
        background: "#2c003e",
        color: "white",
        padding: "40px",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Link href="/games" style={{ color: "white" }}>
          ← Back to Games
        </Link>

        <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2.5rem" }}>
            {gameTitles[slug]}
          </h1>

          <p>
            Round {round + 1} · Difficulty {difficulty} · Score {score}
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "24px",
            padding: "30px",
          }}
        >
          <GameComponent
            onAnswer={handleAnswer}
            round={round}
            difficulty={difficulty}
          />
        </div>

        {lastResult && (
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              background: "rgba(255,255,255,0.1)",
              padding: "15px",
              borderRadius: "12px",
            }}
          >
            {lastResult}
          </div>
        )}
      </div>
    </main>
  );
}