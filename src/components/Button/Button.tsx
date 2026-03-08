import { memo, type PropsWithChildren } from "react";

type ButtonProps = {
  onClickFn?: () => void;
  className?: string;
  disabled?: boolean;
};

export default memo(function Button({
  children,
  disabled,
  onClickFn,
  className,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      disabled={disabled}
      className={`shadow-dice hover:bg-ui-accent cursor-pointer rounded-sm p-3 transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 ${className}`}
      onClick={onClickFn}
    >
      {children}
    </button>
  );
});
