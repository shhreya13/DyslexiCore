import Link from "next/link";

const games = [
  {
    title: "Letter Mirror",
    slug: "letter-mirror",
    description: "Identify confusing letters like b, d, p, q.",
    icon: "🔤",
    type: "New Screening Game"
  },
  {
    title: "Reverse Recall",
    slug: "reverse-recall",
    description: "Recall sounds in reverse order.",
    icon: "🧠",
    type: "New Memory Game"
  },
  {
    title: "Memory Boost",
    slug: "memory-boost",
    description: "Match words with images.",
    icon: "🃏",
    type: "New Memory Game"
  },
  {
    title: "Story Builder",
    slug: "story-builder",
    description: "Arrange story events in correct order.",
    icon: "📖",
    type: "New Sequencing Game"
  },
  {
    title: "Skill Quests",
    slug: "skill-quests",
    description: "Your existing DyslexiCore skill games.",
    icon: "🎯",
    type: "Old Game Section"
  },
  {
    title: "Phonics Adventures",
    slug: "phonics-adventures",
    description: "Your old phonics learning games.",
    icon: "🔊",
    type: "Old Game Section"
  }
];

export default function GamesPage() {
  return (
    <main className="container">
      <h1 style={{ textAlign: "center", color: "var(--color-primary)" }}>
        DyslexiCore Games
      </h1>

      <p style={{ textAlign: "center", marginBottom: "40px" }}>
        A common game hub combining old DyslexiCore games and new screening games.
      </p>

      <div className="feature-grid">
        {games.map((game) => (
          <div key={game.slug} className="feature-card">
            <div className="feature-icon-box">{game.icon}</div>

            <h2 className="card-title">{game.title}</h2>

            <p className="card-description">{game.description}</p>

            <p style={{ fontWeight: "bold", color: "var(--color-secondary)" }}>
              {game.type}
            </p>

            {game.slug === "skill-quests" ? (
              <Link href="/skill-quest">
                <button className="card-action-btn">Open Game</button>
              </Link>
            ) : game.slug === "phonics-adventures" ? (
              <Link href="/phonics-adventures">
                <button className="card-action-btn">Open Game</button>
              </Link>
            ) : (
              <Link href={`/games/${game.slug}`}>
                <button className="card-action-btn">Play Game</button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}