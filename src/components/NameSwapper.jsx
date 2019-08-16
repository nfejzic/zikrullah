import React from "react";

import "../assets/style/main.scss";

export const NameSwapper = props => {
  const [isReady, setIsReady] = React.useState(false);

  let data = props.data;
  let indexes = props.indexes;
  let counter = indexes[1];
  let duration = props.duration;

  // let prev = indexes[0];

  // let prev = 0;
  // let current = 1;

  let evenSVG = indexes[1] % 2 === 0 ? 1 : 0;

  let oddSVG = indexes[1] % 2 !== 0 ? 1 : 0;

  // console.log("evenSVG: " + evenSVG + " , oddSVG: " + oddSVG);

  if (!isReady) {
    let nameContainer = document.getElementById("name-meaning");
    if (nameContainer && duration) {
      nameContainer.style.transitionDuration = duration + "ms";
      setIsReady(true);
    }
  }

  return (
    <div id="nameContainer">
      <div id="name-meaning">
        <div className={counter % 2 === 0 ? "enter" : "leave"}>
          <p className="EH-name">{data[evenSVG].name}</p>
          <p>{data[evenSVG].meaning}</p>
        </div>
        <div className={counter % 2 === 1 ? "enter" : "leave"}>
          <p className="EH-name">{data[oddSVG].name}</p>
          <p>{data[oddSVG].meaning}</p>
        </div>
      </div>
    </div>
  );
};
