import type { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({
  onCloseFn,
  children,
  closeButtonAltText,
}: PropsWithChildren<{ onCloseFn: () => void; closeButtonAltText?: string }>) {
  const modalRoot = document.getElementById("modal");

  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCloseFn}
      />

      {/* Modal Content */}
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-4 border-black bg-[#FFDE00] p-4">
          <h2 className="text-xl font-black text-black uppercase">
            Round Results
          </h2>
          <button
            className="group flex items-center justify-center border-2 border-black bg-white p-1 transition-transform active:scale-90"
            onClick={onCloseFn}
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grow overflow-y-auto p-6 font-mono">{children}</div>

        {/* Modal Footer / Action */}
        <div className="border-t-4 border-black bg-zinc-50 p-4">
          <button
            onClick={onCloseFn}
            className="flex w-full items-center justify-center border-4 border-black bg-[#00FF66] py-3 text-xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:bg-white"
          >
            {closeButtonAltText || "Next Round"}
          </button>
        </div>
      </div>
    </div>,
    modalRoot,
  );
}
