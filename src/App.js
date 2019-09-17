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
          <div id="art-credit">
            <a href="https://www.vexels.com/vectors/preview/255/seamless-vector-pattern-background">
              Seamless Vector Pattern Background
            </a>
            <p>&nbsp; | designed by user_52 </p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
