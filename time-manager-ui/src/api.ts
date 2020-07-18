export namespace api {
  const apiHost = "http://localhost:3000";
  export namespace contracts {
    export interface Task {
      id: string;
      name: string;
      dueBy: string;
      priority: string;
    }
  }
  export function getTasks(): Promise<contracts.Task[]> {
    return fetch(`${apiHost}/tasks`)
      .then((response) => response.json())
      .then((data) => Promise.resolve(data.tasks));
  }
}
