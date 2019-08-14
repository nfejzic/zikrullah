import React from "react";

//Morpher component
import Morpher from "./components/Morpher";
import { MorpherWithHooks } from "./components/MorpherWithHooks";

import "./assets/style/main.scss";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div id="appendToThisDiv">
          <MorpherWithHooks />
          {/* <Morpher /> */}
        </div>
      </header>
    </div>
  );
}

export default App;
