import React from "react";
import { observer } from "mobx-react-lite";
// import viewStore from "../store/View";
import { Home } from "../screens/Home";

const App: React.FC = observer(() => {
  return (
    <div className="App">
      <Home />
      {/* {!viewStore.bootstrapCode && <p>Bootstrapping</p>}
      {viewStore.isAuthenticated ? <p>Logged in!</p> : <p>Not logged in</p>} */}
    </div>
  );
});

export default App;
