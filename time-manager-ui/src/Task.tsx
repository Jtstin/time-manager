import React from "react";

export enum Priority {
  High = "High",
  Medium = "Medium",
  Low = "Low",
} //fixed values for priorities

export interface TaskData {
  name: string;
  dueBy: string;
  priority: Priority;
}

export default function Task(props: TaskData) {
  return (
    <div className="task-properties">
      <div>{props.name}</div>
      <div>DueBy: {props.dueBy}</div>
      <div>Priority:{props.priority}</div>
      <input type="checkbox"></input>
    </div>
  );
}
