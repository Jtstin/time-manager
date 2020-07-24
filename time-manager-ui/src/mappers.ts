import { models } from "./models";
import { api } from "./api";

export namespace mappers {
  export function toTaskContract(task: models.Task): api.contracts.Task {
    const { id, name, dueBy, priority, completed } = task;
    return {
      id,
      name,
      dueBy,
      priority,
      completed,
    };
  }
}
