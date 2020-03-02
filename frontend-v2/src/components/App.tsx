import React from "react";
import { observer } from "mobx-react-lite";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import viewStore from "../store/View";
import { Home } from "../screens/Home";
import { Login } from "../screens/Login";
import { Transactions } from "../screens/Transactions";
import { SelectedMonthContext, SelectedMonthStore } from "./MonthSelect";

const App: React.FC = observer(() => {
  if (!viewStore.bootstrapCode) {
    return null;
  }
  if (!viewStore.isAuthenticated) {
    return <Login />;
  }
  return (
    <SelectedMonthContext.Provider value={new SelectedMonthStore()}>
      <Router>
        <Switch>
          <Route path="/list">
            <Transactions />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </SelectedMonthContext.Provider>
  );
});

export default App;
