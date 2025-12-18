// frontend/app/chat/page.tsx

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../layout';
import './page.css'; // Import the new CSS

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

// --- Pre-set Questions and Simulated Responses for Dyslexia Kids ---
const QUICK_QUESTIONS = [
    "What is dyslexia?",
    "How do I read better?",
    "Can I still be smart?",
    "Why do letters move?",
    "How can I focus on homework?",
];

const SIMULATED_RESPONSES: { [key: string]: string } = {
    "what is dyslexia?": "Dyslexia is like having a unique superpower for seeing things differently! It just means your brain takes a slightly different path when reading and spelling. It has nothing to do with how smart you are. Many brilliant people have dyslexia!",
    "how do i read better?": "Great question! Try using a finger or a ruler to keep your place. Read the words out loud slowly, focusing on one sound at a time. The Phonics Adventure games are designed to help you practice blending sounds!",
    "can i still be smart?": "Absolutely, 100% YES! Dyslexia affects reading, not intelligence. Many inventors, artists, and business leaders are dyslexic. You have strengths in creativity, problem-solving, and thinking visually.",
    "why do letters move?": "That feeling is real! When you have dyslexia, sometimes your brain flips or jumbles the order of letters, making them seem like they're moving. Using a reading pen or colored overlays can sometimes help your eyes and brain work together better.",
    "how can i focus on homework?": "Break it down! Set a timer for short bursts (like 15 minutes), take a short break, then repeat. Find a quiet spot, and use bright colours to highlight important parts of the text. Don't be afraid to ask for help!",
};


export default function SmartCompanionChat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messageWindowRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the bottom when messages update
    useEffect(() => {
        if (messageWindowRef.current) {
            messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (userMessage: string) => {
        if (loading) return;

        const newMessage: Message = { sender: 'user', text: userMessage };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setLoading(true);

        // --- Simulate AI Response Logic ---
        const normalizedMessage = userMessage.toLowerCase().trim().replace(/[^a-z0-9\s?]/g, '');
        const responseKey = Object.keys(SIMULATED_RESPONSES).find(key => normalizedMessage.includes(key));
        
        const aiResponseText = responseKey 
            ? SIMULATED_RESPONSES[responseKey] 
            : "I'm still learning the answer to that specific question! Try asking one of the quick questions above, or ask me about CVC words.";

        // Simulate API delay
        setTimeout(() => {
            setMessages(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
            setLoading(false);
        }, 1200);
    };

    const sendMessageFromInput = () => {
        if (!input.trim()) return;
        handleSendMessage(input.trim());
    }

    const handleQuickQuestionClick = (question: string) => {
        handleSendMessage(question);
    };

    return (
        <div className="smart-companion-container">
            <h1 className="chat-header">🧠 Talk to Your Smart Companion</h1>
            
            {/* Quick Questions Grid */}
            <div className="quick-question-grid">
                {QUICK_QUESTIONS.map((q) => (
                    <button 
                        key={q}
                        className="quick-question-button"
                        onClick={() => handleQuickQuestionClick(q)}
                        disabled={loading}
                    >
                        {q}
                    </button>
                ))}
            </div>

            {/* Message Window */}
            <div ref={messageWindowRef} className="message-window">
                {messages.length === 0 && (
                    <p className="initial-prompt">
                        Hello {user?.first_name || 'there'}! I'm your Smart Companion. Ask me anything about learning, reading, or homework help, and I'll give you a dyslexia-friendly answer.
                    </p>
                )}

                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`message-bubble-row ${msg.sender === 'user' ? 'user-message-row' : 'ai-message-row'}`}
                    >
                        <div className={`message-bubble ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="loading-text">
                        Smart Companion is thinking...
                    </div>
                )}
            </div>
            
            {/* Input Area */}
            <div className="chat-input-area">
                <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Type your question here..."
                    onKeyDown={(e) => e.key === 'Enter' && sendMessageFromInput()}
                    disabled={loading}
                    className="chat-input"
                />
                <button 
                    onClick={sendMessageFromInput} 
                    disabled={loading || !input.trim()}
                    className="send-button"
                >
                    Send
                </button>
            </div>
        </div>
    );
}