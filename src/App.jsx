import React, { useState } from "react";
import axios from "axios";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedInput = JSON.parse(jsonInput);

      const response = await axios.post(
        "http://localhost:5000/bfhl",
        parsedInput
      );
      setResponseData(response.data);
      setError("");
    } catch (err) {
      setError("Invalid JSON input or API error");
      setResponseData(null);
    }
  };

  const handleSelectionChange = (e) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedOptions(options);
  };

  const renderResponse = () => {
    if (!responseData) return null;
    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;

    return (
      <div>
        {selectedOptions.includes("Numbers") && (
          <div>
            <strong>Numbers:</strong> {JSON.stringify(numbers)}
          </div>
        )}
        {selectedOptions.includes("Alphabets") && (
          <div>
            <strong>Alphabets:</strong> {JSON.stringify(alphabets)}
          </div>
        )}
        {selectedOptions.includes("Highest lowercase alphabet") && (
          <div>
            <strong>Highest lowercase alphabet:</strong>{" "}
            {JSON.stringify(highest_lowercase_alphabet)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <textarea
          rows="10"
          cols="50"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter your JSON here"
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {responseData && (
        <>
          <label>Filter options:</label>
          <select multiple onChange={handleSelectionChange}>
            <option value="Numbers">Numbers</option>
            <option value="Alphabets">Alphabets</option>
            <option value="Highest lowercase alphabet">
              Highest lowercase alphabet
            </option>
          </select>

          {renderResponse()}
        </>
      )}
    </div>
  );
}

export default App;
