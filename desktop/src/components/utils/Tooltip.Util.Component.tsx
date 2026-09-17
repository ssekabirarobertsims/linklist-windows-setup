import React, { type ReactNode } from "react";
import "../../stylesheets/Components/Reusable.Components.Stylesheet.css";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: TooltipPosition;
  disabled?: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = "top",
  disabled = false,
}) => {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div className={`tooltip-wrapper tooltip-${position}`}>
      {children}

      <span className="tooltip-content" role="tooltip">
        {/* <article className="tooltip-arrow"></article> */}
        {content}
      </span>
    </div>
  );
};

export default Tooltip;
