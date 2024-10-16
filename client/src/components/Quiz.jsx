import React, { useState, useEffect, useContext, useDebugValue } from "react";
import { UserContext } from "../context/UserContext";
import "../styles/quiz.css";

const Quiz = () => {
  const { currentUser, updateUser } = useContext(UserContext);
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timer, setTimer] = useState(60); // Timer starts at 60 seconds
  const [totalTimeTaken, setTotalTimeTaken] = useState(0); // Keeps track of time for entire quiz
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track correct answers
  const [quizCompleted, setQuizCompleted] = useState(false); // Track if quiz is completed
  const [regularPoints, setRegularPoints] = useState(0); // Track regular points
  const [bonusPoints, setBonusPoints] = useState(0); // Track bonus points
  const [hasTakenQuizBefore, setHasTakenQuizBefore] = useState(false); // Track if the quiz has been taken

  useEffect(() => {
    console.log(currentUser);
  }, [currentUser, currentUser.highestQuizScore]);

  // Check if the user has completed the quiz before
  useEffect(() => {
    if (
      currentUser &&
      currentUser.completed &&
      currentUser.completed.includes("q1")
    ) {
      setHasTakenQuizBefore(true); // Set this to true if "q1" is found in completed tasks
    }
  }, [currentUser.completed]);

  // Fetch questions from the backend
  useEffect(() => {
    const fetchQuestions = async () => {
      const baseURL =
        import.meta.env.MODE === "development"
          ? "http://localhost:8080"
          : import.meta.env.VITE_BACKEND_URL;

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
    setTotalTimeTaken(0);
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
    let bonusPointsAwarded = 0;
    const timeTaken = 60 - timer; // Calculate time taken in seconds

    // Add the time taken for this question to the total time taken
    setTotalTimeTaken((prevTotal) => prevTotal + (60 - timer));

    if (selectedAnswer === quizData[currentQuestion].answer) {
      setCorrectAnswers((prev) => prev + 1); // Increment correct answers
      setRegularPoints((prevPoints) => prevPoints + 20); // Add 20 points for correct answer

      // Award bonus points based on time taken
      if (timeTaken <= 2) {
        bonusPointsAwarded = 5; // 5 extra points for answers given within 2 seconds
      } else if (timeTaken <= 4) {
        bonusPointsAwarded = 3; // 3 extra points for answers given between 3-4 seconds
      } else if (timeTaken <= 5) {
        bonusPointsAwarded = 1; // 1 extra point for answers given at 5 seconds
      }

      setBonusPoints((prevBonus) => prevBonus + bonusPointsAwarded); // Add bonus points to bonusPoints state
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
    const totalScore = regularPoints + bonusPoints;
    const perfectScore = quizData.length * 20; // Assuming each question is worth 20 points

    // Check for the perfect score
    const isPerfectScore = correctAnswers === quizData.length;

    // Check for completing under a minute
    const completedUnderMinute = totalTimeTaken < 60;

    // Update user badges based on conditions
    if (isPerfectScore) {
      updateUser({
        ...currentUser,
        badges: [...currentUser.badges, "Quiz Champion"],
      });
    }

    if (completedUnderMinute) {
      updateUser({
        ...currentUser,
        badges: [...currentUser.badges, "Speedster"],
      });
    }

    if (totalPoints > currentUser.highestQuizScore) {
      updateUserData(totalPoints, currentUser._id);
    }
  };

  const updateUserData = async (points, userId) => {
    const baseURL =
      import.meta.env.MODE === "development"
        ? "http://localhost:8080"
        : import.meta.env.VITE_BACKEND_URL;

    try {
      // 1. Update user points
      const pointsResponse = await fetch(
        `${baseURL}/api/users/${userId}/points`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            points: points - currentUser.highestQuizScore, // Update points to the new highest score
          }),
        },
      );

      if (!pointsResponse.ok) {
        throw new Error("Failed to update user points");
      }

      const pointsResult = await pointsResponse.json();
      console.log("User points updated successfully:", pointsResult);

      // 2. Update completed tasks
      if (!currentUser.completed.includes("q1")) {
        const taskResponse = await fetch(
          `${baseURL}/api/users/${userId}/completed`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              task: "q1", // The task ("q1") to be added to the completed array
            }),
          },
        );

        if (!taskResponse.ok) {
          throw new Error("Failed to update user's completed tasks");
        }

        const taskResult = await taskResponse.json();
        console.log("User's completed tasks updated successfully:", taskResult);
      }

      // Update user's highest quiz score
      const response = await fetch(`${baseURL}/api/users/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          highestQuizScore: points,
        }),
      });

      // 3. Update currentUser using updateUser from UserContext
      const userDataResponse = await fetch(`${baseURL}/api/users/${userId}`);
      if (!userDataResponse.ok) {
        throw new Error(
          "Failed to fetch user data after updating points and tasks",
        );
      }

      const userData = await userDataResponse.json();
      updateUser(userData.user);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const totalQuestions = quizData.length;
  const totalPoints = regularPoints + bonusPoints; // Calculate total points

  if (!quizData.length) {
    return <div>Loading questions...</div>; // Loader while fetching data
  }

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
          <button onClick={handleStartQuiz}>
            {hasTakenQuizBefore ? "Retake Quiz" : "Start Quiz"}
          </button>
        </div>
      ) : quizCompleted ? (
        <div className="results">
          <h2>Quiz Complete!</h2>
          <h3>Results:</h3>
          <p>Score: {regularPoints} points</p>
          <p>Bonus Points: {bonusPoints} points</p>
          <p>Total Score: {totalPoints} points</p>
          <p>Best Score: {currentUser.highestQuizScore} points</p>
          <h3>
            {totalPoints >= totalQuestions * 10
              ? "Good job!"
              : "Better luck next time!"}
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
          <div className="score">
            Score: {regularPoints + bonusPoints} points
          </div>

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
              ),
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
