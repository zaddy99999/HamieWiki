'use client';

import { useState, useEffect } from 'react';
import { QuizIcon } from './Icons';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

const questions: QuizQuestion[] = [
  { question: "What is Hamie's worker designation?", options: ['#101B', '#146B', '#257A', '#479C'], correctIndex: 1 },
  { question: "What alias does Hamie use in the Undercode?", options: ['Shadow', 'Simba', 'Phoenix', 'Ghost'], correctIndex: 1 },
  { question: "Who leads the Respeculators?", options: ['Lira', 'Kael', 'Sam', 'Orrien'], correctIndex: 2 },
  { question: "Where did Hamie's grandmother live?", options: ['The City', 'Undercode', 'Virella', 'Aetherion HQ'], correctIndex: 2 },
  { question: "What is the Undercode?", options: ['A prison', 'A shadow digital ecosystem', 'A factory sector', 'A government office'], correctIndex: 1 },
  { question: "How much did Hamie gain from Aethercreed?", options: ['1,000 AC', '100,000 AC', '1M AC', '13M AC'], correctIndex: 3 },
  { question: "What is the Doppel Protocol?", options: ['Communication tool', 'Forbidden mimic-script', 'Transport device', 'Weapon system'], correctIndex: 1 },
  { question: "What did the cracked pendant contain?", options: ['A photo', 'Bridge chip & USB', 'A key', 'Money'], correctIndex: 1 },
  { question: "What symbolizes freedom in Silas's past?", options: ['A bird', 'A butterfly', 'A flower', 'A star'], correctIndex: 1 },
  { question: "What is the Neon Spire?", options: ['A prison', 'A factory', 'A meeting location', 'A weapon'], correctIndex: 2 },
];

export default function MiniQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Randomize starting question
    setCurrentQ(Math.floor(Math.random() * questions.length));
  }, []);

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setAnswered(a => a + 1);
    if (index === questions[currentQ].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (answered >= 5) {
      setShowResult(true);
    } else {
      setSelected(null);
      setCurrentQ((currentQ + 1) % questions.length);
    }
  };

  const restart = () => {
    setCurrentQ(Math.floor(Math.random() * questions.length));
    setSelected(null);
    setScore(0);
    setAnswered(0);
    setShowResult(false);
  };

  const q = questions[currentQ];

  if (showResult) {
    return (
      <div className="mini-quiz">
        <div className="mini-quiz-header">
          <span className="mini-quiz-icon"><QuizIcon size={20} /></span>
          <h3>Quiz Complete!</h3>
        </div>
        <div className="mini-quiz-result">
          <div className="mini-quiz-score">{score}/5</div>
          <p>{score >= 4 ? "Excellent! You know the Hamieverse!" : score >= 2 ? "Not bad! Keep exploring!" : "Time to read more lore!"}</p>
          <button className="mini-quiz-btn" onClick={restart}>Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mini-quiz">
      <div className="mini-quiz-header">
        <span className="mini-quiz-icon"><QuizIcon size={20} /></span>
        <h3>Quiz</h3>
        <span className="mini-quiz-progress">{answered + 1}/5</span>
      </div>
      <p className="mini-quiz-question">{q.question}</p>
      <div className="mini-quiz-options">
        {q.options.map((opt, i) => (
          <button
            key={i}
            className={`mini-quiz-option ${selected === i ? (i === q.correctIndex ? 'correct' : 'wrong') : ''} ${selected !== null && i === q.correctIndex ? 'correct' : ''}`}
            onClick={() => handleAnswer(i)}
            disabled={selected !== null}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected !== null && (
        <button className="mini-quiz-btn" onClick={nextQuestion}>
          {answered >= 5 ? 'See Results' : 'Next Question'}
        </button>
      )}
    </div>
  );
}
