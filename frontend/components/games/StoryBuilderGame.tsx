"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const STORIES = [
  {
    title: 'Morning Routine',
    sentences: ['Wake up from bed', 'Brush your teeth', 'Eat breakfast', 'Go to school'],
    emojis: ['🛏️', '🪥', '🥣', '🏫'],
  },
  {
    title: 'Plant a Seed',
    sentences: ['Dig a hole', 'Put the seed in', 'Water the seed', 'Watch it grow'],
    emojis: ['🕳️', '🌱', '💧', '🌻'],
  },
  {
    title: 'Make a Sandwich',
    sentences: ['Get two slices of bread', 'Put cheese on one', 'Add lettuce', 'Close the sandwich'],
    emojis: ['🍞', '🧀', '🥬', '🥪'],
  },
  {
    title: 'Build a Snowman',
    sentences: ['Roll a big snowball', 'Roll a smaller one', 'Stack them up', 'Add a carrot nose'],
    emojis: ['⚪', '🔵', '⛄', '🥕'],
  },
];

export default function StoryBuilderGame({ onAnswer, round, difficulty }) {
  const [story, setStory] = useState(null);
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const [order, setOrder] = useState([]);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const idx = round % STORIES.length;
    const s = STORIES[idx];
    const indices = s.sentences.map((_, i) => i);
    const shuffled = [...indices].sort(() => Math.random() - 0.5);
    setStory(s);
    setShuffledIndices(shuffled);
    setOrder([]);
    startTime.current = Date.now();
  }, [round]);

  if (!story) return null;

  function handleSelect(shuffledIdx) {
    if (order.includes(shuffledIdx)) return;
    const newOrder = [...order, shuffledIdx];
    setOrder(newOrder);

    if (newOrder.length === story.sentences.length) {
      const originalOrder = newOrder.map(si => shuffledIndices[si]);
      const correct = originalOrder.every((val, i) => val === i);
      const responseTime = Date.now() - startTime.current;
      setTimeout(() => onAnswer(correct, responseTime), 500);
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="text-center">
        <p className="font-child text-white/50 text-lg">📖 {story.title}</p>
        <p className="font-child text-white/30 text-sm">Put the story in the right order!</p>
      </div>

      {/* Order display */}
      <div className="flex gap-2 mb-2">
        {story.sentences.map((_, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center font-child text-sm font-bold
              ${order[i] !== undefined
                ? 'bg-purple-500/30 border border-purple-400 text-purple-300'
                : 'border border-dashed border-white/20 text-white/20'
              }
            `}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Cards to pick */}
      <div className="flex flex-col gap-3 w-full max-w-sm">
        {shuffledIndices.map((originalIdx, shuffledIdx) => {
          const picked = order.includes(shuffledIdx);
          const pickOrder = order.indexOf(shuffledIdx);
          return (
            <motion.button
              key={shuffledIdx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: picked ? 0.4 : 1, x: 0 }}
              transition={{ delay: shuffledIdx * 0.1 }}
              onClick={() => handleSelect(shuffledIdx)}
              disabled={picked}
              className={`flex items-center gap-4 p-4 rounded-xl text-left transition-all
                ${picked
                  ? 'bg-white/5 border border-white/10'
                  : 'bg-white/10 border border-white/20 hover:bg-white/15 cursor-pointer'
                }
              `}
            >
              <span className="text-3xl">{story.emojis[originalIdx]}</span>
              <span className="font-child text-white font-medium">{story.sentences[originalIdx]}</span>
              {picked && (
                <span className="ml-auto font-child text-purple-400 font-bold">#{pickOrder + 1}</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}