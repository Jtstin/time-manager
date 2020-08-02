import React from "react";
import { models } from "./models";

type TaskProps = models.Task & { handleCompletion?: (taskId: number) => void };
function getCheckbox(id: number, handleCompletion?: (taskId: number) => void) {
  if (handleCompletion) {
    return <input type="checkbox" onClick={() => handleCompletion(id)}></input>;
  }
  return null;
}
export default function Task(props: TaskProps) {
  const { id, name, dueBy, priority, handleCompletion } = props;
  return (
    <div className="row-properties">
      <div>{name}</div>
      <div>DueBy: {dueBy}</div>
      <div>Priority:{priority}</div>
      {getCheckbox(id, handleCompletion)}
    </div>
  );
}
