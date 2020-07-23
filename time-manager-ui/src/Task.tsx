import React from "react";
import { models } from "./models";

type TaskProps = models.Task;

export default function Task(props: TaskProps) {
  return (
    <div className="task-properties">
      <div>{props.name}</div>
      <div>DueBy: {props.dueBy}</div>
      <div>Priority:{props.priority}</div>
      <input type="checkbox"></input>
    </div>
  );
}
