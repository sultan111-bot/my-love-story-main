import { useState } from "react";
import SultanMascot from "../components/SultanMascot.jsx";
import ConfettiEffect from "../components/ConfettiEffect.jsx";

const QUIZ_QUESTIONS = [
  {
    question: "Siapa nama lengkap ur boyfriend (aku)?",
    answers: ["Sultan Agung", "M. Sultan Ramadhan", "Sultan Suka Mandi", "Sultan Harahara"],
    correct: 3
  },
  {
    question: "Kapan kita Jadian?",
    answers: ["15 Februari 2026", "17 Februari 2026", "11 Februari 2026", "11 Februari 2062"],
    correct: 2
  },
  {
    question: "Apa makanan favorit ak klo pagi?",
    answers: ["Bubur Ayam", "Nasi Uduk", "Lontong", "Mie Ayam"],
    correct: 0
  },
  {
    question: "Apa makanan favorit ak klo malem?",
    answers: ["Bubur Ayam", "Nasi Uduk", "Lontong", "Mie Ayam"],
    correct: 1
  },
  {
    question: "Apa rasa favorit ak?",
    answers: ["Keju", "Coklat", "Strawberry", "Taro"],
    correct: 0
  },
  {
    question: "Apa warna favorit ak?",
    answers: ["putih & hitam", "biru & pink", "Pink & ungu", "putih & biru"],
    correct: 3
  },
  {
    question: "Apa nama panggilan ak dirumah?",
    answers: ["Sultan", "Dek", "Utan", "Nak"],
    correct: 2
  },
  {
    question: "Apa hobi favorit ak?",
    answers: ["Tidur", "main game", "olahraga", "makan"],
    correct: 0
  },
  {
    question: "Apa yang paling ak suka?",
    answers: ["Makanan", "Duit", "Minuman", "Kasur"],
    correct: 1
  },
  {
    question: "Apa target ak tahun ini?",
    answers: ["kuliah", "kerja", "gatau", "rantau"],
    correct: 2
  }
];

