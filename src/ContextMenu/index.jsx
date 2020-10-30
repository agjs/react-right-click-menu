import React, { useState, useEffect, useCallback } from "react";
import { Motion, spring } from "react-motion";
import classNames from "classnames";

const upTo = (el, className) => {
  className = className?.toLowerCase();

  while (el && el.parentNode) {
    el = el.parentNode;
    if (el?.className && el?.className?.toLowerCase() == className) {
      return el;
    }
  }

  return null;
};

const CONTEXT_MENU_CLASS_NAME = "react-right-click-menu";

/**
 * 1. Prevent Menu from going offscreen if the context menu is invoked
 * where the context element is bigger then the remaining size on
 * either of the sides of the screen.
 */

const useContextMenu = (contextElement, hideMenuOnClick) => {
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

      const isWithinBoundary =
        contextElementX + contextElementWidth > mouseCursorX &&
        contextElementX < mouseCursorX &&
        contextElementY + contextElementHeight > mouseCursorY &&
        contextElementY < mouseCursorY;

      isWithinBoundary ? setShowMenu(true) : setShowMenu(false);
    },
    [setXMouse, setYMouse]
  );

  const handleClick = useCallback(
    event => {
      if (hideMenuOnClick || !upTo(event.target, "react-right-click-menu")) {
        showMenu && setShowMenu(false);
      }
    },
    [showMenu]
  );

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

const ContextMenu = ({
  children,
  className,
  hideMenuOnClick,
  contextElement
}) => {
  const { xMouse, yMouse, showMenu } = useContextMenu(
    contextElement,
    hideMenuOnClick
  );

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
                className={classNames(CONTEXT_MENU_CLASS_NAME, className)}
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
