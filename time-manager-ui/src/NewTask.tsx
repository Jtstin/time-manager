import React, { useState } from "react";
import { models } from "./models";

interface NewTaskProps {
  handleSaveTask: (task) => void;
}

function generateId() {
  return Date.now();
}
const DefaultPriority = "Low";
export function NewTask(props: NewTaskProps) {
  const [name, setName] = useState("");
  const [dueBy, setDueBy] = useState("");
  const [priority, setPriority] = useState(DefaultPriority);

  return (
    <div className="task-add">
      <input
        type="text"
        placeholder="name"
        onChange={(e) => setName(e.target.value)}
      ></input>
      <input type="date" onChange={(e) => setDueBy(e.target.value)}></input>
      <select
        defaultValue={DefaultPriority}
        onChange={(e) => {
          setPriority(e.currentTarget.value);
        }}
      >
        <option value={models.Priority.High}>{models.Priority.High}</option>
        <option value={models.Priority.Medium}>{models.Priority.Medium}</option>
        <option value={models.Priority.Low}>{models.Priority.Low}</option>
      </select>
      <button
        onClick={() =>
          props.handleSaveTask({ id: generateId(), name, dueBy, priority })
        }
      >
        Add
      </button>
    </div>
  );
}
