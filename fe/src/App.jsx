import { useState } from "react";
import UploadImage from "../components/uploadImage";
import SearchImage from "../components/searchImage";
import MessageAlert from "../components/message";

function App() {
  const [message, setMessage] = useState({ type: "", text: "" });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const URL = "http://localhost:3000";

  const handleUploadSuccess = (characterName) => {
    setMessage({
      type: "success",
      text: `Successfully uploaded image for ${characterName}! Search to see new image.`,
    });

    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSearchSuccess = (characterName) => {
    setMessage({
      type: "success",
      text: `Found image for ${characterName}`,
    });
  };

  const handleError = (errorMessage) => {
    setMessage({
      type: "error",
      text: errorMessage,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent mb-3">
            Image Management System
          </h1>
          <p className="text-gray-300 text-lg">Upload, search, and manage your images effortlessly</p>
        </div>

        <MessageAlert
          message={message}
          onClose={() => setMessage({ type: "", text: "" })}
        ></MessageAlert>

        <div className="space-y-6">
          <SearchImage
            api={URL}
            onSuccess={handleSearchSuccess}
            onError={handleError}
            refreshTrigger={refreshTrigger}
          ></SearchImage>

          <UploadImage
            api={URL}
            onSuccess={handleUploadSuccess}
            onError={handleError}
          ></UploadImage>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-2 border-indigo-700/50 rounded-2xl shadow-2xl backdrop-blur-sm">
          <h3 className="font-bold text-indigo-300 mb-3 text-lg flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Quick Guide
          </h3>
          <ul className="text-sm text-indigo-200 space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-400">1.</span>
              <span>Search for existing images: <span className="font-semibold text-indigo-300">tom</span>, <span className="font-semibold text-indigo-300">jerry</span>, or <span className="font-semibold text-indigo-300">dog</span></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-400">2.</span>
              <span>Upload a new image for any character to replace the existing one</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-indigo-400">3.</span>
              <span>Search again to see the updated image instantly (no server restart needed!)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
