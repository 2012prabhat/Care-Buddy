import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, title, content }) => {
  // Handle escape key to close the modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white max-w-[80%] min-w-[400px] p-6 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-red-600 hover:text-red-800 focus:outline-none"
        >
          &times;
        </button>
        {/* Modal Content */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="text-gray-600">{content}</div>
      </div>
    </div>
  );
};

export default Modal;
