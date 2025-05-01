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
    <div className="word-display">
      <h2>Word to type : {renderWord()}</h2>
    </div>
  );
};

export default WordDisplay;
