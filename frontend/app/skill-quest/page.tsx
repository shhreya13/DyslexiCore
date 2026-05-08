'use client';

import React, { useState, useEffect, useRef } from 'react';
import './page.css'; 

// --- Configuration and Data ---

const WORD_LIST = [
    'RUN', 'EAT', 'JUMP', 'TAILWIND', 'COMPONENT',
    'GAMIFY', 'LEVELUP', 'QUEST', 'SKILL', 'SYNTAX',
    'PROMISE', 'ASYNCHRONOUS', 'OPTIMIZE', 'CANVAS', 'DEPLOY',
    'WIDGET', 'RENDER', 'HOOKS', 'ELEMENT', 'FLUX'
];
const WORDS_PER_LEVEL = 5; 

// --- Utility Components ---

interface WordDisplayProps {
    word: string;
    input: string;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word, input }) => {
    return (
        // The .word-display-size class contains the crucial white-space: nowrap property
        <div className="text-center font-word my-10 word-display-size" style={{ minHeight: '120px' }}>
            {word.split('').map((char, index) => {
                const inputChar = input[index];
                let charClass = 'text-dimmed'; 

                if (index < input.length) {
                    charClass = inputChar === char ? 'text-correct' : 'text-incorrect';
                }

                return (
                    <span 
                        key={index} 
                        className={`inline-block transition-all duration-100 ${charClass} ${index < input.length ? 'scale-105' : ''}`}
                    >
                        {char}
                    </span>
                );
            })}
        </div>
    );
};

// --- Main App Component (The Typing Quest Game) ---
const TypingQuestGame: React.FC = () => {
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [wordsTypedInLevel, setWordsTypedInLevel] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [isIncorrect, setIsIncorrect] = useState(false);
    const [isLevelUp, setIsLevelUp] = useState(false); 
    
    const inputRef = useRef<HTMLInputElement>(null);

    const levelProgress = Math.round((wordsTypedInLevel / WORDS_PER_LEVEL) * 100);

    const getNewWord = () => {
        const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
        setCurrentWord(WORD_LIST[randomIndex]);
    };

    const startGame = () => {
        setLevel(1);
        setScore(0);
        setWordsTypedInLevel(0);
        setInputValue('');
        setGameStatus('playing');
        setIsLevelUp(false);
        getNewWord();
    };
    
    const handleNextWord = () => {
        if (wordsTypedInLevel + 1 >= WORDS_PER_LEVEL) {
            setLevel(l => l + 1);
            setWordsTypedInLevel(0);
            setIsLevelUp(true);
            setTimeout(() => setIsLevelUp(false), 2500);
        } else {
            setWordsTypedInLevel(w => w + 1);
        }
        
        setInputValue('');
        getNewWord();
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (gameStatus !== 'playing' || !currentWord) return;

        const newInputValue = event.target.value.toUpperCase();
        setInputValue(newInputValue);

        if (newInputValue === currentWord) {
            setIsIncorrect(false);
            setScore(s => s + 1);
            handleNextWord();
            return;
        }

        if (currentWord.startsWith(newInputValue)) {
            setIsIncorrect(false);
        } else {
            if (newInputValue.length > 0) {
                setIsIncorrect(true);
                setTimeout(() => setIsIncorrect(false), 500); 
            }
        }
    };
    
    useEffect(() => {
        if (gameStatus === 'playing') {
            inputRef.current?.focus();
        }
    }, [gameStatus, currentWord]);


    // --- Render Logic ---

    const renderGameContent = () => {
        if (gameStatus === 'idle') {
            return (
                <div className="text-center">
                    <p className="text-2xl mb-10 text-secondary">
                        <span className="block text-4xl mb-2 text-gold">// SYSTEM READY</span>
                        Test your coding speed and accuracy. Complete **{WORDS_PER_LEVEL} words** to ascend to the next level.
                    </p>
                    <button
                        onClick={startGame}
                        className="start-button-bg px-12 py-5 text-3xl font-extrabold"
                    >
                        [ INITIALIZE QUEST ]
                    </button>
                </div>
            );
        }

        if (gameStatus === 'playing') {
            return (
                <>
                    {/* Word Display (Always takes one line) */}
                    <WordDisplay word={currentWord} input={inputValue} />

                    {/* Input Wrapper (Forces the input box to the next line) */}
                    <div className="input-wrapper">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="INPUT CODE SEQUENCE..."
                            className={`
                                w-full max-w-xl text-center text-3xl sm-text-4xl uppercase input-style
                                ${isIncorrect ? 'shake-error input-error' : 'input-focus-ring'}
                            `}
                            autoCorrect="off"
                            autoCapitalize="off"
                            spellCheck="false"
                            autoFocus 
                        />
                    </div>

                    <div className="mt-8 text-center text-xl font-bold text-secondary">
                        
                    </div>
                </>
            );
        }
    };

    return (
        <div className="app-container">
            <div className="max-w-content"> 
                {/* --- 1. Header Block --- */}
                <header className="section-block text-center mb-10">
                    <h1 
                        className="main-header-text font-extrabold tracking-widest pb-4" 
                    >
                        TYPING QUEST
                    </h1>
                    <p className="text-2xl text-gray-400-custom font-bold mt-2">Initializing React Skill Tree...</p>
                </header>

                {/* --- 2. Game Stats Bar Block --- */}
                <div className="section-block stat-bar-block">
                    
                    <div className="grid-gap-6"> 
                        
                        {/* 1. Current Level Tracker */}
                        <div 
                            className={`stat-box flex-center flex-col level-box-glow ${isLevelUp ? 'level-pulse' : ''}`}
                        >
                            <span className="text-xl uppercase font-bold block text-gold">Level Status</span>
                            <span className="text-7xl font-extrabold">{level}</span>
                        </div>

                        {/* 2. Score Tracker */}
                        <div 
                            className="stat-box flex-center flex-col score-box-border" 
                        >
                            <span className="text-xl uppercase font-bold block mb-1 text-primary-accent">Total Words Mastered</span>
                            <span className="text-6xl font-extrabold">{score}</span>
                        </div>

                        {/* 3. Level Progress Bar */}
                        <div 
                            className="stat-box flex-col justify-between progress-box-border" 
                        >
                            <div className="flex-row justify-between items-center mb-2">
                                <span className="text-xl font-bold">Level {level} Progress</span>
                                <span className="text-2xl font-extrabold text-primary-accent">{levelProgress}%</span>
                            </div>
                            {/* Bar Container */}
                            <div className="progress-bar-container">
                                <div
                                    className="progress-fill" 
                                    style={{ width: `${levelProgress}%` }} 
                                ></div>
                            </div>
                            <p className="text-base mt-2 text-right font-bold text-gray-400-custom">
                                {WORDS_PER_LEVEL - wordsTypedInLevel} sequences remaining for **LEVEL UP**
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- 3. Game Area Block --- */}
                <div className="section-block min-h-300 flex-center">
                    {renderGameContent()}
                </div>

                {/* 4. Reset Button Block (Optional) */}
                {gameStatus !== 'idle' && (
                    <div className="text-center mt-6">
                         <button
                            onClick={startGame}
                            className="px-8 py-3 text-lg font-bold reset-button-style"
                        >
                            // RESTART QUEST (DEBUG/RESET)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TypingQuestGame;