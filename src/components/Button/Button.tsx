import { memo, type PropsWithChildren } from "react";

interface ButtonProps {
  onClickFn?: () => void;
  className?: string;
  disabled?: boolean;
}

export default memo(function Button({
  children,
  disabled,
  onClickFn,
  className,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      disabled={disabled}
      className={`rounded-sm shadow-dice p-3
        transition-colors duration-200 hover:bg-ui-accent
        cursor-pointer
        disabled:opacity-50 disabled:pointer-events-none ${className}`}
      onClick={onClickFn}
    >
      {children}
    </button>
  );
});
