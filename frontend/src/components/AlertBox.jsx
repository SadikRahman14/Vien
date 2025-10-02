import React from "react";

const AlertBox = ({ 
  text = "Are you sure?", 
  onConfirm, 
  onCancel, 
  confirmText = "Yes", 
  cancelText = "Cancel", 
  show = false 
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className=" bg-black border border-gray-200 rounded-lg shadow-lg w-80 p-6 text-center animate-fadeIn">
        <p className="flex items-center justify-start text-white text-base mb-6">{text}</p>
        
        <div className="flex justify-end gap-4">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-green-600 text-sm rounded-lg border border-gray-300 hover:bg-gray-700"
            >
              {cancelText}
            </button>
          )}
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
