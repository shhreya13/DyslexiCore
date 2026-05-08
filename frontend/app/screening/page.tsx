'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DyslexiCoreStarGame() {
    const router = useRouter();
    const [step, setStep] = useState(0); 
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15); 
    const [starPos, setStarPos] = useState({ top: 50, left: 50 });
    const [isSaving, setIsSaving] = useState(false);

    // --- GAME ENGINE ---
    useEffect(() => {
        let timer: NodeJS.Timeout;
        let starInterval: NodeJS.Timeout;

        if (step === 1 && timeLeft > 0) {
            // Main countdown timer
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            
            // Move the star every 1.5 seconds to keep it engaging but kid-friendly
            starInterval = setInterval(() => {
                setStarPos({ 
                    top: Math.random() * 60 + 20, 
                    left: Math.random() * 70 + 15 
                });
            }, 1500);

        } else if (timeLeft === 0 && step === 1) {
            setStep(2); // Move to results when time is up
        }

        return () => {
            clearInterval(timer);
            clearInterval(starInterval);
        };
    }, [step, timeLeft]);

    const handleStarHit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setScore(prev => prev + 1);
        // Move immediately on click so the player feels the impact
        setStarPos({ 
            top: Math.random() * 60 + 20, 
            left: Math.random() * 70 + 15 
        });
    };

    const handleFinish = async () => {
        setIsSaving(true);
        // This is where you connect to your FastAPI backend
        try {
            // Simulated API call to your backend/assessment/submit
            console.log("Saving score to DyslexiCore Database:", score);
            router.push('/dashboard');
        } catch (error) {
            console.error("Save failed", error);
            router.push('/dashboard');
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'radial-gradient(circle, #1e1b4b 0%, #020617 100%)', 
            color: 'white', 
            position: 'relative', 
            overflow: 'hidden', 
            fontFamily: 'sans-serif' 
        }}>
            
            {/* HUD */}
            {step === 1 && (
                <div style={hudStyle}>
                    <div style={hudBox}>Time Remaining: {timeLeft}s</div>
                    <div style={hudBox}>Stars Caught: {score}</div>
                </div>
            )}

            {/* START SCREEN */}
            {step === 0 && (
                <div style={modalStyle}>
                    <h1 style={{ color: '#60a5fa', fontSize: '2.5rem', marginBottom: '10px' }}>Star Tracker</h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                        Calibration Mission: Catch as many stars as you can to test your visual focus!
                    </p>
                    <button onClick={() => setStep(1)} style={btnStyle}>Launch Mission</button>
                </div>
            )}

            {/* THE GAME AREA */}
            {step === 1 && (
                <div 
                    onClick={handleStarHit}
                    style={{ 
                        position: 'absolute', 
                        top: `${starPos.top}%`, 
                        left: `${starPos.left}%`,
                        fontSize: '5.5rem', 
                        cursor: 'pointer', 
                        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        filter: 'drop-shadow(0 0 20px gold)',
                        userSelect: 'none',
                        zIndex: 10
                    }}
                >
                    ⭐
                </div>
            )}

            {/* RESULTS SCREEN */}
            {step === 2 && (
                <div style={modalStyle}>
                    <h2 style={{ color: '#22c55e', fontSize: '2rem' }}>Mission Complete!</h2>
                    <div style={{ margin: '25px 0', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
                        <p style={{ fontSize: '1.2rem' }}>You caught <b>{score}</b> stars!</p>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '10px' }}>
                            Your visual tracking data is ready for analysis.
                        </p>
                    </div>
                    <button onClick={handleFinish} style={btnStyle}>
                        {isSaving ? "Syncing..." : "Update DyslexiCore"}
                    </button>
                </div>
            )}
        </div>
    );
}

// STYLES
const hudStyle: React.CSSProperties = { position: 'absolute', top: '30px', width: '100%', display: 'flex', justifyContent: 'center', gap: '40px', zIndex: 100 };
const hudBox: React.CSSProperties = { background: 'rgba(255,255,255,0.1)', padding: '12px 25px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', fontWeight: 'bold', fontSize: '1.1rem' };
const modalStyle: React.CSSProperties = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', background: '#1e293b', padding: '50px', borderRadius: '35px', border: '4px solid #3b82f6', width: '90%', maxWidth: '450px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' };
const btnStyle: React.CSSProperties = { marginTop: '15px', padding: '18px 45px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontSize: '1.3rem', fontWeight: 'bold', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)', transition: 'transform 0.2s' };