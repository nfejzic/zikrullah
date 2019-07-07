import React from "react";
// interpolate function from flubber. Used for interpolayion/morphing between two SVG pahts
// import Flubber from "flubber";
// import { interpolate } from "flubber";
// timeline from just-animate. Used for animation. In this particular case, it's used for playing back SVG interpolation made by flubber
import { timeline, interpolate } from "just-animate";

import "../style/main.scss";
// import { type } from "os";
// import { type } from "os";

let flubber = require("flubber");

class Morpher extends React.Component {
  constructor() {
    super();
    this.state = { svgs: [] };
    this.counter = 0;
  }

  componentDidMount() {
    this.loadSVG();

    // this.setupSVGs(this.state.svgs);
  }

  loadSVG() {
    let svgPlaceholder = [];
    let svgPathsArray = [];

    for (let i = 1; i <= 99; i++) {
      let path = require("../resources/SVG_final/EsmaulHusna/" + i + ".svg");

      svgPathsArray[i - 1] = path;
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
        this.setState({ svgs: svgPlaceholder });
        if (pathsArray.length !== 0) {
          this.getSVGs(pathsArray, svgPlaceholder);
        } else {
          // this.setupSVGs(this.state.svgs);
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
    console.log("Success!");
  }

  morphSVG(fromSVGID, toSVGID) {
    let fromSVG = document.getElementById(fromSVGID);
    let toSVG = document.getElementById(toSVGID);

    let paths = document.getElementsByTagName("path");
    let fromPaths = [];
    let toPaths = [];

    for (let p of paths) {
      let parent = p.parentNode.parentNode;
      if (parent.nodeName === "g") parent = parent.parentNode;
      if (parent.id === fromSVGID) fromPaths.push(p);
      if (parent.id === toSVGID) toPaths.push(p);
    }

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
    let fromSVGID = fromSVG.id;
    let toSVG = this.state.svgs[toSVGindex];
    // let toSVGID = toSVG.id;

    // let paths = document.getElementsByTagName("path");
    let fromNodes = fromSVG.getElementsByTagName("path");
    let toNodes = toSVG.getElementsByTagName("path");

    let fromPaths = [];
    for (let path of fromNodes) fromPaths.push(path);

    let toPaths = [];
    for (let path of toNodes) toPaths.push(path);

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
        // (case1 ? fromPaths : toPaths).push(elemPath);
        // console.log(fromPaths);
        console.log(toPaths[0]);
        if (case1) fromPaths.push(elemPath);
        if (!case1) toPaths.push(elemPath);

        // console.log(elemPath);
      }
    }

    let t1 = timeline();
    let duration = 200; // in miliseconds

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
    let newViewBox = toSVG.getAttribute("viewBox");
    // fromSVG.setAttribute("viewBox", newViewBox);
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
      this.counter === this.state.svgs.length - 1 ? 0 : this.counter + 1;
    console.log(this.counter);
    this.morphSVGElementToArray(container, this.counter);
  }

  render() {
    let stateSVG = this.state.svgs[0];
    const svgHTML = typeof stateSVG !== "undefined" ? stateSVG.outerHTML : "";
    // console.log(svgHTML);

    return (
      <div className="morpher">
        <svg
          id="container"
          className="App-logo"
          xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: svgHTML }}
        ></svg>
        <hr />
        <button id="morph-it" onClick={() => this.morph("container")}>
          Morph It!
        </button>
      </div>
    );
  }
}

export default Morpher;
