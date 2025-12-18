// frontend/app/learn/lesson/1/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './l.css'; 

// !!! CRITICAL FIX: The path to layout.tsx is 3 levels up from this file !!!
// From: /learn/lesson/1/page.tsx
// To: /layout.tsx
import { useAuth } from '../../../layout'; 

// CVC Word Data
const CVC_WORDS = [
    { word: "CAT", c1: "C", v: "A", c2: "T" },
    { word: "MAP", c1: "M", v: "A", c2: "P" },
    { word: "FAN", c1: "F", v: "A", c2: "N" },
    { word: "BAG", c1: "B", v: "A", c2: "G" },
];

const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'Y', 'Z'];
const VOWELS = ['A']; 

export default function LessonPage() {
    const { user } = useAuth();
    
    const [wordIndex, setWordIndex] = useState(0);
    const currentTask = CVC_WORDS[wordIndex];

    const [c1, setC1] = useState(CONSONANTS[0]);
    const [v, setV] = useState(VOWELS[0]);
    const [c2, setC2] = useState(CONSONANTS[1]);

    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        setC1(CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)]);
        setC2(CONSONANTS[Math.floor(Math.random() * CONSONANTS.length)]);
    }, [wordIndex]);
    
    const cycleLetter = (currentLetter: string, letterType: 'C' | 'V', setter: React.Dispatch<React.SetStateAction<string>>) => {
        const list = letterType === 'C' ? CONSONANTS : VOWELS;
        const currentIndex = list.indexOf(currentLetter);
        const nextIndex = (currentIndex + 1) % list.length;
        setter(list[nextIndex]);
        setFeedback(''); 
        setIsCorrect(null);
    };

    const checkWord = () => {
        const userWord = `${c1}${v}${c2}`;
        if (userWord === currentTask.word) {
            setIsCorrect(true);
            setFeedback("Awesome! That's the word " + currentTask.word + "!");
            setTimeout(() => {
                if (wordIndex < CVC_WORDS.length - 1) {
                    setWordIndex(wordIndex + 1);
                    setFeedback('');
                    setIsCorrect(null);
                } else {
                    setFeedback("Lesson Complete! Great job with all the Short A words!");
                }
            }, 1500);
        } else {
            setIsCorrect(false);
            setFeedback("Try again! That word isn't " + currentTask.word + ".");
        }
    };
    
    // --- Render Logic ---

    const feedbackClass = isCorrect === true ? 'feedback-correct' : (isCorrect === false ? 'feedback-incorrect' : '');

    return (
        <div className="lesson-container">
            <h1 className="lesson-header">CVC Word Explorer: Short A</h1>
            <p className="lesson-instruction">
                Click the blocks to cycle letters and form the word: 
                <span style={{ color: currentTask.c1, fontWeight: 'bolder' }}> {currentTask.word}</span>
            </p>

            {/* --- CVC Word Formation Display --- */}
            <div className="word-grid">
                {/* Consonant 1 */}
                <div 
                    className="letter-box" 
                    onClick={() => cycleLetter(c1, 'C', setC1)}
                >
                    {c1}
                </div>

                {/* Vowel (Short A) */}
                <div 
                    className="letter-box vowel" 
                    onClick={() => cycleLetter(v, 'V', setV)}
                >
                    {v}
                </div>

                {/* Consonant 2 */}
                <div 
                    className="letter-box" 
                    onClick={() => cycleLetter(c2, 'C', setC2)}
                >
                    {c2}
                </div>
            </div>

            {/* --- Feedback Box --- */}
            <div className={`feedback-box ${feedbackClass}`}>
                {feedback}
            </div>

            {/* --- Controls --- */}
            <div className="controls-grid">
                <button 
                    onClick={checkWord} 
                    className="control-button check-button"
                    disabled={isCorrect === true && wordIndex < CVC_WORDS.length - 1}
                >
                    Check Word
                </button>
                <button 
                    onClick={() => {setC1(currentTask.c1); setC2(currentTask.c2); setFeedback(''); setIsCorrect(null);}} 
                    className="control-button"
                >
                    Hint (Show Correct)
                </button>
                <button 
                    onClick={() => setWordIndex(CVC_WORDS.length - 1)} 
                    className="control-button"
                    disabled={wordIndex === CVC_WORDS.length - 1}
                >
                    Skip to End
                </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '40px' }}>
                Word {wordIndex + 1} of {CVC_WORDS.length}
            </p>

            <p style={{ textAlign: 'center', marginTop: '30px' }}>
                <Link href="/learn" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                    ← Back to Modules
                </Link>
            </p>
        </div>
    );
}