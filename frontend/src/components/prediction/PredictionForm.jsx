import { useState } from "react";

const districts = [
  "Colombo","Gampaha","Kalutara","Kandy","Matale","Nuwara Eliya",
  "Galle","Matara","Hambantota","Jaffna","Kilinochchi","Mannar",
  "Vavuniya","Mullaitivu","Batticaloa","Ampara","Trincomalee",
  "Kurunegala","Puttalam","Anuradhapura","Polonnaruwa","Badulla",
  "Monaragala","Ratnapura","Kegalle",
];

function PredictionForm({ onResult }) {
  const [district, setDistrict] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [waterLevel, setWaterLevel] = useState("0");
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherStatus, setWeatherStatus] = useState("");

  const handleDistrictChange = async (e) => {
    const selectedDistrict = e.target.value;

    setDistrict(selectedDistrict);
    setRainfall("");
    setError("");
    setWeatherStatus("");

    if (!selectedDistrict) return;

    setWeatherLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/weather/${encodeURIComponent(selectedDistrict)}`
      );

      if (!response.ok) {
        throw new Error("Weather request failed");
      }

      const data = await response.json();

      setRainfall(data.rainfall);
      setWeatherStatus(
        `Automatic rainfall data loaded • ${data.source}`
      );
    } catch (err) {
      setError(
        "Unable to load automatic rainfall data. Please enter rainfall manually."
      );
    } finally {
      setWeatherLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!district || rainfall === "") {
      setError("Please select a district and wait for rainfall data.");
      return;
    }

    if (Number(rainfall) < 0 || Number(waterLevel) < 0) {
      setError("Rainfall and water level cannot be negative.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/prediction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            district,
            rainfall: Number(rainfall),
            water_level: Number(waterLevel),
          }),
        }
      );

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
    setWaterLevel("0");
    setError("");
    setWeatherStatus("");
    onResult(null);
  };

  return (
    <form className="prediction-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="district">District</label>

        <select
          id="district"
          value={district}
          onChange={handleDistrictChange}
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
          <label htmlFor="rainfall">
            Rainfall
          </label>

          <div className="input-wrapper">
            <input
              id="rainfall"
              type="number"
              min="0"
              step="0.1"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
              placeholder="Automatic"
            />

            <span>mm</span>
          </div>

          {weatherLoading && (
            <small>Loading automatic rainfall...</small>
          )}

          {weatherStatus && !weatherLoading && (
            <small>{weatherStatus}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="waterLevel">
            Water Level
          </label>

          <div className="input-wrapper">
            <input
              id="waterLevel"
              type="number"
              min="0"
              step="0.1"
              value={waterLevel}
              onChange={(e) => setWaterLevel(e.target.value)}
              placeholder="0"
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
          disabled={loading || weatherLoading}
        >
          {loading
            ? "Analyzing Risk..."
            : weatherLoading
            ? "Loading Weather..."
            : "Check Disaster Risk"}
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
        Rainfall is automatically retrieved for the selected district.
        Water level can be provided when available.
        Prototype assessment only — follow official disaster warnings.
      </p>
    </form>
  );
}

export default PredictionForm;