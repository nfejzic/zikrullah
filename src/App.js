import "./assets/style/main.scss";

import React from "react";

// Morpher component
import { MorpherWithHooks } from "./components/MorpherWithHooks";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div id="appendToThisDiv">
          <MorpherWithHooks duration="1000" />
          {/* <Morpher /> */}
        </div>
      </header>
    </div>
  );
}

export default App;
