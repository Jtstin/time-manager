import React from "react";
import { models } from "./models";

type TaskProps = models.Task & { handleCompletion: (taskId: number) => void };

export default function Task(props: TaskProps) {
  const { id, name, dueBy, priority, handleCompletion } = props;
  return (
    <div className="task-properties">
      <div>{name}</div>
      <div>DueBy: {dueBy}</div>
      <div>Priority:{priority}</div>
      <input type="checkbox" onClick={() => handleCompletion(id)}></input>
    </div>
  );
}
