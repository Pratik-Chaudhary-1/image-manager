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
    <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative overflow-hidden border border-gray-700 hover:shadow-purple-900/50 hover:border-purple-500/50 transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-full -mr-16 -mt-16 opacity-50"></div>
      {loading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-95 rounded-2xl flex items-center justify-center z-10 backdrop-blur-sm">
          <Loader size="lg" text="Searching for image..." />
        </div>
      )}
      <div className="relative z-0">
        <h2 className="text-3xl font-bold text-gray-100 mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Search className="w-6 h-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Search Image
          </span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter character name (tom, jerry, dog)"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-5 py-3 border-2 border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-700 hover:bg-gray-600 text-gray-100 placeholder-gray-400"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 transition-all duration-200 font-semibold flex items-center justify-center gap-2 min-w-[120px] shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Search
              </>
            )}
          </button>
        </div>

        {imageUrl && (
          <div className="mt-6 border-2 border-indigo-600/50 rounded-2xl p-6 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 shadow-inner animate-fade-in">
            <div className="bg-gray-700 rounded-xl p-4 shadow-lg">
              <img
                src={imageUrl}
                alt={searchName}
                className="max-w-full h-auto max-h-96 mx-auto rounded-xl shadow-md object-contain"
                onError={() => {
                  onError("Failed to load image");
                  setImageUrl("");
                }}
              />
            </div>
            <p className="text-center text-indigo-300 mt-4 font-semibold text-lg capitalize">
              ✨ {searchName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchImage;
