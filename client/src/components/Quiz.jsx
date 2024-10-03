import React, { useState, useEffect } from "react";
import "../styles/quiz.css";

const Quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(60); // Timer starts at 60 seconds
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track correct answers
  const [quizCompleted, setQuizCompleted] = useState(false); // Track if quiz is completed
  const [score, setScore] = useState(0); // Track the score

  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      const baseURL =
        process.env.NODE_ENV === "development"
          ? "http://localhost:8080"
          : process.env.VITE_BACKEND_URL;

      try {
        const response = await fetch(`${baseURL}/api/questions/`);
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    let countdown;
    if (isQuizStarted && !showAnswer && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            // Timer runs out
            handleTimeout();
            return 0; // Reset timer
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [isQuizStarted, timer, showAnswer]);

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
    setTimer(60); // Reset timer to 60 seconds
    setProgress(0);
  };

  const handleSelectAnswer = (optionKey) => {
    if (!showAnswer) {
      setSelectedAnswer(optionKey);
    }
  };

  const handleSubmitAnswer = () => {
    setShowAnswer(true);
    setProgress(Math.round(((currentQuestion + 1) / quizData.length) * 100)); // Round progress to an integer

    // Calculate bonus points based on the timer
    let bonusPoints = 0;
    const timeTaken = 60 - timer; // Calculate time taken in seconds

    if (selectedAnswer === quizData[currentQuestion].answer) {
      setCorrectAnswers((prev) => prev + 1); // Increment correct answers
      setScore((prevScore) => prevScore + 20); // Add 20 points for correct answer

      // Award bonus points based on time taken
      if (timeTaken <= 2) {
        bonusPoints = 5; // 5 extra points for answers given within 2 seconds
      } else if (timeTaken <= 4) {
        bonusPoints = 3; // 3 extra points for answers given between 3-4 seconds
      } else if (timeTaken <= 5) {
        bonusPoints = 1; // 1 extra point for answers given at 5 seconds
      }

      setScore((prevScore) => prevScore + bonusPoints); // Add bonus points to score
    }
  };

  const handleTimeout = () => {
    setShowAnswer(true);
    setSelectedAnswer(null);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    setCurrentQuestion((prev) => prev + 1);
    setTimer(60); // Reset timer for the next question
  };

  const handleFinishQuiz = () => {
    setQuizCompleted(true);
  };

  if (!quizData.length) {
    return <div>Loading questions...</div>; // Loader while fetching data
  }

  const totalQuestions = quizData.length;
  const scorePercentage = (correctAnswers / totalQuestions) * 100;

  return (
    <div className="quiz-container">
      {!isQuizStarted ? (
        <div>
          <h2>Welcome to the Quiz!</h2>
          <p>
            Test your knowledge of Lexington with a series of questions. Each
            question has a time limit, so choose your answers wisely!
          </p>
          <p>
            Click on the answer you believe is correct, then click "Submit
            Answer" to register your choice. After each question, you'll see
            whether you were right or wrong, along with an explanation. Good
            luck!
          </p>
          <button onClick={handleStartQuiz}>Start Quiz</button>
        </div>
      ) : quizCompleted ? (
        <div className="results">
          <h2>Quiz Complete!</h2>
          <h3>
            Your Score: {score} points ({Math.round(scorePercentage)}%)
          </h3>
          <h3>
            {scorePercentage >= 50 ? "Good job!" : "Better luck next time!"}
          </h3>
        </div>
      ) : (
        <div>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="progress">Progress: {progress}%</div>

          {/* Score display */}
          <div className="score">Score: {score} points</div>

          {/* Timer display */}
          <div>Time remaining: {timer}s</div>

          <h2>{quizData[currentQuestion].question}</h2>
          <div className="options">
            {Object.entries(quizData[currentQuestion].choices).map(
              ([key, option]) => (
                <button
                  key={key}
                  className={`option-btn ${
                    showAnswer
                      ? key === quizData[currentQuestion].answer
                        ? "correct"
                        : key === selectedAnswer
                          ? "wrong"
                          : ""
                      : selectedAnswer === key
                        ? "selected"
                        : ""
                  }`}
                  onClick={() => handleSelectAnswer(key)}
                  disabled={showAnswer} // Disable if answer is shown
                >
                  {option}
                </button>
              )
            )}
          </div>
          {!showAnswer && selectedAnswer !== null && (
            <button onClick={handleSubmitAnswer}>Submit Answer</button>
          )}
          {showAnswer && (
            <div className="answer-section">
              <h3>
                {timer === 0
                  ? "You ran out of time!"
                  : selectedAnswer === quizData[currentQuestion].answer
                    ? "Correct!"
                    : "Incorrect!"}
                {/* Show explanation only if it's not an empty string */}
                {selectedAnswer !== quizData[currentQuestion].answer &&
                  quizData[currentQuestion].explanation && (
                    <span> {quizData[currentQuestion].explanation}.</span>
                  )}
              </h3>
              {currentQuestion < quizData.length - 1 ? (
                <button onClick={handleNextQuestion}>Next Question</button>
              ) : (
                <button onClick={handleFinishQuiz}>Finish Quiz</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
