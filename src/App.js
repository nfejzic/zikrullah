import React from "react";
// import { interpolate } from "flubber";
// import { timeline } from "just-animate";

//Morpher component
import Morpher from "./components/Morpher";

// Custom SVGs
// import { ReactComponent as AllahCustom } from "./resources/SVG-custom/EH-Artboard 1.svg";
// import { ReactComponent as ArRahmaanCustom } from "./resources/SVG-custom/EH-Artboard 2.svg";
// Custom SVGs with holes as separate paths
import "./style/main.scss";

// function interpolatePoly(from, to) {
//   return interpolate(from, to);
// }

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div id="appendToThisDiv">
          <Morpher />
        </div>
      </header>
    </div>
  );
}

export default App;
