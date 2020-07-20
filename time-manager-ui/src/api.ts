export namespace api {
  const apiHost = "http://localhost:3000";
  export namespace contracts {
    export interface Task {
      id: string;
      name: string;
      dueBy: string;
      priority: string;
    }
    export interface Event {
      id: string;
      name: string;
      timeStart: string;
      timeEnd: string;
    }
  }
  export function getTasks(): Promise<contracts.Task[]> {
    return fetch(`${apiHost}/tasks`)
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.tasks));
  }

  export function saveTask(task: contracts.Task): Promise<Response> {
    return fetch(`${apiHost}/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
  }

  export function getEvents(): Promise<contracts.Event[]> {
    return fetch(`${apiHost}/events`)
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.events));
  }

  export function saveEvent(event: contracts.Event): Promise<Response> {
    return fetch(`${apiHost}/events/${event.id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    });
  }
}
