import React from "react";
import { useHistory } from "react-router-dom";

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
      dueBy: "01/01/2001",
      priority: Priority.High,
    },
    {
      name: "Task 2",
      dueBy: "02/02/2002",
      priority: Priority.Medium,
    },
  ];
  const handleScheduleButtonClick = () => {
    history.push("/schedule");
  };
  return (
    <div className="task-page">
      <button onClick={handleScheduleButtonClick}>Schedule </button>
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
            <div id={`task-${index}`}>
              <div>{task.name}</div>
              <div></div>
              <div></div>
            </div>
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
        <div>right</div>
      </div>
    </div>
  );
};

export default Tasks;
