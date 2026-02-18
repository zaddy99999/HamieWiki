'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowRightIcon } from './Icons';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const FAQ: Record<string, string> = {
  'who is hamie': "Hamie (Worker #146B) is the protagonist of the Hamieverse. Originally from Virella in the Beyond, he's a factory worker trapped in the City's surveillance state. After discovering a cracked pendant containing contraband tech, he becomes 'Simba' in the Undercode, gaining sudden wealth and power.",
  'what is the undercode': "The Undercode is a clandestine shadow network where attention and virality serve as currency (measured in AC). It enables echo raids, viral loops, and market manipulation through coordinated cultural attacks.",
  'what are respeculators': "The Respeculators are an elite shadow coalition led by Sam and Lira. They publicly pose as rebels fighting Aetherion, but secretly steer narratives and markets in grey zones, using rebellion as a mask for power accumulation.",
  'who is sam': "Sam is the charismatic leader of the Respeculators. Calculating and strategic, he views influence as more important than trust. He's interested in Simba (Hamie) as a potential answer to questions he's long wanted solved.",
  'who is lira': "Lira is Sam's partner in the Respeculators, described as panther-like. She's volatile, intuitive, and suspicious—serving as the skeptical enforcer to Sam's charismatic operator role.",
  'what is aetherion': "Aetherion is the corporate-state regime that controls the City. It maintains order through surveillance (Red Eyes), forced labor (the Wheel), and enforcement (IronPaws). Citizens recite daily mantras: 'Work is purpose. Order is freedom. Obedience is peace.'",
  'what are ironpaws': "IronPaws are Aetherion's enforcement units. They wear black armor with red visors, speak in protocol language, and carry pacifier weapons. They conduct patrols, interrogations, and 'cleanups.'",
  'what is the wheel': "The Wheel is a colossal energy construct in the City powered by Hamster Orbs—containers with living runners acting as batteries. It symbolizes exploitation and the system's machine-god nature.",
  'how do i use this wiki': "You can browse characters on the home page, explore the Timeline for story events, test your knowledge with the Quiz, compare characters, and view the Factions page. Use the search bar or press '/' to quickly find anything!",
  'keyboard shortcuts': "Press '/' to focus search, 'Escape' to close menus, and use 'g' followed by: 'h' (home), 't' (timeline), 'q' (quiz), 'c' (compare), or 'g' (gallery) for quick navigation.",
};

const SUGGESTIONS = [
  'Who is Hamie?',
  'What is the Undercode?',
  'Who are the Respeculators?',
  'What is Aetherion?',
  'How do I use this wiki?',
  'Keyboard shortcuts',
];

export default function HelpChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hey! I'm the Hamieverse Wiki assistant. Ask me anything about the story, characters, or how to use this wiki!" }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const findAnswer = (question: string): string => {
    const q = question.toLowerCase().trim();

    // Check for direct matches
    for (const [key, answer] of Object.entries(FAQ)) {
      if (q.includes(key) || key.includes(q)) {
        return answer;
      }
    }

    // Check for character names
    const characters = ['sam', 'lira', 'hamie', 'silas', 'ace', 'hikari', 'kael', 'orrien', 'grandma', 'luna'];
    for (const char of characters) {
      if (q.includes(char)) {
        return `You can find detailed information about ${char.charAt(0).toUpperCase() + char.slice(1)} on their character page. Use the search bar or browse the characters section!`;
      }
    }

    // Check for faction names
    const factions = ['aetherion', 'ironpaw', 'undercode', 'respeculator'];
    for (const faction of factions) {
      if (q.includes(faction)) {
        return FAQ[`what is ${faction}`] || FAQ[`what are ${faction}s`] || `Check out the Factions page for detailed info about ${faction}!`;
      }
    }

    // Default response
    return "I'm not sure about that! Try searching the wiki, or browse the Characters, Timeline, or Factions pages. You can also ask about specific characters like Hamie, Sam, or Lira!";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');

    // Simulate typing delay
    setTimeout(() => {
      const answer = findAnswer(userMessage);
      setMessages(prev => [...prev, { role: 'bot', content: answer }]);
    }, 500);
  };

  const handleSuggestion = (suggestion: string) => {
    setMessages(prev => [...prev, { role: 'user', content: suggestion }]);
    setTimeout(() => {
      const answer = findAnswer(suggestion);
      setMessages(prev => [...prev, { role: 'bot', content: answer }]);
    }, 500);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        className={`help-chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle help chat"
        style={{ minWidth: '48px', minHeight: '48px' }}
      >
        {isOpen ? '×' : '?'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="help-chat-window">
          <div className="help-chat-header">
            <span className="help-chat-title">Wiki Assistant</span>
            <button className="help-chat-close" onClick={() => setIsOpen(false)} style={{ minWidth: '44px', minHeight: '44px' }}>×</button>
          </div>

          <div className="help-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`help-chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="help-chat-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="help-chat-suggestion" onClick={() => handleSuggestion(s)} style={{ minHeight: '44px', padding: '10px 14px' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="help-chat-input-form">
            <input
              type="text"
              className="help-chat-input"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ fontSize: '16px' }}
            />
            <button type="submit" className="help-chat-send" style={{ minWidth: '44px', minHeight: '44px' }}><ArrowRightIcon size={20} /></button>
          </form>
        </div>
      )}
    </>
  );
}
