// frontend/app/support/data.ts

// Define the structure for a resource
export interface SupportResource {
    title: string;
    slug: string;
    icon: string;
    content: string;
    color: string;
    externalLink: string; // <-- New field for external URL
}

// ------------------------------------------------------------------
// Mock Data (Updated with example external support links)
// ------------------------------------------------------------------
export const supportResources: SupportResource[] = [
    { 
        title: "Understanding Dyslexia", 
        slug: "understanding", 
        icon: "💡", 
        content: "Learn the common signs, facts, and debunking myths about developmental dyslexia. This deep-dive section provides links to professional resources, diagnostic criteria, and historical context of dyslexia research.", 
        color: "#4ade80",
        externalLink: "https://www.dyslexiaida.org/understanding-dyslexia/" // Example: International Dyslexia Association
    }, 
    { 
        title: "Home Practice Guides", 
        slug: "practice-guides", 
        icon: "🏠", 
        content: "Simple, effective daily activities you can do to support phonics and fluency at home. Includes downloadable schedules and short, fun exercises for auditory and visual processing.", 
        color: "var(--color-secondary)",
        externalLink: "https://www.orton-gillingham.com/home-practice-resources/" // Example: Orton-Gillingham based resource
    },
    { 
        title: "School Advocacy", 
        slug: "school-advocacy", 
        icon: "🏫", 
        content: "Advice, templates, and strategies for working with teachers and securing necessary accommodations. Find sample letters for IEP/504 requests and tips for productive parent-teacher meetings.", 
        color: "#facc15",
        externalLink: "https://www.understood.org/articles/en/school-accommodations-for-dyslexia" // Example: Understood.org
    }, 
    { 
        title: "Emotional Wellness", 
        slug: "emotional-wellness", 
        icon: "❤️", 
        content: "Tips on fostering confidence and managing frustration in your child's learning journey. Includes advice on building a growth mindset and celebrating non-academic strengths.", 
        color: "#fb7185",
        externalLink: "https://childmind.org/article/support-for-kids-with-dyslexia/" // Example: Child Mind Institute
    }, 
    { 
        title: "Local Connection Network", 
        slug: "local-network", 
        icon: "🤝", 
        content: "Find nearby pediatricians, therapists, or connect with other families going through a similar journey. This section features a geo-location search tool and a forum link.", 
        color: "#f97316",
        externalLink: "https://www.decodingdyslexia.net/local-chapters/" // Example: Decoding Dyslexia Network
    },
];

// ------------------------------------------------------------------
// Server-side function (Runs at Build Time)
// ------------------------------------------------------------------
export async function generateStaticParams() {
    return supportResources.map((resource) => ({
        slug: resource.slug,
    }));
}