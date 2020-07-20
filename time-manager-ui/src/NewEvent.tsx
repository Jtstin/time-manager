import React, { useState } from "react";

interface NewEventProps {
  handleSaveEvent?: (event) => void;
}

function generateId() {
  return Date.now();
}

export function NewEvent(props: NewEventProps) {
  const [name, setName] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  return (
    <div className="modify-events">
      <div>
        <input
          type="text"
          placeholder="name"
          onChange={(e) => setName(e.target.value)}
        ></input>
      </div>
      <div>
        <input
          type="time"
          onChange={(e) => setTimeStart(e.target.value)}
        ></input>
      </div>
      <div>
        <input type="time" onChange={(e) => setTimeEnd(e.target.value)}></input>
      </div>
      <div>
        <button
          onClick={() =>
            props.handleSaveEvent({
              id: generateId(),
              name,
              timeStart,
              timeEnd,
            })
          }
        >
          Add
        </button>
      </div>
      <div>
        <button>Edit</button>
      </div>
    </div>
  );
}
