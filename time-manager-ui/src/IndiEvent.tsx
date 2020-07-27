import React from "react";

export interface EventProps {
  name: string;
  timeStart: string;
  timeEnd: string;
  isEditMode: boolean;
}
function getDeleteButton(isEditMode) {
  if (isEditMode) {
    return (
      <div>
        <button>
          <i className="material-icons delete-red">delete</i>
        </button>
      </div>
    );
  }
  return null;
}

export default function IndiEvent(props: EventProps) {
  const { name, timeStart, timeEnd, isEditMode } = props;

  return (
    <div className="task-properties">
      <div>{name}</div>
      <div>{timeStart}</div>
      <div>{timeEnd}</div>
      {getDeleteButton(isEditMode)}
    </div>
  );
}
