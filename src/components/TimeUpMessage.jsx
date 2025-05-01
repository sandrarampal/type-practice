import React from "react";

const TimeUpMessage = ({ resetGame }) => {
  return (
    <div className="time-up-message">
      <p>Time's up!</p>
      <button className="retry-button" onClick={resetGame}>
        Try Again
      </button>
    </div>
  );
};

export default TimeUpMessage;
