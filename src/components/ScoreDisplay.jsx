import React from "react";

const ScoreDisplay = ({ successCount, errorCount }) => {
  return (
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
  );
};

export default ScoreDisplay;
