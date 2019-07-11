import React from "react";

// timeline from just-animate. Used for animation. In this particular case, it's used for playing back SVG interpolation made by flubber
import { timeline, interpolate } from "just-animate";

import "../assets/style/main.scss";

// import Flubber, library used for SVG Morphing animation / interpolation
let flubber = require("flubber");

class Morpher extends React.Component {
  constructor() {
    super();
    let svgJSON = require("../assets/data/esmaul-husna.json").svgs;

    this.state = { svgData: [] };
    for (let data of svgJSON) {
      this.state.svgData.push(data);
    }

    // this.state = { svgs: [], svgData: [] };
    this.counter = 0;

    // @TODO implement this.state as objects.
    // Objects should have following values:
    // 1. SVG - loaded SVG file
    // 2. Name - Transcription of arabic name
    // 3. Meaning - The meaning of the arabic name
  }

  componentDidMount() {
    this.loadSVG();
  }

  loadSVG() {
    let svgPlaceholder = [];
    let svgPathsArray = [];

    // Load array of svg objects from JSON file
    let svgData = require("../assets/data/esmaul-husna.json").svgs;

    //store paths into a paths array - this is used to load all the svgs
    for (let i = 0; i < 99; i++) {
      //insert fileName into path. File name is stored as fileNum property in JSON
      let path = require("../assets/resources/SVG_final/EsmaulHusna/" +
        svgData[i].fileNum +
        ".svg");

      svgPathsArray[i] = path;
    }

    this.getSVGs(svgPathsArray, svgPlaceholder);
  }

  getSVGs(pathsArray, svgPlaceholder) {
    let client = new XMLHttpRequest();
    if (typeof svgPlaceholder !== "undefined") {
      client.open("GET", pathsArray[0]);
      client.onload = () => {
        pathsArray.shift();
        svgPlaceholder.push(this.createSVGfromString(client.responseText));

        let index = svgPlaceholder.length - 1;

        //copy the state
        let stateCopy = { ...this.state.svgData };

        //copy the item to modify
        let dataItem = stateCopy[index];

        //add SVG to dataItem
        dataItem.svg = svgPlaceholder[index];

        //add SVG item to copy of State, and then set the State to the new item
        stateCopy[index] = dataItem;
        this.setState(stateCopy);

        // this.setState({ svgs: svgPlaceholder });
        if (pathsArray.length !== 0) {
          this.getSVGs(pathsArray, svgPlaceholder);
        }
      };
      client.send();
    }
  }

  createSVGfromString(string) {
    let div = document.createElement("div");
    div.innerHTML = string.trim();

    return div.firstChild;
  }

  setupSVGs(svgArray) {
    for (let i = 0; i < svgArray.length; i++) {
      svgArray[i].setAttribute("id", "EH-" + (i + 1));
    }
    this.setState(svgArray);
  }

  morphSVG(fromSVGID, toSVGID) {
    let fromSVG = document.getElementById(fromSVGID);
    let toSVG = document.getElementById(toSVGID);

    let fromPaths = Array.from(fromSVG.getElementsByTagName("path"));
    let toPaths = Array.from(toSVG.getElementsByTagName("path"));

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
        if (case1) fromSVG.getElementsByTagName("g")[0].appendChild(elemPath);
        if (case2) toSVG.getElementsByTagName("g")[0].appendChild(elemPath);
        // fromSVG.appendChild(elemPath);
        (case1 ? fromPaths : toPaths).push(elemPath);

        // console.log(elemPath);
      }
    }

    let t1 = timeline();

    for (let i = 0; i < fromPaths.length; i++) {
      let fromPathID = (fromPaths[i].id = fromSVGID + "Path" + i);

      let fromD = fromPaths[i].getAttribute("d");
      let toD = toPaths[i].getAttribute("d");

      let target = "#" + fromPathID;

      t1.fromTo(0, 500, {
        targets: target,
        props: {
          d: {
            value: [fromD, toD],
            interpolate: flubber.interpolate
          }
        }
      });
      t1.play({ alternate: true, repeat: 2 });
    }
  }

  morphSVGElementToArray(parentElement, toSVGindex) {
    let container = document.getElementById(parentElement);
    let fromSVG = container.firstChild;
    let toSVG = this.state.svgData[toSVGindex].svg;

    let fromPaths = Array.from(fromSVG.getElementsByTagName("path"));
    let toPaths = Array.from(toSVG.getElementsByTagName("path"));

    this.equalizeNumOfPaths(
      { parentSVG: fromSVG, paths: fromPaths },
      { parentSVG: toSVG, paths: toPaths }
    );

    //sort the paths here, from smallest to largest!
    // fromPaths.sort((a, b) => this.sortString(a, b));
    // toPaths.sort((a, b) => this.sortString(a, b));

    this.animatePaths(
      { parentSVG: fromSVG, paths: fromPaths },
      { parentSVG: toSVG, paths: toPaths },
      2000
    );
  }

  animatePaths(from, to, duration) {
    let fromPaths = from.paths;
    let fromSVG = from.parentSVG;

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
          interpolate: this.interpolateViewBox
        }
      }
    });
    t2.play();
  }

  equalizeNumOfPaths(from, to) {
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

  sortString(a, b) {
    let aPath = a.getAttribute("d");
    let bPath = b.getAttribute("d");

    return bPath.length - aPath.length;
  }

  interpolateViewBox(left, right) {
    const leftVal = left.split(" ").map(s => +s);
    const rightVal = right.split(" ").map(s => +s);

    return offset => {
      return leftVal
        .map((l, i) => interpolate(l, rightVal[i], offset))
        .join(" ");
    };
  }

  morph(container) {
    this.counter =
      this.counter === this.state.svgData.length - 1 ? 0 : this.counter + 1;
    this.morphSVGElementToArray(container, this.counter);
    this.forceUpdate();
  }

  render() {
    let stateSVG = this.state.svgData[0].svg;
    const svgHTML = typeof stateSVG !== "undefined" ? stateSVG.outerHTML : "";

    document.body.onclick = () => this.morph("container");

    return (
      <div className="morpher">
        <svg
          id="container"
          className="App-logo"
          xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: svgHTML }}
        ></svg>
        <p>
          {this.counter} |{this.state.svgData[this.counter].name}:{" "}
          {this.state.svgData[this.counter].meaning}
        </p>
      </div>
    );
  }
}

export default Morpher;
