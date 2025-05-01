import React from "react";

const WordDisplay = ({ currentWord, errorIndex }) => {
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
    <div className="word-display-container">
      <span className="word-display-title">Word to type :</span>
      <div className="word-display">
        <h2>{renderWord()}</h2>
      </div>
    </div>
  );
};

export default WordDisplay;
