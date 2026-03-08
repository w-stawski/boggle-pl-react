import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export default function Modal({
  onCloseFn,
  children,
  closeButtonAltText,
}: PropsWithChildren<{ onCloseFn: () => void; closeButtonAltText?: string }>) {
  const modalRoot = document.getElementById("modal");
  return createPortal(
    <div className="bg-ui-tertiary fixed z-1 mb-10 flex h-full w-full flex-col opacity-95">
      <button
        className="hover:text-ui-accent ml-auto cursor-pointer p-5 text-3xl transition-colors duration-300"
        onClick={onCloseFn}
      >
        {closeButtonAltText ? "" : "Next Round X"}
      </button>
      {children}
    </div>,
    modalRoot,
  );
}
