import React from "react";

export enum Priority {
  High = "high",
  Medium = "medium",
  Low = "low",
} //fixed values for priorities

export interface TaskData {
  name: string;
  dueBy: string;
  priority: Priority;
}

export default function Task(props: TaskData) {
  //const { name, dueBy, priority } = props;
  return (
    <div className="task-properties">
      <div>{props.name}</div>
      <div>DueBy: {props.dueBy}</div>
      <div>Priority:{props.priority}</div>
      <input type="checkbox"></input>
    </div>
  );
}
