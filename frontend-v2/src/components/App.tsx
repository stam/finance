import React from "react";
import { observer } from "mobx-react-lite";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import viewStore from "../store/View";
import { Home } from "../screens/Home";
import { Transactions } from "../screens/Transactions";

const App: React.FC = observer(() => {
  return (
    <Router>
      <Switch>
        <Route path="/list">
          <Transactions />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      {/* {!viewStore.bootstrapCode && <p>Bootstrapping</p>}
      {viewStore.isAuthenticated ? <p>Logged in!</p> : <p>Not logged in</p>} */}
    </Router>
  );
});

export default App;
