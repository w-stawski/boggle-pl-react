import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  onCloseFn,
  children,
}: PropsWithChildren<{ onCloseFn: () => void }>) {
  const mountNode = document.getElementById("modal");
  return createPortal(
    <div
      onClick={onCloseFn}
      className="fixed w-full h-full z-1 bg-amber-300 opacity-95"
    >
      {children}
    </div>,
    mountNode,
  );
}
