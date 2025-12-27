import React, { useState } from "react";
import { API_URL } from "../config";

const SmartRegisterModal = ({ onClose, onFill }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setError("");
    }
  };

  const handleScan = async () => {
    if (!file) {
      setError("Please select an ID card image first.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      // Calling the backend endpoint
      const res = await fetch(`${API_URL}/api/ai/scan`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to scan image");

      const data = await res.json();
      
      // Pass data back to EventPass
      onFill(data); 
      onClose(); // Close modal on success
    } catch (err) {
      console.error(err);
      setError("Could not extract data. Please try a clearer image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-gray-900 border border-gray-700 w-full max-w-md p-6 rounded-2xl shadow-2xl animate-fade-in-up">
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>✨</span> AI Smart Fill
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center min-h-[200px] bg-gray-800/50">
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-48 rounded-lg object-contain" />
            ) : (
              <div className="text-center text-gray-500">
                <p className="mb-2 text-2xl">🆔</p>
                <p className="text-sm">Upload College ID / Gov ID</p>
              </div>
            )}
          </div>

          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
          />

          {error && <p className="text-red-400 text-xs text-center font-bold">{error}</p>}

          <button 
            onClick={handleScan} 
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${loading ? 'bg-gray-700 cursor-wait' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02]'}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Scanning...
              </>
            ) : (
              "Scan & Auto-Fill ⚡"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartRegisterModal;