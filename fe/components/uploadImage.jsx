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
    <div className="bg-white rounded-xl shadow-lg p-6 relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center z-10">
          <Loader size="lg" text="Uploading image..." />
        </div>
      )}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Upload className="w-6 h-6" />
        Upload New Image
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Character Name
          </label>
          <input
            type="text"
            placeholder="Enter character name (tom, jerry, dog)"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></input>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Image File
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          ></input>

          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {selectedFile.name} (
              {(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {preview && (
          <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto max-h-48 mx-auto rounded-lg"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile || !uploadName.trim()}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Uploading...
            </>
          ) : (
            "Upload Image"
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadImage;
