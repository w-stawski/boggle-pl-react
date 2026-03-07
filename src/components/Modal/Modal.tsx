import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  onCloseFn,
  children,
  closeButtonAltText,
}: PropsWithChildren<{ onCloseFn: () => void; closeButtonAltText?: string }>) {
  const modalRoot = document.getElementById("modal");
  return createPortal(
    <div className="fixed flex flex-col w-full h-full z-1 bg-ui-tertiary mb-10 opacity-95">
      <button
        className="p-5 ml-auto text-3xl cursor-pointer hover:text-ui-accent transition-colors duration-300"
        onClick={onCloseFn}
      >
        {closeButtonAltText ? "" : "Next Round X"}
      </button>
      {children}
    </div>,
    modalRoot,
  );
}
