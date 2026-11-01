import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import Button from "./Button";

// Built on the native <dialog>: the browser handles focus trapping,
// dimming the page and the Esc key, so we don't have to.
export default function Modal({ title, onClose, children }) {
  const ref = useRef(null);
  const titleId = useId();

  // Open as a true modal on mount. The check keeps StrictMode's double run harmless.
  // Then focus the field marked data-autofocus, so people can start typing at once.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector("[data-autofocus]")?.focus();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose} // fires when Esc closes the dialog
      onClick={(e) => e.target === e.currentTarget && onClose()} // click on the dimmed backdrop
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg border border-olive bg-card-hover p-0 text-ink shadow-lifted backdrop:bg-black/60"
    >
      <div className="flex items-center justify-between border-b border-line-subtle px-5 py-3">
        <h2 id={titleId} className="text-xl leading-[26px] font-semibold tracking-tight">
          {title}
        </h2>
        <Button variant="ghost" size="icon" icon={X} aria-label="Close dialog" onClick={onClose} />
      </div>
      <div className="p-5">{children}</div>
    </dialog>
  );
}