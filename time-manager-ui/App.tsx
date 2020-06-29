import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./Login";
import Tasks from "./Tasks";
import Schedule from "./Schedule";

const App = () => {
  return (
    <BrowserRouter>
      <Route exact path="/tasks" component={Tasks} />
      <Route exact path="/schedule" component={Schedule} />
      <Route exact path="" compononet={Tasks} />
    </BrowserRouter>
  );
};

render(<App />, document.getElementById("app"));
