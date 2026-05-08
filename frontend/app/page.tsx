import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <div className="homepage-container">
      <main className="homepage-main">

        <h1 className="homepage-title">
          DyslexiCore Healthcare AI Agent
        </h1>

        <p className="homepage-subtitle">
          Early dyslexia screening and personalized intervention powered by AI,
          FHIR-ready patient context, and interoperable healthcare agent workflows.
        </p>

        <div className="homepage-cta-group">
          <Link href="/register" className="cta-button primary-cta">
            Get Started (Register)
          </Link>

          <Link href="/login" className="cta-button secondary-cta">
            Log In
          </Link>
        </div>

        <p className="homepage-learn-more">
          <Link href="/support">
            Learn more about our methods
          </Link>
        </p>

      </main>
    </div>
  );
}