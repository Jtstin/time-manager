//Name: Justin Tan
//Start Date: 20/07/2020
//Last Updated: 08/08/2020
//Description: Allows adding a new event to schedule

//Data Dictionary
//Name             Type      Scope     Description
//name             string    local     Name of new event
//timeStart        Time      local     Time that new event starts
//timeEnd          Time      local     Time that new event ends
//nameErrMsg       string    local     Error message when name textbox is empty
//timeEndErrMsg    string    local     Error message when time end is ealier than time start and when it is empty
//timeStartErrMsg  string    local     Error message when time start is empty

import React, { useState } from "react";

interface NewEventProps {
  // NewEventProps allows for handler to be passed into the component
  handleSaveEvent?: (event) => void;
}

function generateId() {
  return Date.now();
}
function isEndTimeEalierThanStartTime(timeStart, timeEnd) {
  // checks if the time end of new event is earlier than time start
  return timeEnd < timeStart;
}
export function NewEvent(props: NewEventProps) {
  // useState allows components to have states
  const [name, setName] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [nameErrMsg, setNameErrMsg] = useState("");
  const [timeEndErrMsg, setTimeEndErrMsg] = useState("");
  const [timeStartErrMsg, setTimeStartErrMsg] = useState("");
  const handleSaveEvent = () => {
    let hasValidationError = false; // initialise validation error to false
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
      // do not save event if there is a validation error
      return;
    }

    props.handleSaveEvent({
      // saves new event to the database
      id: generateId(),
      name,
      timeStart,
      timeEnd,
    });
  };
  return (
    // layout component
    // bind handlers to events and states to display
    <div className="modify-events">
      <div className="new-event-name">
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
