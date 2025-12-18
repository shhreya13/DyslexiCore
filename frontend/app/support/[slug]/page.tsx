// frontend/app/support/[slug]/page.tsx

'use client'; 

import React from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import '../SupportStyles.css'; 
import { supportResources, generateStaticParams, SupportResource } from '../data'; 

export { generateStaticParams }; 

// Custom styles for the external link button
const externalLinkButtonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '12px 25px',
    backgroundColor: 'var(--color-primary)', // Deep Purple
    color: 'white',
    borderRadius: '8px',
    fontWeight: 'bold',
    textDecoration: 'none',
    marginTop: '25px',
    transition: 'background-color 0.2s',
    border: '2px solid var(--color-primary)',
};

export default function DynamicSupportPage() {
    const params = useParams();
    const currentSlug = params.slug as string;
    
    // Find the matching resource data
    const resource = supportResources.find(r => r.slug === currentSlug) as SupportResource | undefined;

    if (!resource) {
        notFound();
    }

    // --- Content Styling ---
    const sectionStyle: React.CSSProperties = {
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: 'var(--color-background-card)',
        borderRadius: '10px',
        border: `2px solid ${resource.color}`,
        boxShadow: '0 2px 8px var(--color-shadow)',
    };


    return (
        <div className="support-page-container">
            <Link href="/support" className="back-link">
                ← Back to Support Hub
            </Link>

            <h1 className="support-header" style={{ borderBottom: `4px solid ${resource.color}`, paddingBottom: '10px' }}>
                <span className="support-icon">{resource.icon}</span> {resource.title}
            </h1>
            <p className="welcome-text">
                You are viewing the dedicated resource page for {resource.title}.
            </p>

            {/* Main Content Overview */}
            <div style={sectionStyle}>
                <h2 className="support-title" style={{ color: 'var(--color-primary)' }}>Overview</h2>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                    {resource.content}
                </p>
            </div>

            {/* --- Dedicated External Link Section --- */}
            <div style={sectionStyle}>
                <h2 className="support-title" style={{ color: 'var(--color-primary)' }}>Official Resource Link</h2>
                <p style={{ margin: '15px 0' }}>
                    Click the button below to be taken directly to the external support website for more detailed, up-to-date information.
                </p>
                <a 
                    href={resource.externalLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={externalLinkButtonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#9370DB'} // Light purple hover
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                >
                    Visit External Resource (Opens in New Tab)
                </a>
            </div>
            
            <Link href="/support" className="back-link">
                ← Back to Support Hub
            </Link>
        </div>
    );
}