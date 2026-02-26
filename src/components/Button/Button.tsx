import { memo, type PropsWithChildren } from "react";

interface ButtonProps {
  onClickFn: () => void;
  isDisabled?: boolean;
  highlighted?: boolean;
}

export default memo(function Button({
  children,
  isDisabled,
  onClickFn,
  highlighted,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      disabled={isDisabled}
      className={`${highlighted ? "bg-ui-tertiary" : "bg-ui-primary"} rounded-sm shadow-dice p-3 transition-colors duration-200 hover:bg-ui-accent disabled:opacity-50 disabled:pointer-events-none`}
      onClick={onClickFn}
    >
      {children}
    </button>
  );
});
