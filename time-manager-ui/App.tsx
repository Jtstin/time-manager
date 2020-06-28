import React from "react";
import { render } from "react-dom";
import Login from "./Login";
import Tasks from "./Tasks";

const App = () => {
  // return (
  //   <div className="container">
  //     <Login />
  //   </div>
  // );
  return <Tasks />;
};

render(<App />, document.getElementById("app"));
