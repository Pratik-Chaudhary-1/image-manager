import UploadImage from "../components/uploadImage";
import SearchImage from "../components/searchImage";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-8">
          Image Management System
        </h1>

        <MessageAlert
          message={message}
          onClose={() => setMessage({ type: "", text: "" })}
        ></MessageAlert>

        <SearchImage
          apiBase={API_BASE}
          onSuccess={handleSearchSuccess}
          onError={handleError}
          refreshTrigger={refreshTrigger}
        ></SearchImage>

        <UploadImage
          api={URL}
          onSuccess={handleUploadSuccess}
          onError={handleError}
        ></UploadImage>

        <div className="mt-6 p-4 bg-blue-50 border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. Search for existing images: tom, jerry, or dog</li>
            <li>2. Upload a new image for any character</li>
            <li>
              3. Search again to see the updated image (no server restart
              needed!)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
