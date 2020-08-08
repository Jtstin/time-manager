import React from "react";
import { TaskModel } from "./TaskModel";

type TaskProps = TaskModel.Task & {
  // taskProps allows for data to be passed into the task component
  handleCompletion?: (taskId: number) => void;
  isEditMode: boolean;
  handleDelete: (eventId: number) => void;
};

function getDeleteButton(isEditMode, handleDelete) {
  if (isEditMode) {
    return (
      <div>
        <button onClick={handleDelete}>
          <i className="material-icons delete-red">delete</i>
        </button>
      </div>
    );
  }
  return null;
}

function getCheckbox(id: number, handleCompletion?: (taskId: number) => void) {
  // returns the checked off task as a completedTask when handleCompletion exists
  if (handleCompletion) {
    return <input type="checkbox" onClick={() => handleCompletion(id)}></input>;
  }
  return null;
}
export default function Task(props: TaskProps) {
  // the task component
  const {
    id,
    name,
    dueBy,
    priority,
    handleCompletion,
    isEditMode,
    handleDelete,
  } = props;
  return (
    // layout component

    <div className="row-properties">
      <div>{name}</div>
      <div>DueBy: {dueBy}</div>
      <div>Priority:{priority}</div>
      {getCheckbox(id, handleCompletion)}
      {getDeleteButton(isEditMode, () => handleDelete(id))}
    </div>
  );
}
