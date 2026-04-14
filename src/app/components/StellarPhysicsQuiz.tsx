import { useState, useEffect } from "react";
import { motion } from "motion/react";

type Question = {
  question: string;
  options: string[];
  correct: number;
};

const physicsQuestions: Question[] = [
  {
    question: "What is the speed of light in vacuum?",
    options: ["3 × 10⁸ m/s", "3 × 10⁶ m/s", "3 × 10⁹ m/s", "3 × 10⁷ m/s"],
    correct: 0,
  },
  {
    question: "Which force keeps planets in orbit around the Sun?",
    options: ["Electromagnetic", "Gravitational", "Nuclear", "Friction"],
    correct: 1,
  },
  {
    question: "What is the SI unit of force?",
    options: ["Joule", "Watt", "Newton", "Pascal"],
    correct: 2,
  },
  {
    question: "Who formulated the three laws of motion?",
    options: ["Einstein", "Newton", "Galileo", "Kepler"],
    correct: 1,
  },
  {
    question: "What does E represent in E=mc²?",
    options: ["Entropy", "Energy", "Electric field", "Electron"],
    correct: 1,
  },
  {
    question: "At what temperature does water boil at sea level?",
    options: ["90°C", "100°C", "110°C", "120°C"],
    correct: 1,
  },
  {
    question: "What is the acceleration due to gravity on Earth?",
    options: ["8.8 m/s²", "9.8 m/s²", "10.8 m/s²", "11.8 m/s²"],
    correct: 1,
  },
];

export function StellarPhysicsQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [flickerIntensity, setFlickerIntensity] = useState(1);

  useEffect(() => {
    const dailyIndex =
      Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % physicsQuestions.length;
    setCurrentQuestion(dailyIndex);
  }, []);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);
    const correct = index === physicsQuestions[currentQuestion].correct;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
      setFlickerIntensity(1.5);
    } else {
      setFlickerIntensity(0.3);
    }

    setTimeout(() => {
      setFlickerIntensity(1);
    }, 1000);

    setTimeout(() => {
      if (currentQuestion < physicsQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(null);
    setFlickerIntensity(1);
  };

  if (showResult) {
    return (
      <div
        className="backdrop-blur-sm border-2 p-8 rounded-lg"
        style={{
          backgroundColor: "rgba(26, 15, 46, 0.4)",
          borderColor: "rgba(251, 191, 36, 0.3)",
          boxShadow: `inset 8px 0 16px rgba(251, 191, 36, ${0.2 * flickerIntensity})`,
        }}
      >
        <h2
          className="font-serif tracking-wider mb-6"
          style={{
            fontSize: "2rem",
            color: "var(--amber)",
            textShadow: "0 0 20px rgba(251, 191, 36, 0.5)",
          }}
        >
          Quiz Complete!
        </h2>

        <div className="text-center mb-8">
          <p
            className="font-serif mb-4"
            style={{
              fontSize: "3rem",
              color: "var(--nebula-teal)",
              textShadow: "0 0 30px rgba(13, 148, 136, 0.6)",
            }}
          >
            {score}/{physicsQuestions.length}
          </p>
          <p className="font-mono opacity-70" style={{ color: "var(--parchment)" }}>
            {score === physicsQuestions.length
              ? "Perfect! You've mastered the cosmic laws!"
              : score >= physicsQuestions.length / 2
              ? "Well done, stellar physicist!"
              : "Keep exploring the universe!"}
          </p>
        </div>

        <button
          onClick={resetQuiz}
          className="w-full px-6 py-3 rounded font-mono tracking-wider transition-all"
          style={{
            backgroundColor: "rgba(251, 191, 36, 0.2)",
            borderColor: "var(--amber)",
            color: "var(--amber)",
            border: "2px solid",
          }}
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  const question = physicsQuestions[currentQuestion];

  return (
    <motion.div
      className="backdrop-blur-sm border-2 p-8 rounded-lg"
      style={{
        backgroundColor: "rgba(26, 15, 46, 0.4)",
        borderColor: "rgba(251, 191, 36, 0.3)",
        boxShadow: `inset 8px 0 16px rgba(251, 191, 36, ${0.2 * flickerIntensity})`,
        transition: "box-shadow 0.5s ease",
      }}
      animate={{
        boxShadow: `inset 8px 0 16px rgba(251, 191, 36, ${0.2 * flickerIntensity})`,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          className="font-serif tracking-wider"
          style={{
            fontSize: "2rem",
            color: "var(--amber)",
            textShadow: "0 0 20px rgba(251, 191, 36, 0.5)",
          }}
        >
          The Stellar Scroll
        </h2>
        <span className="font-mono opacity-70" style={{ color: "var(--copper)" }}>
          {currentQuestion + 1}/{physicsQuestions.length}
        </span>
      </div>

      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p
          className="font-serif mb-8"
          style={{
            fontSize: "1.25rem",
            color: "var(--parchment)",
            lineHeight: 1.6,
          }}
        >
          {question.question}
        </p>

        <div className="space-y-4">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={selectedAnswer !== null}
              className="w-full px-6 py-4 rounded text-left font-mono transition-all border-2"
              style={{
                backgroundColor:
                  selectedAnswer === index
                    ? isCorrect
                      ? "rgba(13, 148, 136, 0.3)"
                      : "rgba(212, 24, 61, 0.3)"
                    : "rgba(26, 15, 46, 0.6)",
                borderColor:
                  selectedAnswer === index
                    ? isCorrect
                      ? "var(--nebula-teal)"
                      : "var(--destructive)"
                    : "rgba(251, 191, 36, 0.2)",
                color: "var(--parchment)",
                cursor: selectedAnswer !== null ? "not-allowed" : "pointer",
                boxShadow:
                  selectedAnswer === index
                    ? isCorrect
                      ? "0 0 20px rgba(13, 148, 136, 0.4)"
                      : "0 0 20px rgba(212, 24, 61, 0.4)"
                    : "none",
              }}
              whileHover={
                selectedAnswer === null
                  ? {
                      scale: 1.02,
                      borderColor: "rgba(251, 191, 36, 0.5)",
                    }
                  : {}
              }
              whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="mt-6 flex items-center justify-between">
        <p className="font-mono opacity-70" style={{ color: "var(--parchment)" }}>
          Score: {score}
        </p>
        {isCorrect !== null && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono"
            style={{
              color: isCorrect ? "var(--nebula-teal)" : "var(--destructive)",
            }}
          >
            {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
