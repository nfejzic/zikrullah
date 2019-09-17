import React from "react";
// import SVGMorpher from "svg-morpher";
import SVGMorpher from "../utils/SVGMorpher.js";
import "../assets/style/main.scss";
import { NameSwapper } from "./NameSwapper";

export const MorpherWithHooks = props => {
  let svgJSON = require("../assets/data/esmaul-husna.json").svgs;

  const [svgData, setSvgData] = React.useState(svgJSON);
  const [isLoaded, setLoadState] = React.useState(false);
  const [duration, setDuration] = React.useState(1000);
  const [counter, setCount] = React.useState(0);
  const [isPlaying, setPlaying] = React.useState(false);
  const [isReady, setReady] = React.useState(false);
  // const [movement, setMovement] = React.useState(1);
  // const [lastTime, setLastTime] = React.useState(Date.now());
  const [arraySize, setArraySize] = React.useState(0);

  React.useEffect(() => {
    if (props.duration) setDuration(props.duration);

    setSvgData(svgJSON);
    loadSVG();
  }, []);

  function loadSVG() {
    let svgPathsArray = [];

    for (let i = 0; i < svgData.length; i++) {
      svgPathsArray[i] = require("../assets/resources/SVG_final/EsmaulHusna/" +
        svgData[i].fileNum +
        ".svg");
    }

    getSvgFiles(svgPathsArray);
  }

  function getSvgFiles(pathsArray, svgPlaceholder) {
    if (svgPlaceholder === undefined) svgPlaceholder = [];
    let client = new XMLHttpRequest();

    client.open("GET", pathsArray[0]);
    client.onload = () => {
      pathsArray.shift();

      svgPlaceholder.push(createSVGfromString(client.responseText));

      let index = svgPlaceholder.length - 1;

      let copy = { ...svgData };
      copy[index].svg = svgPlaceholder[index];

      setSvgData(copy);
      setArraySize(Object.keys(svgData).length);

      if (pathsArray.length > 0) getSvgFiles(pathsArray, svgPlaceholder);
      else {
        setLoadState(true);
      }
    };
    client.send();
  }

  function createSVGfromString(string) {
    let div = document.createElement("div");
    div.innerHTML = string.trim();

    return div.getElementsByTagName("svg")[0];
  }

  // Begin the morph!
  function morph(container) {
    setPlaying(true);

    let toSvg = svgData[Math.abs((arraySize + counter) % arraySize)].svg;

    let fromSvg = document.getElementById(container).firstChild;

    SVGMorpher.morphFromTo(fromSvg, toSvg, duration, done => {
      if (done) setPlaying(false);
    });
  }

  if (arraySize > 0 && !isReady) {
    if (svgData[0].svg) {
      let svgToAppend = svgData[0].svg.cloneNode(true);
      let container = document.getElementById("container");
      if (container) container.appendChild(svgToAppend);
      setReady(true);
    }
  }

  document.getElementById("root").onclick = e => {
    if (isPlaying) return;

    let move = e.clientX > document.body.clientWidth / 2 ? +1 : -1;

    let toIndex = counter + 1;
    if (move) toIndex = counter + move;

    let newCount = Math.abs((arraySize + toIndex) % arraySize);
    if (!svgData[newCount].svg) return;

    setCount(newCount);
  };

  React.useEffect(() => {
    if (arraySize) {
      morph("container");
    }
  }, [counter]);

  return (
    <div className="morpher">
      <svg
        id="container"
        className="App-logo"
        xmlns="http://www.w3.org/2000/svg"
      ></svg>

      <NameSwapper index={counter} duration={duration} data={svgData} />
    </div>
  );
};
