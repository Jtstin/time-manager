//Name: Justin Tan
//Start Date: 07/07/2020
//Last Updated: 08/08/2020
//Description: This is the schedule screen where the user's events and high priority tasks will be shown

//Data Dictionary
//Name                  Type      Scope     Description
//currentDate           Date      local     The current date
//currentDayOfTheWeek   string    local     The name of the day of the week
//tasks                 array     local     The high priority tasks that are displayed
//events                array     local     The events that are scheduled
//isEditMode            boolean   local     Whether the user is in edit mode or not

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Switch from "react-switch";
import Task from "./Task";
import { NewEvent } from "./NewEvent";
import { api } from "./api";
import IndiEvent from "./IndiEvent";
import { redirectToLoginWhenTokenNotFound } from "./accessToken";

enum NavigationDirection {
  forward,
  backwards,
}
const DayNumberToDayText = {
  // asigns a number to the day of the week
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};
function getDateText(date: Date) {
  // gets the year, month and date to format into a string
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getToday() {
  // gets today's date
  const now = new Date();
  return getDateText(now);
}

export default function Schedule() {
  // useState allows components to have states
  const [currentDate, setCurrentDate] = useState("");
  const [currentDayOfTheWeek, setCurrentDayOfTheWeek] = useState("");
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [isEditMode, setEditMode] = useState(false);
  const history = useHistory();

  const setEventsWithSort = (events) => {
    // sorts events based on the start time
    const sortedEvents = events.sort(
      (e1, e2) =>
        Number(e1.timeStart.replace(new RegExp(":", "g"), "")) -
        Number(e2.timeStart.replace(new RegExp(":", "g"), ""))
    );
    setEvents(sortedEvents);
  };
  useEffect(() => {
    if (redirectToLoginWhenTokenNotFound(history)) {
      // go to login screen when login token is not found
      // otherwise continue with schedule screen
      return;
    }

    // gets current day to display the days events
    const today = getToday();
    setCurrentDate(today);
    const dayOfWeekNumber = new Date(today).getDay();
    setCurrentDayOfTheWeek(DayNumberToDayText[dayOfWeekNumber]);
    api.getEvents(today).then((result) => setEventsWithSort(result));

    // gets and shows remaining high priority tasks
    api.getHighPriorityTasks().then((tasks) => {
      const remainingHighPriorityTasks = tasks.filter(
        (task) => task.completed === 0
      );
      setTasks(remainingHighPriorityTasks);
    });
  }, []);

  const handleNavigateDate = (direction: NavigationDirection) => {
    // allows user to toggle between days
    if (direction === NavigationDirection.forward) {
      // the next day
      const nextDayNumber = Date.parse(currentDate) + 1000 * 60 * 60 * 24;
      const nextDay = new Date(nextDayNumber);
      const nextDayText = getDateText(nextDay);
      const nextDayOfTheWeek = DayNumberToDayText[nextDay.getDay()];
      api.getEvents(nextDayText).then((result) => {
        setEventsWithSort(result);
        setCurrentDate(nextDayText);
        setCurrentDayOfTheWeek(nextDayOfTheWeek);
      });
      return;
    }
    // the previous day
    const prevDayNumber = Date.parse(currentDate) - 1000 * 60 * 60 * 24;
    const prevDay = new Date(prevDayNumber);
    const prevDayText = getDateText(prevDay);
    const prevDayOfTheWeek = DayNumberToDayText[prevDay.getDay()];
    api.getEvents(prevDayText).then((result) => {
      setEventsWithSort(result);
      setCurrentDate(prevDayText);
      setCurrentDayOfTheWeek(prevDayOfTheWeek);
    });
  };
  const handleSaveEvent = (newEvent) => {
    // saves event based on the current date and displays it
    api.saveEvent(currentDate, newEvent).then((response) => {
      if (response.ok) {
        setEventsWithSort([...events, newEvent]);
      }
    });
  };

  const handleTaskButtonClick = () => {
    // takes user to tasks screen
    history.push("/tasks");
  };
  const handleDeleteEvent = (eventId) => {
    // deletes the event based on the current date and event id and diplays new event list
    api.deleteEvent(currentDate, eventId).then((response) => {
      if (response.ok) {
        const newEventList = [...events].filter(
          (event) => event.id !== eventId
        );
        setEventsWithSort(newEventList);
      }
    });
  };
  return (
    // layout component
    // bind handlers to events and states to display
    <div className="main-container">
      <div className="schedule-page">
        <div className="schedule-page-header">
          <button onClick={handleTaskButtonClick}>Go To Tasks</button>
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
