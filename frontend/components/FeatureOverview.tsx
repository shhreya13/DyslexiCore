// frontend/app/components/FeatureOverview.tsx (Create this file!)

import React from 'react';
import Link from 'next/link';

interface FeatureCardProps {
    title: string;
    description: string;
    iconUrl: string; // Placeholder for a real icon/illustration URL
    linkHref: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, iconUrl, linkHref }) => (
    <div className="feature-card">
        {/* Placeholder for the icon */}
        <div className="feature-icon-box">
            <span className="text-4xl">{iconUrl}</span> 
            {/* Example: Replace with an actual <img src="/icons/star.svg" alt={title} /> */}
            
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <Link href={linkHref}>
            <button className="card-action-btn">
                Go to {title.split(' ')[0]}
            </button>
        </Link>
    </div>
);

export default function FeatureOverview() {
    return (
        <section className="feature-grid-section">
            <h2>Your Dyslexia Support Toolkit</h2>
            <div className="feature-grid">
                
                <FeatureCard
                    title="The Reading Readiness Check"
                    description="A quick, friendly quiz to check your child's fundamental reading skills—the first step in unlocking their potential!"
                    iconUrl="🚀"
                    linkHref="/assessment"
                />

                <FeatureCard
                    title="Skill Quests"
                    description="Challenge yourself with interactive mini-games that measure speed, memory, and sound awareness. Collect points and level up!"
                    iconUrl="🎮"
                    linkHref="/assessment"
                />
                
                <FeatureCard
                    title="Phonics Adventure Modules"
                    description="Dive into lessons based on the proven science of reading. Each module is a new adventure, building one essential skill at a time."
                    iconUrl="📚"
                    linkHref="/learn" 
                />
                
                <FeatureCard
                    title="Your Smart Coach"
                    description="Analyzes Skill Quest results to pick the perfect Phonics Adventure for you next, ensuring every minute you spend is effective."
                    iconUrl="🧠"
                    linkHref="/dashboard"
                />
            </div>
        </section>
    );
}