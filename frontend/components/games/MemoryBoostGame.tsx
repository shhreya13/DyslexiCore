"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PAIRS = [
  { word: 'cat', match: '🐱' },
  { word: 'dog', match: '🐶' },
  { word: 'sun', match: '☀️' },
  { word: 'fish', match: '🐟' },
  { word: 'star', match: '⭐' },
  { word: 'tree', match: '🌳' },
  { word: 'bird', match: '🐦' },
  { word: 'hat', match: '🎩' },
];

function createBoard(pairCount) {
  const selected = PAIRS.slice(0, pairCount);
  const tiles = [];
  selected.forEach((pair, i) => {
    tiles.push({ id: i * 2, pairId: i, content: pair.word, type: 'word' });
    tiles.push({ id: i * 2 + 1, pairId: i, content: pair.match, type: 'image' });
  });
  return tiles.sort(() => Math.random() - 0.5);
}

export default function MemoryBoostGame({ onAnswer, round, difficulty }) {
  const pairCount = Math.min(3 + Math.floor(difficulty / 2), 6);
  const [tiles, setTiles] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [attempts, setAttempts] = useState(0);
  const startTime = useRef(Date.now());
  const totalPairsRef = useRef(0);

  useEffect(() => {
    const board = createBoard(pairCount);
    setTiles(board);
    setFlipped([]);
    setMatched(new Set());
    setAttempts(0);
    totalPairsRef.current = pairCount;
    startTime.current = Date.now();
  }, [round, pairCount]);

  function handleFlip(index) {
    if (flipped.length >= 2 || flipped.includes(index) || matched.has(tiles[index].pairId)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setAttempts(a => a + 1);
      const [first, second] = newFlipped;
      if (tiles[first].pairId === tiles[second].pairId) {
        const newMatched = new Set(matched);
        newMatched.add(tiles[first].pairId);
        setMatched(newMatched);
        setFlipped([]);

        if (newMatched.size === totalPairsRef.current) {
          const responseTime = Date.now() - startTime.current;
          const accuracy = totalPairsRef.current / (attempts + 1);
          setTimeout(() => onAnswer(accuracy >= 0.5, responseTime), 600);
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  }

  const cols = tiles.length <= 8 ? 4 : 4;

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <div className="text-center">
        <p className="font-child text-white/50 text-lg">🧠 Match the pairs!</p>
        <p className="font-child text-white/30 text-sm">Attempts: {attempts}</p>
      </div>

      <div className={`grid gap-3 w-full max-w-sm`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {tiles.map((tile, i) => {
          const isFlipped = flipped.includes(i);
          const isMatched = matched.has(tile.pairId);
          const showContent = isFlipped || isMatched;

          return (
            <motion.button
              key={tile.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotateY: showContent ? 180 : 0 }}
              transition={{ scale: { delay: i * 0.05 } }}
              onClick={() => handleFlip(i)}
              className={`aspect-square rounded-xl font-child font-bold transition-all
                ${isMatched
                  ? 'bg-green-500/20 border border-green-400/40'
                  : showContent
                  ? 'bg-purple-500/20 border border-purple-400/40'
                  : 'bg-white/10 border border-white/20 hover:bg-white/15 cursor-pointer'
                }
              `}
            >
              {showContent ? (
                <span className={tile.type === 'image' ? 'text-3xl' : 'text-lg text-white'}>
                  {tile.content}
                </span>
              ) : (
                <span className="text-2xl">❓</span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}