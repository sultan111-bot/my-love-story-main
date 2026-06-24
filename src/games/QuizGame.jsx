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
      message = "I KNOWWW HEHEHEHEHEH";
    } else if (score >= 6) {
      emotion = "happy";
      message = "YEAYYYYY walaupun banyak yg salah sik cih";
    } else if (score >= 4) {
      emotion = "shy";
      message = "HMZZZZ.... yhh lumayan laaa";
    }

    return (
      <div className="text-center py-6 md:py-12 mb-2">
        <ConfettiEffect active={score >= 8} duration={4000} count={50} />
        <SultanMascot size="md" emotion={emotion} className="mx-auto sm:hidden" />
        <SultanMascot size="lg" emotion={emotion} className="mx-auto hidden sm:block md:hidden" />
        <SultanMascot size="xl" emotion={emotion} className="mx-auto hidden md:block lg:hidden" />
        <SultanMascot size="xl" emotion={emotion} className="mx-auto hidden lg:block" />
        <div className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-3 sm:mt-4 md:mt-6" style={{ color: "var(--theme-accent)" }}>
          Quiz Selesai!
        </div>
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold my-3 sm:my-4 md:my-5">{score}/{QUIZ_QUESTIONS.length}</div>
        <div className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10">{message}</div>
        
        <div className="flex justify-center gap-3 sm:gap-4 md:gap-6">
          <button
            onClick={resetGame}
            className="px-5 sm:px-7 md:px-10 py-3 sm:py-4 md:py-5 rounded-full text-white text-sm sm:text-base md:text-lg lg:text-xl"
            style={{ background: "linear-gradient(135deg,#FF6B9D,#C2185B)" }}
          >
            Main Lagi
          </button>
          <button onClick={onExit} className="px-5 sm:px-7 md:px-10 py-3 sm:py-4 md:py-5 rounded-full bg-gray-200 text-sm sm:text-base md:text-lg lg:text-xl">
            Keluar
          </button>
        </div>
      </div>
    );
  }

  const question = QUIZ_QUESTIONS[currentQuestion];

  return (
    <div className="text-center">
      <div className="mb-4 sm:mb-5 md:mb-6">
        <div className="flex justify-between items-center text-xs sm:text-sm md:text-lg lg:text-xl text-gray-600 mb-2 sm:mb-3 md:mb-4">
          <span>Pertanyaan {currentQuestion + 1} / {QUIZ_QUESTIONS.length}</span>
          <span>Skor: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 md:h-4">
          <div 
            className="h-2 sm:h-3 md:h-4 rounded-full transition-all duration-300"
            style={{ 
              width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`,
              background: "linear-gradient(135deg,#FF6B9D,#C2185B)"
            }}
          />
        </div>
      </div>

      <div className="mb-5 sm:mb-7 md:mb-10">
        <SultanMascot size="md" emotion={showResult ? (selectedAnswer === question.correct ? "happy" : "sad") : "thinking"} className="mx-auto mb-3 sm:hidden" />
        <SultanMascot size="lg" emotion={showResult ? (selectedAnswer === question.correct ? "happy" : "sad") : "thinking"} className="mx-auto mb-4 hidden sm:block md:hidden" />
        <SultanMascot size="xl" emotion={showResult ? (selectedAnswer === question.correct ? "happy" : "sad") : "thinking"} className="mx-auto mb-5 hidden md:block lg:block" />
        <div className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl mb-4 sm:mb-5 md:mb-7" style={{ color: "var(--theme-accent)" }}>
          {question.question}
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto">
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
              className={`w-full p-3 sm:p-4 md:p-6 lg:p-8 rounded-xl sm:rounded-2xl text-left transition-all duration-300 ${
                showCorrect 
                  ? "bg-green-100 border-2 sm:border-3 border-green-500 text-green-800"
                  : showWrong 
                  ? "bg-red-100 border-2 sm:border-3 border-red-500 text-red-800"
                  : isSelected 
                  ? "bg-pink-100 border-2 sm:border-3 border-pink-500"
                  : "bg-white border-2 sm:border-3 border-gray-200 hover:border-pink-300"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-xs sm:text-base md:text-xl lg:text-2xl font-bold ${
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
                <span className="flex-1 text-sm sm:text-base md:text-lg lg:text-xl">{answer}</span>
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className="mt-6 sm:mt-8 md:mt-10 mb-2">
          <button
            onClick={nextQuestion}
            className="px-7 sm:px-10 md:px-14 lg:px-16 py-3 sm:py-4 md:py-6 lg:py-7 rounded-full text-white text-sm sm:text-base md:text-lg lg:text-xl font-medium"
            style={{ background: "linear-gradient(135deg,#FF6B9D,#C2185B)" }}
          >
            {currentQuestion < QUIZ_QUESTIONS.length - 1 ? "Pertanyaan Selanjutnya" : "Lihat Hasil"}
          </button>
        </div>
      )}
    </div>
  );
}
