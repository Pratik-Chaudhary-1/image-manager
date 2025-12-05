import React from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const MessageAlert = ({ message, onClose }) => {
  if (!message.text) return null;

  return (
    <div
      className={`mb-6 p-4 sm:p-5 rounded-xl flex items-center gap-3 shadow-lg animate-fade-in border-2 ${
        message.type === "success"
          ? "bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-200 border-green-600/50"
          : "bg-gradient-to-r from-red-900/50 to-rose-900/50 text-red-200 border-red-600/50"
      }`}
    >
      <div className={`flex-shrink-0 p-2 rounded-lg ${
        message.type === "success"
          ? "bg-green-700/50"
          : "bg-red-700/50"
      }`}>
        {message.type === "success" ? (
          <CheckCircle className="w-5 h-5 text-green-300" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-300" />
        )}
      </div>
      <span className="flex-1 font-medium">{message.text}</span>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 hover:bg-white hover:bg-opacity-10 rounded-lg transition-all duration-200 text-gray-300 hover:text-white"
        aria-label="Close message"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default MessageAlert;
