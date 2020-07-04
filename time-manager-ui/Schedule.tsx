import React, { useImperativeHandle } from "react";
import { useHistory } from "react-router-dom";
import Task, { TaskData, Priority } from "./Task";

const tasks: TaskData[] = [
  {
    name: "Task 1",
    dueBy: "00/00/2001",
    priority: Priority.High,
  },
  {
    name: "Task 2",
    dueBy: "00/00/2001",
    priority: Priority.High,
  },
];

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
                <div>
                  <input type="text"></input>
                </div>
                <div>
                  <input type="time"></input>
                </div>
                <div>
                  <input type="time"></input>
                </div>
                <div>
                  <button>Add</button>
                </div>
                <div>
                  <button>Edit</button>
                </div>
              </div>
            </div>
            <div className="priority-tasks-container">
              <div className="priority-tasks">
                <div className="priority-task">
                  <div>
                    {tasks.map((task, index) => (
                      <Task
                        name={task.name}
                        dueBy={task.dueBy}
                        priority={task.priority}
                      />
                    ))}
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
