import React from "react";

export interface EventProps {
  // single event definition
  eventId: number;
  name: string;
  timeStart: string;
  timeEnd: string;
  isEditMode: boolean;
  handleDelete: (eventId: number) => void;
}
function getDeleteButton(isEditMode, handleDelete) {
  // only return delete button when screen is in edit mode
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
  // the single event component
  const { eventId, name, timeStart, timeEnd, isEditMode, handleDelete } = props;

  return (
    // layout component
    // bind handlers to props to display
    <div className="row-properties">
      <div>{name}</div>
      <div>Time Start:{timeStart}</div>
      <div>Time End:{timeEnd}</div>
      {getDeleteButton(isEditMode, () => handleDelete(eventId))}
    </div>
  );
}
