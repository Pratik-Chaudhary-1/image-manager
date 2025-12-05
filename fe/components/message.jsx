import React from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const MessageAlert = ({ message, onClose }) => {
  if (!message.text) return null;

  return (
    <div
      className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
        message.type === "success"
          ? "bg-green-100 text-green-800 border border-green-300"
          : "bg-red-100 text-red-800 border border-red-300"
      }`}
    >
      {message.type === "success" ? (
        <CheckCircle className="w-5 h-5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
      )}
      <span className="flex-1">{message.text}</span>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Close message"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MessageAlert;
