import React from "react";

import "../assets/style/main.scss";
import { setTimeout } from "timers";

export const NameSwapper = props => {
  const [isReady, setIsReady] = React.useState(false);
  const [isNew, setNew] = React.useState(true);
  const [indexes, setIndexes] = React.useState([]);
  const [nameContainer, setContainer] = React.useState(null);
  const [previous, setPrevious] = React.useState(0);

  // let { data, counter, indexes, duration } = props;

  let { index, duration, data } = props;

  // create <div> with <p> tags with wanted values. In this case, Transcription
  // of name and meaning
  function createTextElement() {
    // create div and child p elements
    let pName = document.createElement("p");
    let pMeaning = document.createElement("p");
    let div = document.createElement("div");

    // populate p elements with values
    pName.innerHTML = data[current].name;
    pMeaning.innerHTML = data[current].meaning;

    // assign custom styling to one of elements ( name is accentuated with some
    // color )
    pName.className = "EH-name";

    // assign initial style to div, hidden and a little lower... used for
    // transition effect
    div.className = "leave";
    div.addEventListener("transitionend", removeSelf);

    // append p elements to div and return the created element
    div.appendChild(pName);
    div.appendChild(pMeaning);

    return div;
  }

  // remove element when it's meant to "leave" and be hidden. It has no use
  // anymore
  function removeSelf(event) {
    let parent = event.target.parentNode;
    let child = event.target;

    // This is called on transition end. But execute removal ONLY if element
    // "left" the scene!
    if (child.className === "leave") {
      if (parent && child) parent.removeChild(child);
    }
  }

  function addNewElement(container) {
    let newEl = createTextElement();
    container.appendChild(newEl);
    // This is a temporary fix for iOS13. requestAnimationFrame is not working correctly in iOS13.
    setTimeout(() => (newEl.className = "enter"), 1);
    // window.requestAnimationFrame(() => (newEl.className = "enter"));
  }

  let curr = indexes[indexes.length === 0 ? 0 : indexes.length - 1];
  let current = curr;
  if (curr !== index) {
    setPrevious(curr);
    let newIndexes = [...indexes];
    newIndexes[newIndexes.length] = index;
    setIndexes(newIndexes);
  }

  React.useEffect(update, [indexes]);

  if (!isReady) {
    let container = document.getElementById("name-meaning");
    if (container && duration) {
      setContainer(container);
      container.style.transitionDuration = duration + "ms";
      if (isNew) {
        initialize(container);
      }
      setIsReady(true);
    }
  }

  function initialize(nameContainer) {
    let p1 = document.createElement("p");
    p1.className = "leave";
    p1.innerHTML = "Current : " + current;
    let p2 = document.createElement("p");
    p2.innerHTML = "Previous : " + previous;
    if (nameContainer) {
      addNewElement(nameContainer);
    }
    setNew(false);
  }

  function update() {
    // console.log("Prev: " + previous);
    // console.log("Curr: " + current);
    if (nameContainer) {
      let el = nameContainer.childNodes[0];
      el.className = "leave";
      addNewElement(nameContainer);
    }
  }

  return (
    <div id="nameContainer">
      <div id="name-meaning"></div>
    </div>
  );
};
