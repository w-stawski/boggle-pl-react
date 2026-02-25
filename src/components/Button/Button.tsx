import type { PropsWithChildren } from "react";

interface ButtonProps {
  onClickFn: () => void;
  isDisabled?: boolean;
}

export default function Button({
  children,
  isDisabled,
  onClickFn,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      disabled={isDisabled}
      className={`bg-ui-button rounded-sm shadow-dice p-3 transition-colors duration-200 hover:bg-ui-accent disabled:opacity-50 disabled:pointer-events-none`}
      onClick={onClickFn}
    >
      {children}
    </button>
  );
}
