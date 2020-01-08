import React from "react";
import { observer } from "mobx-react-lite";
import viewStore from "./store/View";

const App: React.FC = observer(() => {
  console.log("b", viewStore.bootstrapCode);
  return (
    <div className="App">
      <header className="App-header">
        <p>Frontend v2</p>
        {!viewStore.bootstrapCode && <p>Bootstrapping</p>}
        {viewStore.isAuthenticated ? <p>Logged in!</p> : <p>Not logged in</p>}
      </header>
    </div>
  );
});

export default App;
