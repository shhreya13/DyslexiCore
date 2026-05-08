// frontend/app/page.tsx (Main Dashboard)

'use client';

import React from 'react';
import Link from 'next/link';
// CRITICAL FIX: The correct path from /app/page.tsx to /app/layout.tsx is './layout'
import { useAuth } from '../layout'; 
import './page.css';

// Feature Card Data
const features = [
    {
        title: "Phonics Adventure",
        slug: "/learn",
        icon: "🎮",
        description: "Engaging typing games and structured phonics modules tailored for effective, dyslexic-friendly reading practice. Start your quest to master words!",
        className: "card-learn",
        actionText: "Start Learning",
    },
    {
        title: "Smart Companion Chat",
        slug: "/chat",
        icon: "🧠",
        description: "Ask your AI companion questions about homework, learning strategies, or dyslexia. Get instant, supportive, and accessible advice.",
        className: "card-chat",
        actionText: "Start Chatting",
    },
    {
        title: "Family Support Hub",
        slug: "/support",
        icon: "👨‍👩‍👧‍👦",
        description: "A comprehensive resource center for parents and guardians. Find guides on advocacy, emotional wellness, and home practice strategies.",
        className: "card-support",
        actionText: "View Resources",
    },
];

export default function Dashboard() {
    // useAuth is now correctly imported
    const { user } = useAuth();

    // Determine greeting based on user context
    const greetingName = user?.first_name ? user.first_name : 'Explorer';
    // 

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1 className="welcome-title">Welcome Back, {greetingName}!</h1>
                <p className="welcome-subtitle">
                    Your personalized learning journey starts here. Choose your next quest.
                </p>
            </header>

            <div className="feature-grid">
                {features.map((feature) => (
                    <Link href={feature.slug} key={feature.slug} className="feature-card-link">
                        <div className={`feature-card ${feature.className}`}>
                            <div className="card-icon">{feature.icon}</div>
                            <h2 className="card-title">{feature.title}</h2>
                            <p className="card-description">{feature.description}</p>
                            <span className="card-action">
                                {feature.actionText} →
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}