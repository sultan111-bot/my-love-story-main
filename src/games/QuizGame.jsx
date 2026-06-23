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
    answers: ["Olahraga", "main game", "tidur", "makan"],
    correct: 0 & 1 & 2 & 3
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
    let message = "Coba lagi ya! 😿";
    
    if (score >= 8) {
      emotion = "celebrating";
      message = "Luar biasa! Kamu kenal aku banget! 🎉😻";
    } else if (score >= 6) {
      emotion = "happy";
      message = "Bagus! Kamu hafal banyak hal tentang kita 😸";
    } else if (score >= 4) {
      emotion = "shy";
      message = "Lumayan! Masih banyak yang perlu kamu ingat 😊";
    }

    return (
      <div className="text-center py-8">
        <ConfettiEffect active={score >= 8} duration={4000} count={50} />
        <SultanMascot size="xl" emotion={emotion} className="mx-auto" />
        <div className="font-display text-2xl mt-4" style={{ color: "var(--theme-accent)" }}>
          Quiz Selesai!
        </div>
        <div className="text-3xl font-bold my-2">{score}/{QUIZ_QUESTIONS.length}</div>
        <div className="text-sm text-gray-600 mb-6">{message}</div>
        
        <div className="flex justify-center gap-3">
          <button
            onClick={resetGame}
            className="px-5 py-2 rounded-full text-white text-sm"
            style={{ background: "linear-gradient(135deg,#FF6B9D,#C2185B)" }}
          >
            Main Lagi
          </button>
          <button onClick={onExit} className="px-5 py-2 rounded-full bg-gray-200 text-sm">
            Keluar
          </button>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
          <span>Pertanyaan {currentQuestion + 1} / {QUIZ_QUESTIONS.length}</span>
          <span>Skor: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`,
              background: "linear-gradient(135deg, #FF6B9D, #C2185B)"
            }}
          />
        </div>
      </div>

      <div className="mb-6">
        <SultanMascot size="lg" emotion={showResult ? (selectedAnswer === question.correct ? "happy" : "sad") : "thinking"} className="mx-auto mb-4" />
        <div className="font-display text-lg mb-4" style={{ color: "var(--theme-accent)" }}>
          {question.question}
        </div>
      </div>

      <div className="space-y-3">
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
              className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                showCorrect 
                  ? "bg-green-100 border-2 border-green-500 text-green-800"
                  : showWrong
                  ? "bg-red-100 border-2 border-red-500 text-red-800"
                  : isSelected
                  ? "bg-pink-100 border-2 border-pink-500"
                  : "bg-white border-2 border-gray-200 hover:border-pink-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  showCorrect 
                    ? "bg-green-500 text-white"
                    : showWrong
                    ? "bg-red-500 text-white"
                    : isSelected
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {showCorrect ? "✓" : showWrong ? "✗" : String.fromCharCode(65 + index)}
                </div>
                <span className="flex-1">{answer}</span>
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-6">
          <button
            onClick={nextQuestion}
            className="px-6 py-3 rounded-full text-white font-medium"
            style={{ background: "linear-gradient(135deg,#FF6B9D,#C2185B)" }}
          >
            {currentQuestion < QUIZ_QUESTIONS.length - 1 ? "Pertanyaan Selanjutnya" : "Lihat Hasil"}
          </button>
        </div>
      )}
    </div>
  );
}
