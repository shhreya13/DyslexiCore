// frontend/app/page.tsx

import Link from "next/link";
import React from 'react';

export default function HomePage() {
  return (
    <div className="homepage-container">
      <main className="homepage-main">
        
        <h1 className="homepage-title">
          Welcome to the Dyslexia Support System
        </h1>
        
        <p className="homepage-subtitle">
          Unlock the world of reading with our specialized intervention programs, powered by AI recommendations.
        </p>

        <div className="homepage-cta-group">
          <Link href="/register" legacyBehavior>
            <a className="cta-button primary-cta">
              Get Started (Register)
            </a>
          </Link>
          <Link href="/login" legacyBehavior>
            <a className="cta-button secondary-cta">
              Log In
            </a>
          </Link>
        </div>
        
        <p className="homepage-learn-more">
          <Link href="/support" legacyBehavior>
            <a>Learn more about our methods</a>
          </Link>
        </p>
      </main>
    </div>
  );
}