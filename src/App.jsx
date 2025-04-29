import "./App.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { generate } from "random-words";

function App() {
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isPracticeActive, setIsPracticeActive] = useState(false);
  const [errorIndex, setErrorIndex] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(5.0);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const generateNewWord = useCallback(() => {
    const word = generate();
    setCurrentWord(word);
    setUserInput("");
    setErrorIndex(-1);
    const newTime = Math.max(1.0, 5.0 - successCount * 0.1);
    setTimeLeft(newTime);
    setShowTimeUp(false);
  }, [successCount]);

  const resetGame = useCallback(() => {
    setSuccessCount(0);
    setErrorCount(0);
    generateNewWord();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [generateNewWord]);

  useEffect(() => {
    generateNewWord();
  }, [generateNewWord]);

  useEffect(() => {
    if (isPracticeActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 0.1;
          if (newTime <= 0) {
            setShowTimeUp(true);
            return 0;
          }
          return Number(newTime.toFixed(1));
        });
      }, 100);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPracticeActive, timeLeft]);

  const handleStartPractice = useCallback(() => {
    setIsPracticeActive(true);
    setShowTimeUp(false);
    generateNewWord();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [generateNewWord]);

  const handleInputChange = useCallback(
    (e) => {
      if (!isPracticeActive) return;

      const input = e.target.value;
      setUserInput(input);

      // Vérification optimisée
      let hasError = false;
      for (let i = 0; i < input.length; i++) {
        if (input[i] !== currentWord[i]) {
          setErrorIndex(i);
          setErrorCount((prev) => prev + 1);
          hasError = true;
          break;
        }
      }

      if (!hasError) {
        setErrorIndex(-1);
        if (input.length === currentWord.length) {
          setSuccessCount((prev) => prev + 1);
          setTimeout(generateNewWord, 0);
        }
      }
    },
    [isPracticeActive, currentWord, generateNewWord]
  );

  const renderWord = useCallback(() => {
    return currentWord.split("").map((letter, index) => {
      const isIncorrect = index === errorIndex;
      return (
        <span key={index} className={isIncorrect ? "incorrect" : ""}>
          {letter}
        </span>
      );
    });
  }, [currentWord, errorIndex]);

  const getTimerClassName = useCallback(() => {
    if (timeLeft <= 1.0) return "timer danger";
    if (timeLeft <= 2.0) return "timer warning";
    return "timer";
  }, [timeLeft]);

  return (
    <div className="App">
      <h1>Typing Practice</h1>
      <div className="score-display">
        <div className="score-item score-success">
          <span>✅ Success :</span>
          <span>{successCount}</span>
        </div>
        <div className="score-item score-error">
          <span>❌ Errors :</span>
          <span>{errorCount}</span>
        </div>
      </div>
      <div className={getTimerClassName()}>{timeLeft.toFixed(1)}s</div>
      {showTimeUp && (
        <div className="time-up-message">
          Time's up!
          <button className="retry-button" onClick={resetGame}>
            Try Again
          </button>
        </div>
      )}
      <div className="word-display">
        <h2>Word to type : {renderWord()}</h2>
      </div>
      <div className="input-area">
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={!isPracticeActive || timeLeft === 0}
          placeholder={
            isPracticeActive ? "Type the word here..." : "Click Start to begin"
          }
        />
      </div>
      <button onClick={handleStartPractice} disabled={isPracticeActive}>
        Start Practice
      </button>
    </div>
  );
}

export default App;
