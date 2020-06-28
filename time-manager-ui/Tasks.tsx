import React from "react";
import { render } from "react-dom";

const Tasks = () => {
  return (
    <div className="task-page">
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
        <div className="task-list"></div>
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
