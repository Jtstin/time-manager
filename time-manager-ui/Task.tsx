import React from "react";

export interface TaskProps {
  name: string;
  dueBy: string;
  priority: string;
}

function Task(props: TaskProps) {
  //const { name, dueBy, priority } = props;
  return (
    <div className="task-properties">
      <div>{props.name}</div>
      <div>DueBy: {props.dueBy}</div>
      <div>Priority: {props.priority}</div>
      <input type="checkbox"></input>
    </div>
  );
}

export default Task;
