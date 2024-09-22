import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedInput = JSON.parse(jsonInput);

      const response = await axios.post(
        "https://api-backend-zeta-three.vercel.app/bfhl",
        parsedInput
      );
      setResponseData(response.data);
      setError("");
    } catch (err) {
      setError("Invalid JSON input or API error");
      setResponseData(null);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionChange = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderResponse = () => {
    if (!responseData) return null;
    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;

    return (
      <div className="response-container">
        {selectedOptions.includes("Numbers") && (
          <div className="response-section">
            <h3>Numbers:</h3>
            <pre>{numbers.join(", ")}</pre>
          </div>
        )}
        {selectedOptions.includes("Alphabets") && (
          <div className="response-section">
            <h3>Alphabets:</h3>
            <pre>{alphabets.join(", ")}</pre>
          </div>
        )}
        {selectedOptions.includes("Highest lowercase alphabet") && (
          <div className="response-section">
            <h3>Highest Lowercase Alphabet:</h3>
            <pre>{highest_lowercase_alphabet.join(", ")}</pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <div className="content-container">
          <form onSubmit={handleSubmit} className="input-form">
            <label htmlFor="jsonInput">API Input:</label>
            <textarea
              id="jsonInput"
              rows="10"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder='e.g., { "key": "value" }'
              required
            />
            <button type="submit" className="submit-button">
              Submit
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>

          {responseData && (
            <div className="results-section">
              <div className="filter-dropdown" ref={dropdownRef}>
                <label className="filter-label">Multi Filter:</label>
                <div className="dropdown-header" onClick={toggleDropdown}>
                  <div className="selected-options">
                    {selectedOptions.length > 0
                      ? selectedOptions.join(", ")
                      : "Select options"}
                  </div>
                  <div
                    className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
                  ></div>
                </div>
                {isDropdownOpen && (
                  <div className="dropdown-list">
                    <label className="dropdown-item">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes("Numbers")}
                        onChange={() => handleOptionChange("Numbers")}
                      />
                      Numbers
                    </label>
                    <label className="dropdown-item">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes("Alphabets")}
                        onChange={() => handleOptionChange("Alphabets")}
                      />
                      Alphabets
                    </label>
                    <label className="dropdown-item">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(
                          "Highest lowercase alphabet"
                        )}
                        onChange={() =>
                          handleOptionChange("Highest lowercase alphabet")
                        }
                      />
                      Highest Lowercase Alphabet
                    </label>
                  </div>
                )}
              </div>

              {renderResponse()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
