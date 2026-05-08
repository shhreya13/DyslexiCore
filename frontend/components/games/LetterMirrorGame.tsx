"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const LETTER_SETS = [
  { target: "b", options: ["b", "d", "p", "q"] },
  { target: "d", options: ["d", "b", "q", "p"] },
  { target: "p", options: ["p", "q", "b", "d"] },
  { target: "q", options: ["q", "p", "d", "b"] },
  { target: "M", options: ["M", "W", "N", "V"] },
  { target: "W", options: ["W", "M", "V", "N"] },
  { target: "n", options: ["n", "u", "m", "h"] },
  { target: "u", options: ["u", "n", "v", "c"] },
];

export default function LetterMirrorGame({ onAnswer, round, difficulty }: any) {
  const [current, setCurrent] = useState<any>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const idx = round % LETTER_SETS.length;
    const set = LETTER_SETS[idx];
    const shuffled = [...set.options].sort(() => Math.random() - 0.5);

    setCurrent({ ...set, options: shuffled });
    setSelected(null);
    startTime.current = Date.now();
  }, [round]);

  if (!current) return null;

  function handleSelect(letter: string, index: number) {
    if (selected !== null) return;

    setSelected(index);

    const responseTime = Date.now() - startTime.current;
    const correct = letter === current.target;

    const errorPattern = !correct
      ? `mirror_confused_${current.target}_with_${letter}`
      : null;

    setTimeout(() => onAnswer(correct, responseTime, errorPattern), 500);
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <motion.div
        key={round}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/10 backdrop-blur-sm rounded-3xl px-10 py-6 border border-white/20"
      >
        <p className="font-child text-white/50 text-sm mb-2 text-center">
          Find this letter:
        </p>

        <p className="font-child text-8xl font-bold text-white text-center">
          {current.target}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {current.options.map((letter: string, i: number) => (
          <motion.button
            key={`${round}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleSelect(letter, i)}
            className={`h-24 rounded-2xl font-child text-5xl font-bold transition-all ${
              selected === i
                ? letter === current.target
                  ? "bg-green-500/30 border-green-400 text-green-300 border-2"
                  : "bg-red-500/30 border-red-400 text-red-300 border-2"
                : "bg-white/10 border border-white/20 text-white hover:bg-white/15 cursor-pointer"
            }`}
          >
            {letter}
          </motion.button>
        ))}
      </div>
    </div>
  );
}