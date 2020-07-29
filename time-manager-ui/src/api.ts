function getApiBaseURL() {
  if (window.location.href.indexOf("localhost") >= 0) {
    return "http://localhost:3000";
  }
  return "https://time-manager.kahgeh.com/api";
}
export namespace api {
  export namespace contracts {
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
    return fetch(`${getApiBaseURL()}/tasks`)
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.tasks));
  }

  export function getHighPriorityTasks(): Promise<contracts.Task[]> {
    return fetch(`${getApiBaseURL()}/high-priority-tasks`)
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.tasks));
  }
  export function getRemainingTasks(): Promise<contracts.Task[]> {
    return fetch(`${getApiBaseURL()}/remaining-tasks`)
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.tasks));
  }
  export function getCompletedTaskSummary(): Promise<contracts.DayCount[]> {
    return fetch(`${getApiBaseURL()}/completed-tasks-summary`)
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.summary));
  }
  export function saveTask(task: contracts.Task): Promise<Response> {
    return fetch(`${getApiBaseURL()}/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
  }

  export function getEvents(eventDate: string): Promise<contracts.Event[]> {
    return fetch(`${getApiBaseURL()}/events/${eventDate}`)
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.events));
  }

  export function saveEvent(
    eventDate: string,
    event: contracts.Event
  ): Promise<Response> {
    return fetch(`${getApiBaseURL()}/events/${eventDate}/${event.id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    });
  }

  export function deleteEvent(eventId: number): Promise<Response> {
    return fetch(`${getApiBaseURL()}/events/${eventId}`, {
      method: "DELETE",
    });
  }
}
