import React, { useState, useEffect, useCallback } from "react";
import { Motion, spring } from "react-motion";
import classNames from "classnames";

const useContextMenu = contextElement => {
  const [xMouse, setXMouse] = useState(0);
  const [yMouse, setYMouse] = useState(0);

  const [showMenu, setShowMenu] = useState(false);

  const handleContextMenu = useCallback(
    e => {
      e.preventDefault();

      const {
        x: contextElementX,
        y: contextElementY,
        width: contextElementWidth,
        height: contextElementHeight
      } = contextElement?.current?.getBoundingClientRect();

      const mouseCursorX = e.pageX;
      const mouseCursorY = e.pageY;

      setXMouse(e.pageX);
      setYMouse(e.pageY);

      if (
        contextElementX + contextElementWidth > mouseCursorX &&
        contextElementX < mouseCursorX &&
        contextElementY + contextElementHeight > mouseCursorY &&
        contextElementY < mouseCursorY
      ) {
        setShowMenu(true);
      } else {
        setShowMenu(false);
      }
    },
    [setXMouse, setYMouse]
  );

  const handleClick = useCallback(() => {
    showMenu && setShowMenu(false);
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.addEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  return { xMouse, yMouse, showMenu };
};

const ContextMenu = ({ children, className, contextElement }) => {
  const { xMouse, yMouse, showMenu } = useContextMenu(contextElement);

  return (
    <Motion
      defaultStyle={{ opacity: 0 }}
      style={{ opacity: !showMenu ? spring(0) : spring(1) }}
    >
      {interpolatedStyle => {
        return (
          <>
            {showMenu && (
              <div
                className={classNames("react-context-menu", className)}
                style={{
                  position: "fixed",
                  top: yMouse,
                  left: xMouse,
                  opacity: interpolatedStyle.opacity
                }}
              >
                {children}
              </div>
            )}
          </>
        );
      }}
    </Motion>
  );
};
export default ContextMenu;
