import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Switch from "react-switch";
import Task from "./Task";
import { NewEvent } from "./NewEvent";
import { api } from "./api";
import IndiEvent from "./IndiEvent";
import { models } from "./models";

export default function Schedule() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [isEditMode, setEditMode] = useState(false);
  useEffect(() => {
    api.getEvents().then((result) => setEvents(result));
    api.getHighPriorityTasks().then((result) => setTasks(result));
  }, []);

  const handleSaveEvent = (newEvent) => {
    api.saveEvent(newEvent).then((response) => {
      if (response.status === 200) {
        setEvents([...events, newEvent]);
      }
    });
  };
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
              <div className="toggle-edit-container">
                <Switch
                  checked={isEditMode}
                  onChange={() => setEditMode(!isEditMode)}
                  onColor="#86d3ff"
                  onHandleColor="#2693e6"
                  handleDiameter={15}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                  height={10}
                  width={24}
                  className="react-switch"
                  id="material-switch"
                />
              </div>
              <div className="day-nav">
                <button>{"<"}</button>
                <div className="day">Monday</div>
                <button>{">"}</button>
              </div>
              <div className="events">
                {" "}
                {events.map((
                  event,
                  index //transforms each event into their own individual divs to display
                ) => (
                  <IndiEvent
                    key={`tl-${event.id}`}
                    name={event.name}
                    timeStart={event.timeStart}
                    timeEnd={event.timeEnd}
                    isEditMode={isEditMode}
                  ></IndiEvent>
                ))}
              </div>
              <NewEvent handleSaveEvent={handleSaveEvent} />
            </div>
            <div className="priority-tasks-container">
              <div className="priority-tasks">
                <div className="priority-task">
                  <div>
                    {tasks.map((task) => (
                      <Task key={`hp-${task.id}`} {...task} />
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
}
