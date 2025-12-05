import React, { useState } from "react";
import { Upload } from "lucide-react";
import Loader from "./loader";

const UploadImage = ({ api, onSuccess, onError }) => {
  const [uploadName, setUploadName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        onError("Please select a valid image file");
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        onError("File size too large. Maximum size is 5MB.");
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      onError("Please select a file to upload");
      return;
    }

    if (!uploadName.trim()) {
      onError("Please enter a name");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch(`${api}/api/upload?name=${uploadName}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(uploadName);
        setSelectedFile(null);
        setPreview(null);
        setUploadName("");
        document.getElementById("fileInput").value = "";
      } else {
        onError(data.message || "upload failed");
      }
    } catch (err) {
      onError("Failed to upload image. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden border border-gray-700 hover:shadow-green-900/50 hover:border-green-500/50 transition-all duration-300">
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-full -ml-16 -mt-16 opacity-50"></div>
      {loading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-95 rounded-2xl flex items-center justify-center z-10 backdrop-blur-sm">
          <Loader size="lg" text="Uploading image..." />
        </div>
      )}
      <div className="relative z-0">
        <h2 className="text-3xl font-bold text-gray-100 mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Upload New Image
          </span>
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2.5">
              Character Name
            </label>
            <input
              type="text"
              placeholder="Enter character name (tom, jerry, dog)"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              className="w-full px-5 py-3 border-2 border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-700 hover:bg-gray-600 text-gray-100 placeholder-gray-400"
            ></input>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2.5">
              Select Image File
            </label>
            <div className="relative">
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-5 py-3 border-2 border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-gray-700 hover:bg-gray-600 text-gray-100 file:mr-4 file:py-2 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-green-500 file:to-emerald-600 file:text-white hover:file:from-green-400 hover:file:to-emerald-500 file:cursor-pointer file:transition-all file:duration-200 file:shadow-md hover:file:shadow-lg"
              ></input>
            </div>

            {selectedFile && (
              <div className="mt-3 p-3 bg-green-900/30 border border-green-600/50 rounded-lg">
                <p className="text-sm text-green-300 font-medium">
                  <span className="font-semibold">Selected:</span> {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              </div>
            )}
          </div>

          {preview && (
            <div className="border-2 border-green-600/50 rounded-xl p-5 bg-gradient-to-br from-green-900/30 to-emerald-900/30 shadow-inner animate-fade-in">
              <p className="text-sm font-semibold text-green-300 mb-3">Preview:</p>
              <div className="bg-gray-700 rounded-lg p-3 shadow-md">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-auto max-h-48 mx-auto rounded-lg object-contain"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading || !selectedFile || !uploadName.trim()}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:shadow-green-500/50 transform hover:scale-[1.02] disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
