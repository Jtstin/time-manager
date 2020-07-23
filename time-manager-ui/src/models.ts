export namespace models {
  export enum Priority {
    High = "High",
    Medium = "Medium",
    Low = "Low",
  }
  const _priorityMap = {};
  _priorityMap[Priority.High] = 1;
  _priorityMap[Priority.Medium] = 2;
  _priorityMap[Priority.Low] = 3;
  export const priorityMap = { ..._priorityMap };
  export interface Task {
    name: string;
    dueBy: string;
    priority: Priority;
    completed: number;
    completedDateText: string;
  }
}
