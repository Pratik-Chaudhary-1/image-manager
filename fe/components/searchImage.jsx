import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Loader from "./loader";

const SearchImage = ({ api, onSuccess, onError, refreshTrigger }) => {
  const [searchName, setSearchName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchName.trim()) {
      onError("Please enter a character name");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${api}/api/getImage?name=${searchName}`
      );
      const data = await response.json();

      if (response.ok && data.success && data.imagePath) {
        setImageUrl(`${api}/${data.imagePath}?t=${Date.now()}`);
        onSuccess(searchName);
      } else {
        onError(data.message || "Image not found");
        setImageUrl("");
      }
    } catch (error) {
      onError(
        "Failed to fetch image. Make sure the backend server is running."
      );
      setImageUrl("");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (refreshTrigger > 0 && searchName) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 rounded-xl flex items-center justify-center z-10">
          <Loader size="lg" text="Searching for image..." />
        </div>
      )}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Search className="w-6 h-6" />
        Search Image
      </h2>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter character name (tom, jerry, dog)"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center gap-2 min-w-[100px]"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Searching...
            </>
          ) : (
            "Search"
          )}
        </button>
      </div>

      {imageUrl && (
        <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
          <img
            src={imageUrl}
            alt={searchName}
            className="max-w-full h-auto max-h-96 mx-auto rounded-lg shadow-md"
            onError={() => {
              onError("Failed to load image");
              setImageUrl("");
            }}
          />
          <p className="text-center text-gray-600 mt-3 font-medium">
            Current image: {searchName}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchImage;
