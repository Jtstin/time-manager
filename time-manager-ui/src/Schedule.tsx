import React, { useImperativeHandle, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Task, { TaskData, Priority } from "./Task";
import { NewEvent } from "./NewEvent";
import { api } from "./api";
import IndiEvent from "./IndiEvent";

const tasks: TaskData[] = [
  {
    name: "Task 1",
    dueBy: "00/00/2001",
    priority: Priority.High,
  },
  {
    name: "Task 2",
    dueBy: "00/00/2001",
    priority: Priority.High,
  },
];

export default function Schedule() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    //display for the first time, update, remove
    api.getEvents().then((result) => setEvents(result));
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
              {" "}
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
                  ></IndiEvent>
                ))}
              </div>
              <NewEvent handleSaveEvent={handleSaveEvent} />
            </div>
            <div className="priority-tasks-container">
              <div className="priority-tasks">
                <div className="priority-task">
                  <div>
                    {tasks.map((task, index) => (
                      <Task
                        name={task.name}
                        dueBy={task.dueBy}
                        priority={task.priority}
                      />
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
