import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Task, { TaskData, Priority } from "./Task";
import Chart from "react-google-charts";

enum GraphType {
  Bar = "bar",
  Pie = "pie",
}

function getGraph(graphType: GraphType) {
  const height = 600;
  const width = 600;
  if (graphType === GraphType.Bar) {
    return (
      <Chart
        width={width}
        height={height}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={[
          ["day", "last week", "this week"],
          ["Mon", 650, 750],
          ["Tue", 550, 570],
          ["Wed", 600, 580],
          ["Thu", 700, 700],
          ["today", 900, 99],
        ]}
        options={{
          hAxis: {
            title: "Day of week",
            minValue: 0,
          },
          vAxis: {
            title: "Order Count",
          },
          legend: {
            position: "bottom",
          },
        }}
      />
    );
  }

  return (
    <Chart
      width={width}
      height={height}
      chartType="PieChart"
      loader={<div>Loading Chart</div>}
      data={[
        ["day", "last week", "this week"],
        ["Mon", 650, 750],
        ["Tue", 550, 570],
        ["Wed", 600, 580],
        ["Thu", 700, 700],
        ["today", 900, 99],
      ]}
      options={{
        hAxis: {
          title: "Day of week",
          minValue: 0,
        },
        vAxis: {
          title: "Order Count",
        },
        legend: {
          position: "bottom",
        },
      }}
    />
  );
}

const Tasks = () => {
  const [graphType, setGraphType] = useState(GraphType.Pie);
  const history = useHistory();
  const tasks: TaskData[] = [
    {
      name: "Task 1",
      dueBy: "00/00/2001",
      priority: Priority.High,
    },
    {
      name: "Task 2",
      dueBy: "00/00/2001",
      priority: Priority.Low,
    },
  ];
  const handleScheduleButtonClick = () => {
    history.push("/schedule");
  };

  const handleChangeGraphType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGraphType(e.currentTarget.value as GraphType);
  };
  return (
    <div className="main-container">
      <div className="task-page">
        <div className="task-page-header">
          <button onClick={handleScheduleButtonClick}>Schedule </button>
        </div>
        <div className="task-page-content">
          <div className="task-container">
            <div className="task-filter">
              <input type="text"></input>
              <select>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button>Search</button>
            </div>
            <div className="task-list">
              {tasks.map((
                task,
                index //transforms each task into their own individual divs to display
              ) => (
                <Task
                  name={task.name}
                  dueBy={task.dueBy}
                  priority={task.priority}
                ></Task>
              ))}
            </div>
            <div className="task-add">
              <input type="text"></input>
              <input type="date"></input>
              <select>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <button>Add</button>
            </div>
          </div>
          <div className="graph-container">
            <div className="graph-header">
              <div></div>
              <div>COMPLETED TASKS</div>
              <select
                value={graphType}
                onChange={handleChangeGraphType}
                className="graph-selector"
              >
                <option>{GraphType.Pie}</option>
                <option>{GraphType.Bar}</option>
              </select>
            </div>
            <div className="graph-section">
              <div className="graph">{getGraph(graphType)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
