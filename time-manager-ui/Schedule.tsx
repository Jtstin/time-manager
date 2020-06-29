import React, { useImperativeHandle } from "react";
import { useHistory } from "react-router-dom";

const Schedule = () => {
  const history = useHistory();
  const handleTaskButtonClick = () => {
    history.push("/tasks");
  };
  return (
    <div>
      <button onClick={handleTaskButtonClick}>Task</button>
    </div>
  );
};

export default Schedule;
