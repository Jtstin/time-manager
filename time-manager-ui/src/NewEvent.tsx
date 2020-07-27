import React, { useState } from "react";

interface NewEventProps {
  handleSaveEvent?: (event) => void;
}

function generateId() {
  return Date.now();
}
function isEndTimeEalierThanStartTime(timeStart, timeEnd) {
  return timeEnd < timeStart;
}
export function NewEvent(props: NewEventProps) {
  const [name, setName] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [nameErrMsg, setNameErrMsg] = useState("");
  const [timeEndErrMsg, setTimeEndErrMsg] = useState("");
  const [timeStartErrMsg, setTimeStartErrMsg] = useState("");
  const handleSaveEvent = () => {
    let hasValidationError = false;
    if (name === "") {
      setNameErrMsg("Cannot be empty");
      hasValidationError = true;
    }
    if (timeStart === "") {
      setTimeStartErrMsg("Cannot be empty");
      hasValidationError = true;
    }
    if (timeEnd === "") {
      setTimeEndErrMsg("Cannot be empty");
      hasValidationError = true;
    }
    if (isEndTimeEalierThanStartTime(timeStart, timeEnd)) {
      setTimeEndErrMsg("Event end time cannot be earlier than start time");
      hasValidationError = true;
    }
    if (hasValidationError) {
      return;
    }
    props.handleSaveEvent({
      id: generateId(),
      name,
      timeStart,
      timeEnd,
    });
  };
  return (
    <div className="modify-events">
      <div className="new-event-name">
        <input
          type="text"
          placeholder="name"
          onChange={(e) => {
            setName(e.target.value);
            setNameErrMsg("");
          }}
        ></input>
        <div className="error-message">{nameErrMsg}</div>
      </div>
      <div className="new-event-time">
        <input
          type="time"
          onChange={(e) => {
            setTimeStart(e.target.value);
            setTimeStartErrMsg("");
          }}
        ></input>
        <div className="error-message">{timeStartErrMsg}</div>
      </div>
      <div className="new-event-time">
        <input
          type="time"
          onChange={(e) => {
            setTimeEnd(e.target.value);
            setTimeEndErrMsg("");
          }}
        ></input>
        <div className="error-message">{timeEndErrMsg}</div>
      </div>
      <div>
        <div className="modify-events-button">
          <button onClick={handleSaveEvent}>Add</button>
        </div>
        <div className="error-message"></div>
      </div>
    </div>
  );
}