export default function QuizGame({ onExit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const handleAnswer = (answerIndex) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    const isCorrect = answerIndex === QUIZ_QUESTIONS[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions([...answeredQuestions, { question: currentQuestion, answer: answerIndex, correct: isCorrect }]);
  };

  const nextQuestion = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setAnsweredQuestions([]);
  };

  if (gameOver) {
    let emotion = "sad";
    let message = "PARAH BGTT!!??";
    
    if (score >= 8) {
      emotion = "celebrating";
      message = "I KNOWWW HEHEHEHEHE";
    } else if (score >= 6) {
      emotion = "happy";
      message = "YEAYYYYY walaupun banyak yg salah sik cih";
    } else if (score >= 4) {
      emotion = "shy";
      message = "HMZZZZ.... yhh lumayan lahh";
    }

    return (
      <div className="text-center w-full">
        <ConfettiEffect active={score >= 8} duration={4000} count={50} />
        <SultanMascot size="md" emotion={emotion} className="mx-auto sm:hidden" />
        <SultanMascot size="lg" emotion={emotion} className="mx-auto hidden sm:block md:hidden" />
        <SultanMascot size="xl" emotion={emotion} className="mx-auto hidden md:block lg:hidden" />
        <SultanMascot size="xl" emotion={emotion} className="mx-auto hidden lg:block" />
        <h2
          className="font-display mt-3 mb-3"
          style={{
            color: "var(--theme-accent)",
            fontSize: "clamp(18px, 4.5vw, 52px)"
          }}
        >
          Quiz Selesai!
        </h2>
        <p
          className="font-bold my-3 m-0"
          style={{ fontSize: "clamp(24px, 6.5vw, 56px)" }}
        >
          {score}/{QUIZ_QUESTIONS.length}
        </p>
        <p
          className="text-gray-600 mb-6 m-0"
          style={{ fontSize: "clamp(14px, 3.2vw, 24px)" }}
        >
          {message}
        </p>
        
        <div className="flex justify-center flex-wrap" style={{ gap: "clamp(10px, 2vw, 32px)" }}>
          <button
            onClick={resetGame}
            className="rounded-full text-white cursor-pointer border-0"
            style={{
              padding: "clamp(10px, 2.5vw, 24px) clamp(16px, 4vw, 48px)",
              fontSize: "clamp(12px, 2.8vw, 24px)",
              background: "linear-gradient(135deg,#FF6B9D,#C2185B)"
            }}
          >
            Main Lagi
          </button>
          <button
            onClick={onExit}
            className="rounded-full bg-gray-200 cursor-pointer border-0"
            style={{
              padding: "clamp(10px, 2.5vw, 24px) clamp(16px, 4vw, 48px)",
              fontSize: "clamp(12px, 2.8vw, 24px)"
            }}
          >
            Keluar
          </button>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="text-center w-full">
      <div className="mb-4">
        <div
          className="flex justify-between items-center mb-2 text-gray-600"
          style={{ fontSize: "clamp(12px, 2.5vw, 22px)" }}
        >
          <span>Pertanyaan {currentQuestion + 1} / {QUIZ_QUESTIONS.length}</span>
          <span>Skor: {score}</span>
        </div>
        <div
          className="w-full bg-gray-200 rounded-full"
          style={{ height: "clamp(6px, 1vw, 12px)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`,
              background: "linear-gradient(135deg,#FF6B9D,#C2185B)"
            }}
          />
        </div>
      </div>

      <div className="mb-5">
        <SultanMascot
          size="md"
          emotion={showResult ? (selectedAnswer === question.correct ? "happy" : "sad") : "thinking"}
          className="mx-auto mb-3 sm:hidden"
        />
        <SultanMascot
          size="lg"
          emotion={showResult ? (selectedAnswer === question.correct ? "happy" : "sad") : "thinking"}
          className="mx-auto mb-4 hidden sm:block md:hidden"
        />
        <SultanMascot
          size="xl"
          emotion={showResult ? (selectedAnswer === question.correct ? "happy" : "sad") : "thinking"}
          className="mx-auto mb-5 hidden md:block lg:block"
        />
        <h3
          className="font-display mb-4 m-0"
          style={{
            color: "var(--theme-accent)",
            fontSize: "clamp(16px, 4.2vw, 36px)"
          }}
        >
          {question.question}
        </h3>
      </div>

      <div
        className="mx-auto"
        style={{
          maxWidth: "clamp(240px, 95vw, 760px)"
        }}
      >
        {question.answers.map((answer, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correct;
          const showCorrect = showResult && isCorrect;
          const showWrong = showResult && isSelected && !isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`w-full text-left transition-all duration-300 cursor-pointer`}
              style={{
                padding: "clamp(12px, 2.5vw, 28px)",
                marginBottom: "clamp(10px, 1.8vw, 28px)",
                borderRadius: "clamp(10px, 1.8vw, 24px)",
                border: `2px solid ${
                  showCorrect ? "#6BCB77" :
                  showWrong ? "#ff4444" :
                  isSelected ? "#FF6B9D" : "#e0e0e0"
                }`,
                background:
                  showCorrect ? "#d4f4d4" :
                  showWrong ? "#ffd4d4" :
                  isSelected ? "#ffd4e4" : "white"
              }}
            >
              <div className="flex items-center" style={{ gap: "clamp(10px, 2vw, 32px)" }}>
                <span
                  className="rounded-full flex items-center justify-center font-bold text-white"
                  style={{
                    width: "clamp(28px, 6vw, 64px)",
                    height: "clamp(28px, 6vw, 64px)",
                    fontSize: "clamp(12px, 2.5vw, 24px)",
                    background:
                      showCorrect ? "#6BCB77" :
                      showWrong ? "#ff4444" :
                      isSelected ? "#FF6B9D" : "#e0e0e0"
                  }}
                >
                  {showCorrect ? "✓" : showWrong ? "✗" : String.fromCharCode(65 + index)}
                </span>
                <span style={{ fontSize: "clamp(14px, 3.2vw, 24px)" }}>{answer}</span>
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-6">
          <button
            onClick={nextQuestion}
            className="rounded-full text-white font-medium cursor-pointer border-0"
            style={{
              padding: "clamp(12px, 2.5vw, 28px) clamp(20px, 5vw, 52px)",
              fontSize: "clamp(12px, 2.8vw, 24px)",
              background: "linear-gradient(135deg,#FF6B9D,#C2185B)"
            }}
          >
            {currentQuestion < QUIZ_QUESTIONS.length - 1 ? "Pertanyaan Selanjutnya" : "Lihat Hasil"}
          </button>
        </div>
      )}
    </div>
  );
}
