import React, { useState } from "react";

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
          console.log(`priority=${e.currentTarget.value}`);
          setPriority(e.currentTarget.value);
        }}
      >
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
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
