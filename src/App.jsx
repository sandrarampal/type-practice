import "./App.css";
import { useState, useEffect } from "react";
import { generate } from "random-words";

function App() {
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isPracticeActive, setIsPracticeActive] = useState(false);
  const [errorIndex, setErrorIndex] = useState(-1);

  const generateNewWord = () => {
    const word = generate();
    setCurrentWord(word);
    setUserInput("");
    setErrorIndex(-1);
  };

  useEffect(() => {
    generateNewWord();
  }, []);

  const handleStartPractice = () => {
    setIsPracticeActive(true);
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

  return (
    <div className="App">
      <h1>Entraînement à la dactylographie</h1>
      <div className="word-display">
        <h2>Mot à taper : {renderWord()}</h2>
      </div>
      <div className="input-area">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          disabled={!isPracticeActive}
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
