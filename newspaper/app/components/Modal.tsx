import { Portal } from "./Portal";

interface props {
  children?: React.ReactNode;
  isOpen: boolean;
  ariaLabel?: string;
  className?: string;
}

const Modal: React.FC<props> = ({ children, isOpen, ariaLabel, className }) => {
  if (!isOpen) return null;

  return (
    <Portal wrapperId="modal">
      <div
        aria-labelledby={ariaLabel ?? "modal-title"}
        role="dialog"
        aria-modal="true"
      >
        <div className="app-container">{children}</div>
      </div>
    </Portal>
  );
};
export default Modal;
