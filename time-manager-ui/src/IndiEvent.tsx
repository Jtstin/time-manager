import React from "react";

export interface EventProps {
  eventId: number;
  name: string;
  timeStart: string;
  timeEnd: string;
  isEditMode: boolean;
  handleDelete: (eventId: number) => void;
}
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

export default function IndiEvent(props: EventProps) {
  const { eventId, name, timeStart, timeEnd, isEditMode, handleDelete } = props;

  return (
    <div className="task-properties">
      <div>{name}</div>
      <div>{timeStart}</div>
      <div>{timeEnd}</div>
      {getDeleteButton(isEditMode, () => handleDelete(eventId))}
    </div>
  );
}
