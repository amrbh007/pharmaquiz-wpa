import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    // Fetch questions from the public folder
    fetch('/Lipinicott-Questions.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setQuestions(data);
      })
      .catch(error => {
        console.error("Could not fetch questions:", error);
        // In a real PWA, you might implement IndexedDB for truly robust offline data
      });
  }, []);

  const getRandomQuestion = useCallback(() => {
    if (questions.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }, [questions]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(getRandomQuestion());
    setShowAnswer(false);
    setSelectedOption(null);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);
  };

  const goToNextQuestion = () => {
    setCurrentQuestion(getRandomQuestion());
    setShowAnswer(false);
    setSelectedOption(null);
  };

  const getOptionClassName = (option) => {
    if (!showAnswer) return '';
    if (option === currentQuestion.answer) {
      return 'correct';
    } else if (option === selectedOption && option !== currentQuestion.answer) {
      return 'incorrect';
    }
    return '';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Pharmaquiz</h1>
      </header>

      {!quizStarted ? (
        <div className="start-screen">
          <button className="start-button" onClick={startQuiz}>
            Start Lipincott Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-container">
          {currentQuestion ? (
            <>
              <p className="question-text">{currentQuestion.question}</p>
              <div className="options-container">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${getOptionClassName(option)}`}
                    onClick={() => handleOptionClick(option)}
                    disabled={showAnswer}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {showAnswer && (
                <div className="answer-section">
                  <p className="feedback">
                    {selectedOption === currentQuestion.answer
                      ? "Correct!"
                      : `Incorrect. The correct answer was:`}
                  </p>
                  <p className="correct-answer">
                    {currentQuestion.answer}
                  </p>
                  <p className="explanation">
                    **Explanation:** {currentQuestion.explanation}
                  </p>
                  <button className="next-button" onClick={goToNextQuestion}>
                    Next Question
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>Loading questions or no questions available...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;