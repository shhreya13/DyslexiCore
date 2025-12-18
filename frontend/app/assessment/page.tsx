'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../layout';
import { useRouter } from 'next/navigation';

export default function AssessmentGame() {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); 
  const [currentTarget, setCurrentTarget] = useState({ x: 50, y: 50, char: 'ba' });
  
  const chars = ['ba', 'da', 'pa', 'ma', 'ka'];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      finishGame();
    }
    return () => clearInterval(timerRef.current!);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setMisses(0);
    setTimeLeft(15);
    setGameState('playing');
    spawnTarget();
  };

  const spawnTarget = () => {
    setCurrentTarget({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      char: chars[Math.floor(Math.random() * chars.length)],
    });
  };

  const handleHit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScore(s => s + 1);
    spawnTarget();
  };

  const handleMiss = () => {
    if (gameState === 'playing') setMisses(m => m + 1);
  };

  const finishGame = async () => {
    setGameState('finished');
    const totalAttempts = score + misses;
    const accuracy = totalAttempts > 0 ? (score / totalAttempts) * 100 : 0;
    
    const payload = {
      test_type: "Phoneme Popper Game",
      total_time_sec: 15,
      accuracy_percent: accuracy,
      phonological_score: Math.min(score / 20, 1.0),
      naming_speed_score: Math.min(totalAttempts / 25, 1.0),
      working_memory_score: 0.85 
    };

    try {
      await fetch('http://127.0.0.1:8000/api/assessment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Failed to save game results");
    }
  };

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="game-container" style={{ 
      height: '80vh', 
      position: 'relative', 
      background: 'linear-gradient(to bottom, #e0f2fe, #bae6fd)', // Watery blue background
      borderRadius: '20px',
      overflow: 'hidden',
      cursor: 'crosshair',
      border: '4px solid #0ea5e9'
    }} onClick={handleMiss}>
      
      {/* Dynamic Bubble Style Injection */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
          100% { transform: translateY(0px) scale(1); }
        }
        .bubble-target {
          animation: float 2s infinite ease-in-out;
          transition: all 0.2s ease;
        }
        .bubble-target:active {
          transform: scale(0.8);
          filter: brightness(1.2);
        }
      `}</style>
      
      <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(5px)', borderBottom: '2px solid #0ea5e9' }}>
        <h2 style={{ margin: 0, color: '#0369a1' }}>🫧 Phoneme Bubbles</h2>
        <div style={{ color: '#0369a1', fontWeight: 'bold' }}>
          <span style={{ marginRight: '20px' }}>Popped: {score}</span>
          <span>Timer: {timeLeft}s</span>
        </div>
      </div>

      {gameState === 'idle' && (
        <div style={centerStyle}>
          <h1 style={{ color: '#0369a1' }}>Ready to Pop?</h1>
          <p>Click the sound bubbles as they appear to test your focus!</p>
          <button onClick={startGame} style={buttonStyle}>Start Mission</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div 
          className="bubble-target"
          onClick={handleHit}
          style={{
            position: 'absolute',
            left: `${currentTarget.x}%`,
            top: `${currentTarget.y}%`,
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0369a1',
            fontWeight: 'bold',
            fontSize: '28px',
            border: '2px solid rgba(255, 255, 255, 0.6)',
            boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.5), 0 10px 15px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(2px)',
            userSelect: 'none'
          }}
        >
          {currentTarget.char}
          {/* Shine effect on bubble */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '15%',
            width: '20px',
            height: '20px',
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%'
          }} />
        </div>
      )}

      {gameState === 'finished' && (
        <div style={centerStyle}>
          <h1 style={{ color: '#0369a1' }}>Session Complete!</h1>
          <p>Analyzing your results...</p>
          <div style={{ fontSize: '24px', margin: '20px 0', color: '#0369a1', fontWeight: 'bold' }}>
            Accuracy: {((score / (score + misses)) * 100).toFixed(1)}%
          </div>
          <button onClick={() => router.push('/dashboard')} style={buttonStyle}>Go to Dashboard</button>
        </div>
      )}
    </div>
  );
}

const centerStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  background: 'rgba(255, 255, 255, 0.9)',
  padding: '40px',
  borderRadius: '30px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  border: '2px solid #bae6fd'
};

const buttonStyle: React.CSSProperties = {
  background: '#0ea5e9',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '50px',
  border: 'none',
  fontSize: '18px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '20px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
};