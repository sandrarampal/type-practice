import "./App.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { generate } from "random-words";
import ScoreDisplay from "./components/ScoreDisplay";
import Timer from "./components/Timer";
import WordDisplay from "./components/WordDisplay";
import InputArea from "./components/InputArea";
import TimeUpMessage from "./components/TimeUpMessage";
import Title from "./components/Title";

function App() {
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isPracticeActive, setIsPracticeActive] = useState(false);
  const [errorIndex, setErrorIndex] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(5.0);
  const [successCount, setSuccessCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [bestScore, setBestScore] = useState(() => {
    const savedScore = localStorage.getItem("bestScore");
    return savedScore ? parseInt(savedScore) : 0;
  });
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
    if (successCount > bestScore) {
      setBestScore(successCount);
      localStorage.setItem("bestScore", successCount.toString());
    }
    setSuccessCount(0);
    setErrorCount(0);
    generateNewWord();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [generateNewWord, successCount, bestScore]);

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

  return (
    <div className="App">
      <Title />
      <ScoreDisplay
        successCount={successCount}
        errorCount={errorCount}
        bestScore={bestScore}
      />
      <Timer timeLeft={timeLeft} />
      <WordDisplay currentWord={currentWord} errorIndex={errorIndex} />
      <InputArea
        userInput={userInput}
        handleInputChange={handleInputChange}
        isPracticeActive={isPracticeActive}
        timeLeft={timeLeft}
        inputRef={inputRef}
      />
      {showTimeUp && <TimeUpMessage resetGame={resetGame} />}
      <button onClick={handleStartPractice} disabled={isPracticeActive}>
        Start Practice
      </button>
    </div>
  );
}

export default App;
