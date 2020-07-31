import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Switch from "react-switch";
import Task from "./Task";
import { NewEvent } from "./NewEvent";
import { api } from "./api";
import IndiEvent from "./IndiEvent";
import { models } from "./models";
enum NavigationDirection {
  forward,
  backwards,
}
const DayNumberToDayText = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};
function getDateText(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getToday() {
  const now = new Date();
  return getDateText(now);
}

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState("");
  const [currentDayOfTheWeek, setCurrentDayOfTheWeek] = useState("");
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [isEditMode, setEditMode] = useState(false);
  useEffect(() => {
    const today = getToday();
    setCurrentDate(today);
    const dayOfWeekNumber = new Date(today).getDay();
    setCurrentDayOfTheWeek(DayNumberToDayText[dayOfWeekNumber]);
    api.getEvents(today).then((result) => setEvents(result));
    api.getHighPriorityTasks().then((result) => setTasks(result));
  }, []);

  const handleNavigateDate = (direction: NavigationDirection) => {
    if (direction === NavigationDirection.forward) {
      const nextDayNumber = Date.parse(currentDate) + 1000 * 60 * 60 * 24;
      const nextDay = new Date(nextDayNumber);
      const nextDayText = getDateText(nextDay);
      const nextDayOfTheWeek = DayNumberToDayText[nextDay.getDay()];
      api.getEvents(nextDayText).then((result) => {
        setEvents(result);
        setCurrentDate(nextDayText);
        setCurrentDayOfTheWeek(nextDayOfTheWeek);
      });
      return;
    }
    const prevDayNumber = Date.parse(currentDate) - 1000 * 60 * 60 * 24;
    const prevDay = new Date(prevDayNumber);
    const prevDayText = getDateText(prevDay);
    const prevDayOfTheWeek = DayNumberToDayText[prevDay.getDay()];
    api.getEvents(prevDayText).then((result) => {
      setEvents(result);
      setCurrentDate(prevDayText);
      setCurrentDayOfTheWeek(prevDayOfTheWeek);
    });
  };
  const handleSaveEvent = (newEvent) => {
    api.saveEvent(currentDate, newEvent).then((response) => {
      if (response.ok) {
        setEvents([...events, newEvent]);
      }
    });
  };
  const history = useHistory();
  const handleTaskButtonClick = () => {
    history.push("/tasks");
  };
  const handleDeleteEvent = (eventId) => {
    api.deleteEvent(currentDate, eventId).then((response) => {
      if (response.ok) {
        const newEventList = [...events].filter(
          (event) => event.id !== eventId
        );
        setEvents(newEventList);
      }
    });
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
                <button
                  onClick={() =>
                    handleNavigateDate(NavigationDirection.backwards)
                  }
                >
                  {"<"}
                </button>
                <div className="day">
                  {currentDayOfTheWeek}({currentDate})
                </div>
                <button
                  onClick={() =>
                    handleNavigateDate(NavigationDirection.forward)
                  }
                >
                  {">"}
                </button>
              </div>
              <div className="events">
                {" "}
                {events.map((
                  event,
                  index //transforms each event into their own individual divs to display
                ) => (
                  <IndiEvent
                    key={`tl-${event.id}`}
                    eventId={event.id}
                    name={event.name}
                    timeStart={event.timeStart}
                    timeEnd={event.timeEnd}
                    handleDelete={handleDeleteEvent}
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
