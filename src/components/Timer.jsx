import React from "react";

const Timer = ({ timeLeft }) => {
  const getTimerClassName = () => {
    if (timeLeft <= 1.0) return "timer danger";
    if (timeLeft <= 2.0) return "timer warning";
    return "timer";
  };

  return <div className={getTimerClassName()}>{timeLeft.toFixed(1)}s</div>;
};

export default Timer;
