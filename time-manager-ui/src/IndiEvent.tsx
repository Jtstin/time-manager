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
    <div className="row-properties">
      <div>{name}</div>
      <div>Time Start:{timeStart}</div>
      <div>Time End:{timeEnd}</div>
      {getDeleteButton(isEditMode, () => handleDelete(eventId))}
    </div>
  );
}
