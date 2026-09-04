import { useState } from "react";

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

function PredictionForm({ onResult }) {
  const [district, setDistrict] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [waterLevel, setWaterLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!district || rainfall === "" || waterLevel === "") {
      setError("Please complete all fields before checking the risk.");
      return;
    }

    if (Number(rainfall) < 0 || Number(waterLevel) < 0) {
      setError("Rainfall and water level cannot be negative.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          district,
          rainfall: Number(rainfall),
          water_level: Number(waterLevel),
        }),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();

      onResult({
        ...data,
        rainfall: Number(rainfall),
        water_level: Number(waterLevel),
      });
    } catch (err) {
      setError(
        "Unable to connect to the risk prediction service. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDistrict("");
    setRainfall("");
    setWaterLevel("");
    setError("");
    onResult(null);
  };

  return (
    <form className="prediction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="district">District</label>

        <select
          id="district"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          <option value="">Select your district</option>

          {districts.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="rainfall">Rainfall</label>

          <div className="input-wrapper">
            <input
              id="rainfall"
              type="number"
              min="0"
              step="0.1"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              placeholder="100"
            />

            <span>mm</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="waterLevel">Water Level</label>

          <div className="input-wrapper">
            <input
              id="waterLevel"
              type="number"
              min="0"
              step="0.1"
              value={waterLevel}
              onChange={(e) => setWaterLevel(e.target.value)}
              placeholder="4"
            />

            <span>m</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="button-row">
        <button
          className="check-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Analyzing Risk..." : "Check Disaster Risk"}
        </button>

        <button
          className="reset-button"
          type="button"
          onClick={resetForm}
        >
          Reset
        </button>
      </div>

      <p className="form-note">
        Prototype assessment based on the information provided.
        Follow official disaster warnings.
      </p>
    </form>
  );
}

export default PredictionForm;
