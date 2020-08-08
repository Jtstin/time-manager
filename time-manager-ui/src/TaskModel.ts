//Name: Justin Tan
//Start Date: 23/07/2020
//Last Updated: 08/08/2020
//Description: defines the properties of tasks

export namespace TaskModel {
  // priority definition
  export enum Priority {
    High = "High",
    Medium = "Medium",
    Low = "Low",
  }
  const _priorityMap = {}; //maps priority to number for sorting
  _priorityMap[Priority.High] = 1;
  _priorityMap[Priority.Medium] = 2;
  _priorityMap[Priority.Low] = 3;
  export const priorityMap = { ..._priorityMap };
  export interface Task {
    //task definition
    id: number;
    name: string;
    dueBy: string;
    priority: Priority;
    completed?: number;
    completedDateText?: string;
  }
}
