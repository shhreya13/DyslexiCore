// frontend/app/dashboard/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../layout';

// Mock Data Interfaces (matching your backend/schemas)
interface InterventionModule {
    id: number;
    module_name: string;
    is_mastered: boolean;
}

interface AssessmentScore {
    risk_level: string;
    accuracy_percent: number;
    created_at: string;
}

// Mock Progress Component (to avoid complex chart libraries)
const CircularProgress: React.FC<{ percentage: number, color: string, label: string }> = ({ percentage, color, label }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div style={{ textAlign: 'center' }}>
            <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke="#e0f2fe"
                    strokeWidth="10"
                />
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s' }}
                    transform="rotate(-90 60 60)"
                />
                <text x="60" y="65" textAnchor="middle" fontSize="20" fontWeight="bold" fill={color}>
                    {percentage}%
                </text>
            </svg>
            <p style={{ marginTop: '5px', color: 'var(--color-text-dark)', fontWeight: 'bold' }}>{label}</p>
        </div>
    );
};

export default function DashboardPage() {
    const { user, token } = useAuth();
    const [currentModule, setCurrentModule] = useState<InterventionModule | null>(null);
    const [latestScore, setLatestScore] = useState<AssessmentScore | null>(null);
    const [loading, setLoading] = useState(true);

    // --- MOCK DATA FOR VISUAL APPEARANCE (Replace with real fetch calls) ---
    const lessonsCompleted = 6;
    const mockProgressPercentage = 75; 
    const isModuleMastered = false; 

    // Fetches the current intervention module and latest assessment score
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            // 1. Fetch Current Module
            try {
                const moduleRes = await fetch('http://127.0.0.1:8000/api/intervention/current', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (moduleRes.ok) {
                    const data = await moduleRes.json();
                    setCurrentModule(data);
                }
            } catch (error) {
                console.error("Error fetching current module:", error);
            }

            // 2. Fetch Latest Score
            try {
                const historyRes = await fetch('http://127.0.0.1:8000/api/assessment/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (historyRes.ok) {
                    const history: AssessmentScore[] = await historyRes.json();
                    if (history.length > 0) {
                        setLatestScore(history[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching assessment history:", error);
            }

            setLoading(false);
        };

        fetchDashboardData();
    }, [token]);


    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading personalized dashboard...</div>;
    }

    // Determine color based on mock Risk Level
    const riskColor = latestScore?.risk_level === 'High' ? 'var(--color-error)' :
                     latestScore?.risk_level === 'Moderate' ? '#facc15' : 
                     'var(--color-success)';

    const actionItems = [
        { title: "Phonics Adventures", description: "Start the next personalized lesson in your learning path.", icon: "📚", link: "/learn", color: "#84cc16" }, // Olive Green
        { title: "Smart Companion", description: "Get instant tutoring help or ask questions about dyslexia.", icon: "🧠", link: "/chat", color: "var(--color-primary)" },
        { title: "Readiness Check", description: "Take a quick screening to measure skill improvements.", icon: "✅", link: "/screening", color: "var(--color-success)" },
        { title: "Skill Quests (History)", description: "View your past assessment scores and progress history.", icon: "🏆", link: "/skill-quest", color: "#fb923c" }, // Orange
        { title: "Family Support Hub", description: "Connect with resources, guides, and the community.", icon: "👨‍👩‍👧‍👦", link: "/support", color: "#fb7185" }, // Pink
    ];


    return (
        <div className="dashboard-layout">

            {/* --- 1. WELCOME BANNER --- */}
            <div style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                padding: '40px',
                borderRadius: '16px',
                color: 'white',
                marginBottom: '40px',
                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', fontWeight: 900 }}>
                    Welcome back, {user?.first_name || 'Explorer'}! ✨
                </h1>
                <p style={{ fontSize: '1.2rem', margin: 0, opacity: 0.9 }}>
                    Let's conquer your phonics goal: **{currentModule?.module_name || 'Ready to Assess'}**
                </p>
                <div style={{ position: 'absolute', right: '30px', top: '30px', fontSize: '4rem', opacity: 0.5 }}>
                    🚀
                </div>
            </div>

            {/* --- 2. KEY METRICS / STATS GRID (Big Numbers) --- */}
            <h2 style={{ color: 'var(--color-text-dark)', fontSize: '2rem', fontWeight: 800, marginBottom: '25px' }}>Your Progress Snapshot</h2>
            
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '20px', 
                marginBottom: '40px' 
            }}>

                {/* Metric Card 1: Risk Level */}
                <div className="dashboard-card" style={{ borderLeft: `8px solid ${riskColor}`, textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: riskColor }}>
                        {latestScore ? latestScore.accuracy_percent : '--'}%
                    </div>
                    <p style={{ color: 'var(--color-text-dark)', fontWeight: 'bold' }}>Last Accuracy Score</p>
                    <p style={{ color: riskColor, fontWeight: 'bold' }}>Risk Level: {latestScore?.risk_level || 'N/A'}</p>
                </div>

                {/* Metric Card 2: Current Goal Progress */}
                <div className="dashboard-card" style={{ borderLeft: `8px solid var(--color-primary)`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress percentage={mockProgressPercentage} color="var(--color-primary)" label="Current Module Progress" />
                    <p style={{ color: 'var(--color-primary)', fontWeight: 'bold', marginTop: '10px' }}>
                        {isModuleMastered ? 'Mastered!' : `Goal: ${currentModule?.module_name || 'Pending'}`}
                    </p>
                </div>
                
                {/* Metric Card 3: Lessons Completed */}
                <div className="dashboard-card" style={{ borderLeft: `8px solid var(--color-success)`, textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-success)' }}>
                        {lessonsCompleted}
                    </div>
                    <p style={{ color: 'var(--color-text-dark)', fontWeight: 'bold' }}>Lessons Completed</p>
                    <Link href="/learn" style={{ color: 'var(--color-success)', textDecoration: 'underline' }}>
                        View all Modules
                    </Link>
                </div>

            </div>
            
            {/* --- 3. QUICK ACTIONS GRID --- */}
            <h2 style={{ color: 'var(--color-text-dark)', fontSize: '2rem', fontWeight: 800, marginBottom: '25px' }}>Quick Actions</h2>

            <div className="feature-grid">
                {actionItems.map(item => (
                    <Link href={item.link} key={item.title} style={{ textDecoration: 'none' }}>
                        <div className="feature-card" style={{ borderBottom: `5px solid ${item.color}` }}>
                            <div className="feature-icon-box" style={{ backgroundColor: item.color, boxShadow: `0 0 0 10px ${item.color}33` }}>
                                {item.icon}
                            </div>
                            <h3 className="card-title" style={{ color: item.color }}>{item.title}</h3>
                            <p className="card-description">{item.description}</p>
                            <button className="card-action-btn" style={{ backgroundColor: item.color }}>
                                Go to {item.title.split(' ')[0]}
                            </button>
                        </div>
                    </Link>
                ))}
            </div>

        </div>
    );
}