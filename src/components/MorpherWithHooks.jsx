import React from "react";
import { timeline, interpolate } from "just-animate";
import "../assets/style/main.scss";
import { NameSwapper } from "./NameSwapper";
let flubber = require("flubber");
// import { flubber } from "flubber";

export const MorpherWithHooks = props => {
  let svgJSON = require("../assets/data/esmaul-husna.json").svgs;

  const [svgData, setSvgData] = React.useState(svgJSON);
  const [isLoaded, setLoadState] = React.useState(false);
  const [duration, setDuration] = React.useState(1000);
  const [counter, setCount] = React.useState(0);
  const [isPlaying, setPlaying] = React.useState(false);
  const [isReady, setReady] = React.useState(false);
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

  function morphSVGElementToArray(parentElement, toSVGindex) {
    let container = document.getElementById(parentElement);
    let fromSVG = container.firstChild;
    let toSVG = svgData[toSVGindex].svg;

    let fromPaths = Array.from(fromSVG.getElementsByTagName("path"));
    let toPaths = Array.from(toSVG.getElementsByTagName("path"));

    equalizeNumOfPaths(
      { parentSVG: fromSVG, paths: fromPaths },
      { parentSVG: toSVG, paths: toPaths }
    );

    //sort the paths here, from smallest to largest!
    // fromPaths.sort((a, b) => sortString(a, b));
    // toPaths.sort((a, b) => sortString(a, b));

    animatePaths(
      { parentSVG: fromSVG, paths: fromPaths },
      { parentSVG: toSVG, paths: toPaths },
      duration
    );
  }

  function animatePaths(from, to, duration) {
    let fromPaths = from.paths;
    let fromSVG = from.parentSVG;

    // set to stroke at the beginning of the animation!
    fromSVG.classList.remove("fill");
    fromSVG.classList.add("stroke");

    let toPaths = to.paths;
    let toSVG = to.parentSVG;

    let fromSVGID = fromSVG.id;
    let t1 = timeline();

    for (let i = 0; i < fromPaths.length; i++) {
      let fromPathID = (fromPaths[i].id = fromSVGID + "Path" + i);

      let fromD = fromPaths[i].getAttribute("d");
      let toD = toPaths[i].getAttribute("d");

      let target = "#" + fromPathID;

      t1.fromTo(0, duration, {
        targets: target,
        duration: duration,
        props: {
          d: {
            value: [fromD, toD],
            interpolate: flubber.interpolate
          }
        }
      });

      t1.play();
    }

    //animate viewbox of the SVG
    let newViewBox = toSVG.getAttribute("viewBox");
    let t2 = timeline();
    t2.animate({
      targets: fromSVG,
      duration: duration,
      props: {
        viewBox: {
          value: [fromSVG.getAttribute("viewBox"), newViewBox],
          interpolate: interpolateViewBox
        }
      }
    });
    t2.play().on("finish", () => {
      setPlaying(false);
      fromSVG.classList.remove("stroke");
      fromSVG.classList.add("fill");
      // console.log("Juhuuu!");
    });
  }

  function equalizeNumOfPaths(from, to) {
    let fromSVG = from.parentSVG;
    let toSVG = to.parentSVG;
    let fromPaths = from.paths;
    let toPaths = to.paths;

    if (fromPaths.length - toPaths.length !== 0) {
      let case1 = fromPaths.length < toPaths.length;
      let case2 = fromPaths.length > toPaths.length;
      let diff = case1
        ? toPaths.length - fromPaths.length
        : case2
        ? fromPaths.length - toPaths.length
        : 0;
      for (let i = 0; i < diff; i++) {
        let elemPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        let copyPath = case1
          ? fromPaths[fromPaths.length - 1]
          : toPaths[toPaths.length - 1];
        elemPath.setAttributeNS(null, "d", copyPath.getAttribute("d"));
        if (case1) {
          fromSVG.getElementsByTagName("g")[0].appendChild(elemPath);
          fromPaths.push(elemPath);
        } else {
          toSVG.getElementsByTagName("g")[0].appendChild(elemPath);
          toPaths.push(elemPath);
        }
      }
    }
  }

  function sortString(a, b) {
    let aPath = a.getAttribute("d");
    let bPath = b.getAttribute("d");

    return bPath.length - aPath.length;
  }

  function interpolateViewBox(left, right) {
    const leftVal = left.split(" ").map(s => +s);
    const rightVal = right.split(" ").map(s => +s);

    return offset => {
      return leftVal
        .map((l, i) => interpolate(l, rightVal[i], offset))
        .join(" ");
    };
  }
  // Begin the morph!
  function morph(container) {
    if (isPlaying) return;

    let toIndex = (counter + 1) % arraySize;
    setCount(toIndex);
    setPlaying(true);
    morphSVGElementToArray(container, toIndex);

    // setLastTime(Date.now());
  }

  if (arraySize > 0 && !isReady) {
    if (svgData[0].svg) {
      let container = document.getElementById("container");
      if (container) container.appendChild(svgData[0].svg);
      setReady(true);
      console.log("DONE!");
    }
  }

  document.getElementById("root").onclick = () => {
    morph("container");
  };

  let prevIndex = 0;
  let nextIndex = 0;

  if (arraySize) {
    prevIndex = counter - 1 < 0 ? arraySize - 1 : counter - 1;
    nextIndex = (counter + 1) % arraySize;
  }

  return (
    <div className="morpher">
      <svg
        id="container"
        className="App-logo"
        xmlns="http://www.w3.org/2000/svg"
      ></svg>

      <NameSwapper
        data={[svgData[prevIndex], svgData[counter], svgData[nextIndex]]}
        indexes={[prevIndex, counter, nextIndex]}
        duration={duration}
      />
    </div>
  );
};
