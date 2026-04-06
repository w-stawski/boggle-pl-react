import { memo, type ReactNode } from "react";
import { cn } from "../../utils/cn";

type ButtonProps = {
  onClick?: () => void;
  onClickFn?: () => void; // Keeping for backward compatibility
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
  "aria-label"?: string;
};

export default memo(function Button({
  children,
  disabled,
  onClick,
  onClickFn,
  className,
  type = "button",
  "aria-label": ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "cursor-pointer transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        className,
      )}
      onClick={onClick || onClickFn}
    >
      {children}
    </button>
  );
});
