"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SOUNDS = ["ka", "ma", "ta", "pa", "ba", "da", "sa", "la", "na", "ri"];

function generateSequence(length: number) {
  const seq: string[] = [];

  for (let i = 0; i < length; i++) {
    seq.push(SOUNDS[Math.floor(Math.random() * SOUNDS.length)]);
  }

  return seq;
}

export default function ReverseRecallGame({ onAnswer, round, difficulty }: any) {
  const seqLength = Math.min(2 + Math.floor(difficulty / 2), 5);

  const [phase, setPhase] = useState("showing");
  const [sequence, setSequence] = useState<string[]>([]);
  const [showIndex, setShowIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);

  const startTime = useRef(Date.now());

  useEffect(() => {
    const seq = generateSequence(seqLength);

    setSequence(seq);
    setUserAnswer([]);
    setPhase("showing");
    setShowIndex(0);
  }, [round, seqLength]);

  useEffect(() => {
    if (phase !== "showing") return;

    if (showIndex < sequence.length) {
      const timer = setTimeout(() => {
        setShowIndex(showIndex + 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setPhase("answering");
        startTime.current = Date.now();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [phase, showIndex, sequence.length]);

  function handlePick(sound: string) {
    const newAnswer = [...userAnswer, sound];
    setUserAnswer(newAnswer);

    if (newAnswer.length === sequence.length) {
      const reversed = [...sequence].reverse();
      const correct = newAnswer.every((s, i) => s === reversed[i]);
      const responseTime = Date.now() - startTime.current;

      setTimeout(() => onAnswer(correct, responseTime), 500);
    }
  }

  if (phase === "showing") {
    return (
      <div className="flex flex-col items-center justify-center gap-8 py-12">
        <p className="font-child text-white/60 text-lg">
          Remember this sequence!
        </p>

        <div className="flex gap-4">
          {sequence.map((s, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{
                scale: i <= showIndex ? 1 : 0,
                opacity: i === showIndex ? 1 : 0.4,
              }}
              className="w-16 h-16 rounded-2xl bg-purple-500/30 border border-purple-400/50 flex items-center justify-center"
            >
              <span className="font-child text-white font-bold text-xl">
                {i <= showIndex ? s : ""}
              </span>
            </motion.div>
          ))}
        </div>

        <p className="font-child text-yellow-400 text-sm animate-pulse">
          👀 Watch carefully...
        </p>
      </div>
    );
  }

  const reversed = [...sequence].reverse();

  const soundOptions = SOUNDS.slice(0, 6)
    .concat(sequence.filter((s) => !SOUNDS.slice(0, 6).includes(s)))
    .filter((v, i, a) => a.indexOf(v) === i);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div>
        <p className="font-child text-white/60 text-lg text-center mb-2">
          Now tap them in REVERSE order!
        </p>

        <p className="font-child text-white/40 text-sm text-center">
          ({userAnswer.length}/{sequence.length} selected)
        </p>
      </div>

      <div className="flex gap-3">
        {reversed.map((_, i) => (
          <div
            key={i}
            className={`w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center ${
              userAnswer[i]
                ? userAnswer[i] === reversed[i]
                  ? "bg-green-500/20 border-green-400"
                  : "bg-red-500/20 border-red-400"
                : "border-white/20"
            }`}
          >
            <span className="font-child text-white font-bold">
              {userAnswer[i] || ""}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3 max-w-sm">
        {soundOptions.map((sound) => (
          <button
            key={sound}
            onClick={() => handlePick(sound)}
            disabled={userAnswer.length >= sequence.length}
            className="font-child text-lg px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-30"
          >
            {sound}
          </button>
        ))}
      </div>
    </div>
  );
}