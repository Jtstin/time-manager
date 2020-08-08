import React, { useState } from "react";
import { models } from "./models";

const DefaultPriority = "Low";

interface NewTaskProps {
  // NewTaskProps allows for handler to be passed into the component
  handleSaveTask: (task) => void;
}

function generateId() {
  // generates id for task using time
  return Date.now();
}

function isEarlierThanToday(date: string) {
  // checks if the dueBy of new task is earlier than today's date
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const todayNumber = Date.parse(`${year}-${month}-${day}`);
  const dateNumber = Date.parse(date);

  return dateNumber < todayNumber;
}
export function NewTask(props: NewTaskProps) {
  // useState allows components to have states
  const [name, setName] = useState("");
  const [dueBy, setDueBy] = useState("");
  const [priority, setPriority] = useState(DefaultPriority);
  const [nameErrMsg, setNameErrMsg] = useState("");
  const [dateErrMsg, setDateErrMsg] = useState("");
  const handleSaveTask = () => {
    let hasValidationError = false; // initialise validation error to false
    if (name === "") {
      setNameErrMsg("Cannot be empty");
      hasValidationError = true;
    }
    if (dueBy === "") {
      setDateErrMsg("Cannot be empty");
      hasValidationError = true;
    }
    if (isEarlierThanToday(dueBy)) {
      setDateErrMsg("Due By cannot be earlier than today");
      hasValidationError = true;
    }
    if (hasValidationError) {
      // do not save task if there is a validation error
      return;
    }
    props.handleSaveTask({
      // saves new task to the database
      id: generateId(),
      name,
      dueBy,
      priority,
      completed: 0,
    });
  };
  return (
    // layout component
    // bind handlers to events and states to display
    <div className="task-add">
      <div className="new-task-name">
        <input
          type="text"
          placeholder="name"
          onChange={(e) => {
            // remove error message when user changes input
            setName(e.target.value);
            setNameErrMsg("");
          }}
        ></input>
        <div className="error-message">{nameErrMsg}</div>
      </div>
      <div className="new-task-date">
        <input
          type="date"
          onChange={(e) => {
            setDueBy(e.target.value);
            setDateErrMsg("");
          }}
        ></input>
        <div className="error-message">{dateErrMsg}</div>
      </div>
      <div className="new-task-priority">
        <select
          defaultValue={DefaultPriority}
          onChange={(e) => {
            setPriority(e.currentTarget.value);
          }}
        >
          <option value={models.Priority.High}>{models.Priority.High}</option>
          <option value={models.Priority.Medium}>
            {models.Priority.Medium}
          </option>
          <option value={models.Priority.Low}>{models.Priority.Low}</option>
        </select>
        <div className="error-message"></div>
      </div>
      <div className="new-task-add">
        <button onClick={handleSaveTask}>Add</button>
        <div className="error-message"></div>
      </div>
    </div>
  );
}
