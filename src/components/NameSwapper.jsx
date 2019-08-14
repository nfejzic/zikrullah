import React from "react";

export const NameSwapper = props => {
  const [name, setName] = React.useState(props.name);

  return (
    <div>
      <p>{name}</p>
    </div>
  );
};
