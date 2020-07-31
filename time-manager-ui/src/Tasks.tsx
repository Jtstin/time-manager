import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Task from "./Task";
import Chart from "react-google-charts";
import { NewTask } from "./NewTask";
import { models } from "./models";
import { api } from "./api";
import { mappers } from "./mappers";
import { redirectToLoginWhenTokenNotFound } from "./accessToken";

enum GraphType {
  Bar = "bar",
  Pie = "pie",
}

function getGraph(graphType: GraphType, dayCounts: api.contracts.DayCount[]) {
  const height = 600;
  const width = 600;
  if (graphType === GraphType.Bar) {
    return (
      <Chart
        width={width}
        height={height}
        chartType="ColumnChart"
        loader={<div>Loading Chart</div>}
        data={[["day", "completedTaskCount"], ...dayCounts]}
        options={{
          hAxis: {
            title: "Day of week",
            minValue: 0,
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
      data={[["day", "completedTaskCount"], ...dayCounts]}
      options={{
        hAxis: {
          title: "Day of week",
          minValue: 0,
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
  const [tasks, setTasks] = useState<models.Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<models.Task[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("None");
  const [completedTaskSummary, setCompletedTaskSummary] = useState([]);
  const history = useHistory();

  useEffect(() => {
    redirectToLoginWhenTokenNotFound(history);
    api.getRemainingTasks().then((result) => {
      setTasks(result);
      setFilteredTasks(result);
    });

    api.getCompletedTaskSummary().then((result) => {
      setCompletedTaskSummary(result);
    });
  }, []);

  const handleCompletion = (taskId: number) => {
    const completedTask = tasks.filter((task) => task.id === taskId)[0];
    const remainingTasks = tasks.filter((task) => task.id !== taskId);
    completedTask.completed = Date.now();
    api.saveTask(mappers.toTaskContract(completedTask)).then((response) => {
      if (response.ok) {
        setTasks(remainingTasks);
        setFilteredTasks(remainingTasks);
        api.getCompletedTaskSummary().then((result) => {
          setCompletedTaskSummary(result);
        });
      }
    });
  };

  const handleScheduleButtonClick = () => {
    history.push("/schedule");
  };

  const handleSaveTask = (newTask) => {
    api.saveTask(newTask).then((response) => {
      if (response.status === 200) {
        const newTasks = [...tasks, newTask];
        setTasks(newTasks);
        setFilteredTasks(newTasks);
      }
    });
  };

  const handleChangeGraphType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGraphType(e.currentTarget.value as GraphType);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.currentTarget.value === "High-Low") {
      const sortedTasks = [...tasks].sort(
        (t1, t2) =>
          models.priorityMap[t1.priority] - models.priorityMap[t2.priority]
      );
      setTasks(sortedTasks);
      setFilteredTasks(sortedTasks);
      return;
    }
    const sortedTasks = [...tasks].sort(
      (t1, t2) =>
        models.priorityMap[t2.priority] - models.priorityMap[t1.priority]
    );
    setTasks(sortedTasks);
    setFilteredTasks(sortedTasks);
  };

  const handleSearch = () => {
    let searchResult = tasks.filter(
      (task) => task.name.indexOf(nameFilter) >= 0
    );

    if (priorityFilter !== "None") {
      searchResult = searchResult.filter(
        (task) => task.priority === priorityFilter
      );
    }
    setFilteredTasks(searchResult);
  };

  return (
    <div className="main-container">
      <div className="task-page">
        <div className="task-page-header">
          <button onClick={handleScheduleButtonClick}>Schedule </button>
        </div>
        <div className="task-page-content">
          <div className="task-container">
            <div className="task-header">
              <div className="task-filter">
                <input
                  type="text"
                  placeholder="name"
                  onChange={(e) => setNameFilter(e.target.value)}
                ></input>
                <select
                  onChange={(e) => {
                    setPriorityFilter(e.currentTarget.value);
                  }}
                >
                  <option value="None">None</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button onClick={handleSearch}>Search</button>
              </div>
              <div className="task-sort">
                <div>Sort By: &nbsp; </div>
                <select onChange={handleSort}>
                  <option value="High-Low">High to Low</option>
                  <option value="Low-High">Low to High</option>
                </select>
              </div>
            </div>
            <div className="task-list">
              {filteredTasks.map((task) => (
                <Task
                  key={`tl-${task.id}`}
                  {...task}
                  handleCompletion={handleCompletion}
                ></Task>
              ))}
            </div>
            <NewTask handleSaveTask={handleSaveTask} />
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
              <div className="graph">
                {getGraph(graphType, completedTaskSummary)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
