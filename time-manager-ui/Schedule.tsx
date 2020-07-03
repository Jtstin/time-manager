import React, { useImperativeHandle } from "react";
import { useHistory } from "react-router-dom";

const Schedule = () => {
  const history = useHistory();
  const handleTaskButtonClick = () => {
    history.push("/tasks");
  };
  return (
    <div className="main-container">
      <div className="schedule-page">
        <div className="schedule-page-header">
          <button onClick={handleTaskButtonClick}>Task</button>
        </div>
        <div className="schedule-page-content">
          <div className="schedule-main-content">
            <div className="event-container">
              {" "}
              <div className="day-nav">
                <button>{"<"}</button>
                <div className="day">Monday</div>
                <button>{">"}</button>
              </div>
              <div className="events"></div>
              <div className="modify-events">
                <input type="text"></input>
                <input type="time"></input>
                <input type="time"></input>
                <button>Add</button>
                <button>Edit</button>
              </div>
            </div>
            <div className="priority-tasks-container">
              <div className="priority-tasks">
                <div className="priority-task">
                  <div>
                    Task 1 Due By: 01/01/2001<input type="checkbox"></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
