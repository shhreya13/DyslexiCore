// frontend/app/dashboard/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../layout";

interface InterventionModule {
  id?: number;
  module_name?: string;
  current_module?: string;
  status?: string;
  is_mastered?: boolean;
}

interface AssessmentScore {
  risk_level: string;
  accuracy_percent: number;
  created_at: string;
}

const CircularProgress: React.FC<{
  percentage: number;
  color: string;
  label: string;
}> = ({ percentage, color, label }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#e0f2fe" strokeWidth="10" />
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
          style={{ transition: "stroke-dashoffset 0.8s" }}
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="65" textAnchor="middle" fontSize="20" fontWeight="bold" fill={color}>
          {percentage}%
        </text>
      </svg>
      <p style={{ marginTop: "5px", color: "var(--color-text-dark)", fontWeight: "bold" }}>
        {label}
      </p>
    </div>
  );
};

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [currentModule, setCurrentModule] = useState<InterventionModule | null>(null);
  const [latestScore, setLatestScore] = useState<AssessmentScore | null>(null);
  const [loading, setLoading] = useState(true);

  const lessonsCompleted = 6;
  const mockProgressPercentage = 75;
  const isModuleMastered = false;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const moduleRes = await fetch("http://127.0.0.1:8000/api/intervention/current", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (moduleRes.ok) {
          const data = await moduleRes.json();
          setCurrentModule(data);
        }
      } catch (error) {
        console.error("Error fetching current module:", error);
      }

      try {
        const historyRes = await fetch("http://127.0.0.1:8000/api/assessment/history", {
          headers: { Authorization: `Bearer ${token}` },
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
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Loading personalized dashboard...
      </div>
    );
  }

  const riskColor =
    latestScore?.risk_level === "High"
      ? "var(--color-error)"
      : latestScore?.risk_level === "Moderate"
      ? "#facc15"
      : "var(--color-success)";

  const moduleName =
    currentModule?.module_name ||
    currentModule?.current_module ||
    "Ready to Assess";

  const actionItems = [
    {
      title: "Common Games Hub",
      description: "Open all old and new DyslexiCore games in one place.",
      icon: "🎮",
      link: "/games",
      color: "var(--color-primary)",
    },
    {
      title: "Phonics Adventures",
      description: "Start the next personalized lesson in your learning path.",
      icon: "📚",
      link: "/learn",
      color: "#84cc16",
    },
    {
      title: "Smart Companion",
      description: "Get instant tutoring help or ask questions about dyslexia.",
      icon: "🧠",
      link: "/chat",
      color: "var(--color-primary)",
    },
    {
      title: "Readiness Check",
      description: "Take a quick screening to measure skill improvements.",
      icon: "✅",
      link: "/screening",
      color: "var(--color-success)",
    },
    {
      title: "Skill Quests",
      description: "View your past assessment scores and progress history.",
      icon: "🏆",
      link: "/skill-quest",
      color: "#fb923c",
    },
    {
      title: "Family Support Hub",
      description: "Connect with resources, guides, and the community.",
      icon: "👨‍👩‍👧‍👦",
      link: "/support",
      color: "#fb7185",
    },
    {
      title: "Healthcare AI Agent",
      description: "View FHIR-ready patient context and agent summary.",
      icon: "🩺",
      link: "/agent",
      color: "#06b6d4",
    },
  ];

  const games = [
    { title: "Letter Mirror", icon: "🔤", link: "/games/letter-mirror" },
    { title: "Reverse Recall", icon: "🧠", link: "/games/reverse-recall" },
    { title: "Memory Boost", icon: "🃏", link: "/games/memory-boost" },
    { title: "Story Builder", icon: "📖", link: "/games/story-builder" },
    { title: "Old Skill Quests", icon: "🏆", link: "/skill-quest" },
    { title: "Old Phonics Adventures", icon: "🔊", link: "/learn" },
  ];

  return (
    <div className="dashboard-layout">
      <div
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
          padding: "40px",
          borderRadius: "16px",
          color: "white",
          marginBottom: "40px",
          boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <h1 style={{ fontSize: "3rem", margin: "0 0 10px 0", fontWeight: 900 }}>
          Welcome back, {user?.first_name || "Explorer"}! ✨
        </h1>

        <p style={{ fontSize: "1.2rem", margin: 0, opacity: 0.9 }}>
          Let&apos;s conquer your phonics goal: <strong>{moduleName}</strong>
        </p>

        <div style={{ position: "absolute", right: "30px", top: "30px", fontSize: "4rem", opacity: 0.5 }}>
          🚀
        </div>
      </div>

      <h2 style={{ color: "var(--color-text-dark)", fontSize: "2rem", fontWeight: 800, marginBottom: "25px" }}>
        Your Progress Snapshot
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div className="dashboard-card" style={{ borderLeft: `8px solid ${riskColor}`, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", fontWeight: 900, color: riskColor }}>
            {latestScore ? latestScore.accuracy_percent : "--"}%
          </div>
          <p style={{ color: "var(--color-text-dark)", fontWeight: "bold" }}>Last Accuracy Score</p>
          <p style={{ color: riskColor, fontWeight: "bold" }}>
            Risk Level: {latestScore?.risk_level || "N/A"}
          </p>
        </div>

        <div
          className="dashboard-card"
          style={{
            borderLeft: "8px solid var(--color-primary)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CircularProgress percentage={mockProgressPercentage} color="var(--color-primary)" label="Current Module Progress" />
          <p style={{ color: "var(--color-primary)", fontWeight: "bold", marginTop: "10px" }}>
            {isModuleMastered ? "Mastered!" : `Goal: ${moduleName}`}
          </p>
        </div>

        <div className="dashboard-card" style={{ borderLeft: "8px solid var(--color-success)", textAlign: "center" }}>
          <div style={{ fontSize: "3rem", fontWeight: 900, color: "var(--color-success)" }}>
            {lessonsCompleted}
          </div>
          <p style={{ color: "var(--color-text-dark)", fontWeight: "bold" }}>Lessons Completed</p>
          <Link href="/learn" style={{ color: "var(--color-success)", textDecoration: "underline" }}>
            View all Modules
          </Link>
        </div>
      </div>

      <h2 style={{ color: "var(--color-text-dark)", fontSize: "2rem", fontWeight: 800, marginBottom: "25px" }}>
        Games Section
      </h2>

      <div className="dashboard-card">
        <h2>DyslexiCore Common Games Hub 🎮</h2>
        <p>
          This section combines your old DyslexiCore games and the new screening games.
          These games support phonics, memory, sequencing, letter recognition, and early
          dyslexia pattern detection.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          {games.map((game) => (
            <Link href={game.link} key={game.title} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "var(--color-background-card)",
                  padding: "18px",
                  borderRadius: "16px",
                  textAlign: "center",
                  border: "2px solid var(--color-secondary)",
                  color: "var(--color-primary)",
                  fontWeight: "bold",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{game.icon}</div>
                {game.title}
              </div>
            </Link>
          ))}
        </div>

        <Link href="/games">
          <button className="card-action-btn" style={{ marginTop: "25px" }}>
            Open Full Games Hub
          </button>
        </Link>
      </div>

      <h2 style={{ color: "var(--color-text-dark)", fontSize: "2rem", fontWeight: 800, marginBottom: "25px" }}>
        Quick Actions
      </h2>

      <div className="feature-grid">
        {actionItems.map((item) => (
          <Link href={item.link} key={item.title} style={{ textDecoration: "none" }}>
            <div className="feature-card" style={{ borderBottom: `5px solid ${item.color}` }}>
              <div
                className="feature-icon-box"
                style={{
                  backgroundColor: item.color,
                  boxShadow: `0 0 0 10px ${item.color}33`,
                }}
              >
                {item.icon}
              </div>

              <h3 className="card-title" style={{ color: item.color }}>
                {item.title}
              </h3>

              <p className="card-description">{item.description}</p>

              <button className="card-action-btn" style={{ backgroundColor: item.color }}>
                Open
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}