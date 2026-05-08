"use client";

import {
  Brain,
  Activity,
  FileJson,
  Network,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Send,
} from "lucide-react";

export default function AgentPage() {
  const patient = {
    resourceType: "Patient",
    id: "child-001",
    name: [{ given: ["Anaya"] }],
    gender: "female",
    birthDate: "2018-06-12",
    extension: [
      {
        url: "https://dyslexicore.ai/fhir/StructureDefinition/learning-risk-context",
        valueString: "Dyslexia screening candidate",
      },
    ],
  };

  const summary = {
    agent: "DyslexiCore Agent",
    assessment: {
      test_type: "Early Dyslexia Screening",
      accuracy_percent: 68,
      risk_level: "Moderate",
    },
    detected_indicators: [
      "phoneme confusion",
      "letter reversal tendency",
      "slow decoding speed",
      "working memory difficulty",
    ],
    recommendation:
      "Start Phoneme Peak, Letter Mirror, Reverse Recall, and Story Builder activities.",
    interoperability: {
      FHIR_ready: true,
      A2A_ready: true,
      Prompt_Opinion_ready: true,
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-950 via-fuchsia-950 to-indigo-950 text-white px-6 py-10">
      <section className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-5">
            <Sparkles size={18} className="text-yellow-300" />
            <span className="text-sm text-white/80">
              Healthcare AI Agent Demo
            </span>
          </div>

          <h1 className="text-5xl font-black mb-4">
            DyslexiCore Healthcare AI Agent
          </h1>

          <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
            FHIR-ready early dyslexia screening agent that analyzes child
            learning patterns, detects risk indicators, and generates
            personalized intervention recommendations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur">
            <Stethoscope className="text-pink-300 mb-4" size={34} />
            <h3 className="text-xl font-bold mb-2">Clinical Context</h3>
            <p className="text-white/60">
              Uses FHIR-style patient context for healthcare interoperability.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur">
            <Brain className="text-purple-300 mb-4" size={34} />
            <h3 className="text-xl font-bold mb-2">AI Screening</h3>
            <p className="text-white/60">
              Detects phoneme confusion, memory gaps, and letter reversals.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur">
            <Network className="text-cyan-300 mb-4" size={34} />
            <h3 className="text-xl font-bold mb-2">A2A Ready</h3>
            <p className="text-white/60">
              Designed for agent-to-agent healthcare workflow integration.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-5">
              <FileJson className="text-green-300" />
              <h2 className="text-2xl font-bold">FHIR Patient Context</h2>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-2xl p-6 space-y-4">

  <div className="flex items-center justify-between border-b border-white/10 pb-3">
    <span className="text-white/60">Patient ID</span>
    <span className="font-bold text-cyan-300">
      {patient.id}
    </span>
  </div>

  <div className="flex items-center justify-between border-b border-white/10 pb-3">
    <span className="text-white/60">Name</span>
    <span className="font-bold">
      {patient.name[0].given[0]}
    </span>
  </div>

  <div className="flex items-center justify-between border-b border-white/10 pb-3">
    <span className="text-white/60">Gender</span>
    <span className="font-bold">
      {patient.gender}
    </span>
  </div>

  <div className="flex items-center justify-between border-b border-white/10 pb-3">
    <span className="text-white/60">Birth Date</span>
    <span className="font-bold">
      {patient.birthDate}
    </span>
  </div>

  <div className="bg-cyan-500/10 border border-cyan-400/20 rounded-xl p-4">
    <p className="text-cyan-300 font-semibold mb-1">
      FHIR Context Status
    </p>

    <p className="text-white/70 text-sm">
      This patient profile is structured using
      FHIR-compatible healthcare context for interoperability.
    </p>
  </div>

</div>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur">
            <div className="flex items-center gap-3 mb-5">
              <Activity className="text-yellow-300" />
              <h2 className="text-2xl font-bold">Agent Summary</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/20 rounded-2xl p-4">
                <p className="text-white/50 text-sm">Risk Level</p>
                <p className="text-2xl font-bold text-yellow-300">
                  Moderate
                </p>
              </div>

              <div className="bg-black/20 rounded-2xl p-4">
                <p className="text-white/50 text-sm">Accuracy</p>
                <p className="text-2xl font-bold text-green-300">68%</p>
              </div>
            </div>

           <div className="space-y-5">

  <div className="bg-black/20 rounded-2xl p-5">
    <h3 className="text-lg font-bold mb-3 text-pink-300">
      Detected Learning Indicators
    </h3>

    <div className="flex flex-wrap gap-3">
      {summary.detected_indicators.map((item: string) => (
        <span
          key={item}
          className="bg-pink-500/20 border border-pink-400/20 px-4 py-2 rounded-full text-sm"
        >
          {item}
        </span>
      ))}
    </div>
  </div>

  <div className="bg-black/20 rounded-2xl p-5">
    <h3 className="text-lg font-bold mb-3 text-yellow-300">
      AI Recommendation
    </h3>

    <p className="text-white/70 leading-relaxed">
      {summary.recommendation}
    </p>
  </div>

  <div className="bg-black/20 rounded-2xl p-5">
    <h3 className="text-lg font-bold mb-4 text-cyan-300">
      Interoperability Status
    </h3>

    <div className="grid grid-cols-3 gap-3">

      <div className="bg-green-500/20 border border-green-400/20 rounded-xl p-3 text-center">
        <p className="font-bold text-green-300">FHIR</p>
        <p className="text-sm text-white/60">Ready</p>
      </div>

      <div className="bg-blue-500/20 border border-blue-400/20 rounded-xl p-3 text-center">
        <p className="font-bold text-blue-300">A2A</p>
        <p className="text-sm text-white/60">Enabled</p>
      </div>

      <div className="bg-purple-500/20 border border-purple-400/20 rounded-xl p-3 text-center">
        <p className="font-bold text-purple-300">Prompt Opinion</p>
        <p className="text-sm text-white/60">Integrated</p>
      </div>

    </div>
  </div>

</div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-purple-600/40 to-pink-600/40 border border-white/20 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="text-green-300" />
                <h2 className="text-2xl font-bold">
                  Prompt Opinion Integration
                </h2>
              </div>

              <p className="text-white/70 max-w-3xl leading-relaxed">
                DyslexiCore Agent can be published to the Prompt Opinion
                Marketplace and invoked by healthcare agents through A2A
                workflows while carrying FHIR-ready context.
              </p>
            </div>

            <button className="inline-flex items-center gap-2 bg-white text-purple-900 px-6 py-3 rounded-full font-bold hover:scale-105 transition">
              <Send size={18} />
              Send to Agent
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}