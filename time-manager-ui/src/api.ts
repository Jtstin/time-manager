import { getHeaderWithBearerToken } from "./accessToken";

function getApiBaseURL() {
  // get the right Api Base URL supporting local development
  if (window.location.href.indexOf("localhost") >= 0) {
    return "http://localhost:3000";
  }
  return "https://time-manager.kahgeh.com/api";
}
export namespace api {
  export namespace contracts {
    // api data dictionary
    export interface Task {
      id: number;
      name: string;
      dueBy: string;
      priority: string;
      completed: number;
    }
    export type DayCount = [string, number];
    export interface Event {
      id: number;
      name: string;
      timeStart: string;
      timeEnd: string;
    }
  }
  export function getTasks(): Promise<contracts.Task[]> {
    // gets task from the api which gets it from the database
    return fetch(`${getApiBaseURL()}/tasks`, {
      method: "GET",
      headers: getHeaderWithBearerToken(), // include token for access
    })
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.tasks));
  }

  export function getHighPriorityTasks(): Promise<contracts.Task[]> {
    // gets high priority task from api
    return fetch(`${getApiBaseURL()}/high-priority-tasks`, {
      method: "GET",
      headers: getHeaderWithBearerToken(),
    })
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.tasks));
  }
  export function getRemainingTasks(): Promise<contracts.Task[]> {
    // gets remaining task from api
    return fetch(`${getApiBaseURL()}/remaining-tasks`, {
      method: "GET",
      headers: getHeaderWithBearerToken(),
    })
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.tasks));
  }
  export function getCompletedTaskSummary(): Promise<contracts.DayCount[]> {
    // gets completed task summary(graphs) from api
    return fetch(`${getApiBaseURL()}/completed-tasks-summary`, {
      method: "GET",
      headers: getHeaderWithBearerToken(),
    })
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.summary));
  }
  export function saveTask(task: contracts.Task): Promise<Response> {
    // saves new task to api which then saves it to the database
    return fetch(`${getApiBaseURL()}/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(task),
      headers: getHeaderWithBearerToken(),
    });
  }

  export function getEvents(eventDate: string): Promise<contracts.Event[]> {
    // gets events from database
    return fetch(`${getApiBaseURL()}/events/${eventDate}`, {
      method: "GET",
      headers: getHeaderWithBearerToken(),
    })
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.events));
  }

  export function saveEvent(
    eventDate: string,
    event: contracts.Event
  ): Promise<Response> {
    // saves new event to database
    return fetch(`${getApiBaseURL()}/events/${eventDate}/${event.id}`, {
      method: "PUT",
      headers: getHeaderWithBearerToken(),
      body: JSON.stringify(event),
    });
  }

  export function deleteEvent(eventDate, eventId: number): Promise<Response> {
    // deletes event from database
    return fetch(`${getApiBaseURL()}/events/${eventDate}/${eventId}`, {
      method: "DELETE",
      headers: getHeaderWithBearerToken(),
    });
  }

  export function deleteTask(taskId: number): Promise<Response> {
    // deletes task from database
    return fetch(`${getApiBaseURL()}/tasks/${taskId}`, {
      method: "DELETE",
      headers: getHeaderWithBearerToken(),
    });
  }

  export function login(password: string): Promise<string> {
    // verifies password and exchanges it for a token to access api
    return fetch(`${getApiBaseURL()}/login`, {
      method: "POST",
      body: JSON.stringify({ password }),
    }).then((response) => {
      if (response.ok) {
        // if response is 200(ok) then return token
        return response
          .json()
          .then((tokenObject: { accessToken: string }) =>
            Promise.resolve(tokenObject.accessToken)
          );
      }
      return Promise.resolve(null); //don't return token if verification is not successsful
    });
  }
}
