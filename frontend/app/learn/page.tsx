// frontend/app/learn/page.tsx

'use client';

import React from 'react';
import { useAuth } from '../layout'; 
import Link from 'next/link';
import './page.css'; // Import the shared styles

// Mock learning modules data
const modules = [
    { id: 1, title: "CVC Word Explorer: Short A", status: "Current Goal", color: "var(--color-current-goal)" },
    { id: 2, title: "Blending Sounds: Short E & I", status: "Unlocked", color: "var(--color-secondary)" },
    { id: 3, title: "Digraph Discovery: SH and TH", status: "Locked", color: "var(--color-disabled)" },
    { id: 4, title: "Vowel Teams Voyage", status: "Locked", color: "var(--color-disabled)" },
];

// !!! FUNCTIONAL CHANGE: All non-locked modules link to the same lesson ID (1)
const getLessonLink = (status: string): string => {
    if (status === 'Locked') return '#';
    // Always returns the path to the CVC lesson page (simulating one interactive lesson)
    return `/learn/lesson/1`; 
};

// Helper to determine CSS classes
const getModuleClasses = (status: string) => {
    const borderClass = status === 'Current Goal' ? 'border-current-goal' : 
                        status === 'Unlocked' ? 'border-unlocked' : 
                        'border-locked';
    const statusClass = status === 'Current Goal' ? 'status-current-goal' : 
                        status === 'Unlocked' ? 'status-unlocked' : 
                        'status-locked';
    const buttonClass = status === 'Current Goal' ? 'button-current-goal' : 
                        status === 'Unlocked' ? 'button-unlocked' : '';
    const lockedClass = status === 'Locked' ? 'locked' : '';
    
    return { borderClass, statusClass, buttonClass, lockedClass };
};


export default function PhonicsAdventureModules() {
    const { user } = useAuth();
    
    return (
        <div className="modules-page-container">
            <h1 className="modules-header">📖 Phonics Adventure Modules</h1>
            <p className="welcome-message">
                Welcome back, {user?.first_name || 'Explorer'}! Your Smart Coach has recommended a personalized path just for you.
            </p>

            <div className="module-grid">
                {modules.map(module => {
                    const link = getLessonLink(module.status);
                    const { borderClass, statusClass, buttonClass, lockedClass } = getModuleClasses(module.status);
                    const isDisabled = module.status === 'Locked';
                    
                    return (
                        // Use a div wrapper for visual styling, but Link wraps the entire card for click area
                        <Link 
                            href={link} 
                            key={module.id} 
                            className="module-card-link"
                            tabIndex={isDisabled ? -1 : 0} // Accessibility: disable tabbing on locked modules
                            style={{ pointerEvents: isDisabled ? 'none' : 'auto' }} // Visually prevent clicks
                        >
                            <div className={`module-card ${borderClass} ${lockedClass}`}>
                                <h2 className="module-title" style={{ color: module.color }}>{module.title}</h2>
                                <p className={`module-status ${statusClass}`}>**Status:** {module.status}</p>
                                
                                <button 
                                    disabled={isDisabled}
                                    className={`start-button ${buttonClass}`}
                                >
                                    {isDisabled ? 'Locked' : 'Start Lesson'}
                                </button>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <Link href="/dashboard" className="back-link">
                ← Back to Dashboard
            </Link>
        </div>
    );
}