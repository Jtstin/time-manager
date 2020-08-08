//Name: Justin Tan
//Start Date: 24/07/2020
//Last Updated: 08/08/2020
//Description: maps the ui data model to api data model

import { TaskModel } from "./TaskModel";
import { api } from "./api";

export namespace mappers {
  // maps ui data model to api data model
  export function toTaskContract(task: TaskModel.Task): api.contracts.Task {
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
