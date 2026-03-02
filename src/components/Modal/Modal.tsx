import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  onCloseFn,
  children,
  closeButtonAltText: closeButtonText,
}: PropsWithChildren<{ onCloseFn: () => void; closeButtonAltText?: string }>) {
  const modalRoot = document.getElementById("modal");
  return createPortal(
    <div className="fixed w-full h-full z-1 bg-ui-tertiary opacity-95">
      <button
        className="absolute right-0 p-7 text-3xl cursor-pointer hover:text-ui-accent transition-colors duration-300"
        onClick={onCloseFn}
      >
        {closeButtonText ?? "X"}
      </button>
      {children}
    </div>,
    modalRoot,
  );
}
