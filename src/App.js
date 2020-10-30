import React, { useEffect, useRef } from "react";
import "./style.css";

import ContextMenu from "./ContextMenu";
const items = [
  { id: 1, title: "Lorem 1" },
  { id: 2, title: "Lorem 2" },
  { id: 3, title: "Lorem 3" }
];
const App = () => {
  const ref = useRef();
  return (
    <div>
      <ContextMenu hideMenuOnClick={false} contextElement={ref}>
        <ul>
          {items.map(li => (
            <li onClick={() => console.log("clicked")} key={li.id}>
              <span>{li.title}</span>
            </li>
          ))}
        </ul>
      </ContextMenu>

      <div ref={ref} className="boundary">
        <h1>Boundary</h1>
      </div>
    </div>
  );
};

export default App;
