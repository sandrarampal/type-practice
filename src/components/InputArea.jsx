import React from "react";

const InputArea = ({
  userInput,
  handleInputChange,
  isPracticeActive,
  timeLeft,
  inputRef,
}) => {
  return (
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
  );
};

export default InputArea;
