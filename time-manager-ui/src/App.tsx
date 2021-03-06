//Name: Justin Tan
//Start Date: 07/07/2020
//Last Updated: 08/08/2020
//Description: routing for the app as well as how the whole app is loaded

import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./Login";
import Tasks from "./Tasks";
import Schedule from "./Schedule";

const App = () => {
  // browser URL routing to the different screens
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/tasks" component={Tasks} />
        <Route exact path="/schedule" component={Schedule} />
        <Route exact path="/login" component={Login} />
        <Route exact path="*" component={Tasks} />
      </Switch>
    </BrowserRouter>
  );
};

render(<App />, document.getElementById("app")); //renders the app
