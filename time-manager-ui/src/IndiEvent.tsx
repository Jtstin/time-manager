import React from "react";

export interface EventProps {
  name: string;
  timeStart: string;
  timeEnd: string;
}

export default function IndiEvent(props: EventProps) {
  return (
    <div className="task-properties">
      <div>{props.name}</div>
      <div>{props.timeStart}</div>
      <div>{props.timeEnd}</div>
    </div>
  );
}
