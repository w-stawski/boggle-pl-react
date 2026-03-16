import { type PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

/**
 * Modern React Modal implementation using the native <dialog> element.
 * Handles focus trapping, escape key closing, and accessibility out-of-the-box.
 */
export default function Modal({
  onCloseFn,
  children,
  closeButtonAltText,
  title = "Round Results",
}: PropsWithChildren<{
  onCloseFn: () => void;
  closeButtonAltText?: string;
  title?: string;
}>) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const modalRoot = document.getElementById("modal");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Open as modal to enable backdrop and focus trapping
    dialog.showModal();

    // Prevent scrolling of the body when modal is open
    document.body.style.overflow = "hidden";

    // Handle the 'cancel' event (Escape key) to ensure our state stays in sync
    const handleCancel = (e: Event) => {
      e.preventDefault();
      onCloseFn();
    };

    dialog.addEventListener("cancel", handleCancel);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      document.body.style.overflow = "";
      dialog.close();
    };
  }, [onCloseFn]);

  if (!modalRoot) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="fixed ml-3 inset-0 z-100 flex h-screen w-screen items-center justify-center bg-transparent p-4 outline-none backdrop:bg-black/40 backdrop:backdrop-blur-sm sm:p-6"
      aria-labelledby="modal-title"
    >
      {/* Modal Content Container */}
      <div className="relative mx-auto flex max-h-[90vh] w-full max-w-xl flex-col border-4 border-black bg-white shadow-[12px_12px_0_0_#000]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-4 border-black bg-[#FFDE00] p-4">
          <h2
            id="modal-title"
            className="text-xl font-black text-black uppercase mx-auto"
          >
            {title}
          </h2>
          <button
            className="group flex items-center justify-center border-2 border-black bg-white p-1 transition-transform active:scale-90"
            onClick={onCloseFn}
            aria-label="Close modal"
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
            className="flex w-full items-center justify-center border-4 border-black bg-[#00FF66] py-3 text-xl font-black uppercase shadow-[4px_4px_0_0_#000] cursor-pointer transition-all hover:translate-1 hover:shadow-none active:bg-white"
          >
            {closeButtonAltText || "Next Round"}
          </button>
        </div>
      </div>
    </dialog>,
    modalRoot,
  );
}
