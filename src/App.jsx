import "./App.css";
import { useState, useEffect } from "react";
import { generate } from "random-words";

function App() {
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isPracticeActive, setIsPracticeActive] = useState(false);
  const [errorIndex, setErrorIndex] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(5.0);
  const [successCount, setSuccessCount] = useState(0);
  const [showTimeUp, setShowTimeUp] = useState(false);

  const generateNewWord = () => {
    const word = generate();
    setCurrentWord(word);
    setUserInput("");
    setErrorIndex(-1);
    const newTime = Math.max(1.0, 5.0 - successCount * 0.1);
    setTimeLeft(newTime);
    setShowTimeUp(false);
  };

  const resetGame = () => {
    setSuccessCount(0);
    generateNewWord();
  };

  useEffect(() => {
    generateNewWord();
  }, []);

  useEffect(() => {
    let timer;
    if (isPracticeActive && timeLeft > 0) {
      timer = setInterval(() => {
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
    return () => clearInterval(timer);
  }, [isPracticeActive, timeLeft]);

  const handleStartPractice = () => {
    setIsPracticeActive(true);
    setShowTimeUp(false);
    generateNewWord();
  };

  const handleInputChange = (e) => {
    if (!isPracticeActive) return;

    const input = e.target.value;
    setUserInput(input);

    // Vérifier chaque caractère
    for (let i = 0; i < input.length; i++) {
      if (input[i] !== currentWord[i]) {
        setErrorIndex(i);
        return;
      }
    }

    // Si on arrive ici, c'est que tout est correct
    setErrorIndex(-1);

    // Si le mot est complet et correct
    if (input.length === currentWord.length) {
      setSuccessCount((prev) => prev + 1);
      setTimeout(() => {
        generateNewWord();
      }, 500);
    }
  };

  const renderWord = () => {
    return currentWord.split("").map((letter, index) => {
      const isIncorrect = index === errorIndex;
      return (
        <span key={index} className={isIncorrect ? "incorrect" : ""}>
          {letter}
        </span>
      );
    });
  };

  const getTimerClassName = () => {
    if (timeLeft <= 1.0) return "timer danger";
    if (timeLeft <= 2.0) return "timer warning";
    return "timer";
  };

  return (
    <div className="App">
      <h1>Entraînement à la dactylographie</h1>
      <div className={getTimerClassName()}>{timeLeft.toFixed(1)}s</div>
      {showTimeUp && (
        <div className="time-up-message">
          Temps écoulé !
          <button className="retry-button" onClick={resetGame}>
            Réessayer
          </button>
        </div>
      )}
      <div className="word-display">
        <h2>Mot à taper : {renderWord()}</h2>
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={!isPracticeActive || timeLeft === 0}
          placeholder={
            isPracticeActive
              ? "Tapez le mot ici..."
              : "Cliquez sur Démarrer pour commencer"
          }
        />
      </div>
      <button onClick={handleStartPractice} disabled={isPracticeActive}>
        Démarrer l'entraînement
      </button>
    </div>
  );
}

export default App;
