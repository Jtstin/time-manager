import React from "react";
import { useHistory } from "react-router-dom";
import Task from "./Task";

enum Priority {
  High = "high",
  Medium = "medium",
  Low = "low",
} //fixed values for priorities

interface Task {
  name: string;
  dueBy: string;
  priority: Priority;
}

const Tasks = () => {
  const history = useHistory();
  const tasks: Task[] = [
    {
      name: "Task 1",
      dueBy: "00/00/2001",
      priority: Priority.High,
    },
    {
      name: "Task 2",
      dueBy: "00/00/2001",
      priority: Priority.Low,
    },
  ];
  const handleScheduleButtonClick = () => {
    history.push("/schedule");
  };
  return (
    <div className="main-container">
      <div className="task-page">
        <div className="task-page-header">
          <button onClick={handleScheduleButtonClick}>Schedule </button>
        </div>
        <div className="task-page-content">
          <div className="task-container">
            <div className="task-filter">
              <input type="text"></input>
              <select>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button>Search</button>
            </div>
            <div className="task-list">
              {tasks.map((
                task,
                index //transforms each task into their own individual divs to display
              ) => (
                <Task
                  name={task.name}
                  dueBy={task.dueBy}
                  priority={task.priority}
                ></Task>
              ))}
            </div>
            <div className="task-add">
              <input type="text"></input>
              <input type="date"></input>
              <select>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button>Add</button>
            </div>
          </div>
          <div className="graph-container">
            <div className="graph-header">
              <div></div>
              <div>COMPLETED TASKS</div>
              <select className="graph-selector">
                <option value="Pie">Pie</option>
                <option value="Bar">Bar</option>
              </select>
            </div>
            <div className="graph-section"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
