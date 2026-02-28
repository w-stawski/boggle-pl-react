import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  onCloseFn,
  children,
}: PropsWithChildren<{ onCloseFn: () => void }>) {
  const mountNode = document.getElementById("modal");
  return createPortal(
    <div className="fixed w-full h-full z-1 bg-ui-tertiary opacity-95">
      <button
        className="absolute right-0 p-7 text-3xl cursor-pointer"
        onClick={onCloseFn}
      >
        X
      </button>
      {children}
    </div>,
    mountNode,
  );
}
