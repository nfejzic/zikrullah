import React from "react";

import "../assets/style/main.scss";
import { read } from "fs";

const NameComponent = props => {
  const [isNew, setNew] = React.useState(true);
  const [id, setId] = React.useState(0);
  const [element, setElement] = React.useState(null);
  const [timer, setTimer] = React.useState(0);

  let placeHolder = document.createElement("p");
  placeHolder.className = "leave";
  placeHolder.innerHTML = "Novo ime!";

  const current = props.current;
  const previous = props.previous;
  const duration = props.duration;

  if (isNew) {
    setId(current);
    setNew(false);
  }

  let pEl = document.createElement("p");
  pEl.addEventListener("transitionend", transition.bind(this, current));
  pEl.id = "the-name";
  pEl.className = "enter";
  pEl.innerHTML = "Ime";

  React.useEffect(initialize, []);

  function initialize() {
    setNew(false);
    let el = document.getElementById("name-meaning");
    setElement(el);
  }

  React.useEffect(setupChild, [element]);

  function setupChild() {
    if (element) element.appendChild(pEl);
  }

  if (id !== current) {
    let el = document.getElementById("the-name");
    el.className = "leave";
    // let test = window.getComputedStyle(el).getPropertyValue("transform")[0];
  }

  function transition(temp) {
    console.log("Prev: " + previous);
    console.log("Curr: " + current);
  }

  React.useEffect(reverseAnim, [id]);

  function reverseAnim() {
    // console.log(id);
    let el = document.getElementById("the-name");
    if (el) {
      el.classList.remove("leave");
      el.className = "enter";
      console.log(el.classList);
    }
  }

  return (
    <div id="nameContainer">
      <div id="name-meaning"></div>
    </div>
  );
};

export default NameComponent;
