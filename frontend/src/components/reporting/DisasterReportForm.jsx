import { useState } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
} from "react-leaflet";

import LocationMap from "./LocationMap";
import { createDisasterReport } from "../../services/api";
import { validateDisasterReport } from "../../utils/validation";

const initialFormData = {
  disaster_type: "",
  location: "",
  latitude: 7.8731,
  longitude: 80.7718,
  severity: "",
  description: "",
  affected_people: "",
  contact_number: "",
};

function DisasterReportForm({ onReportCreated }) {
  const [formData, setFormData] =
    useState(initialFormData);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLocationSelect = (coordinates) => {
    setFormData((previous) => ({
      ...previous,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    }));

    setErrors((previous) => ({
      ...previous,
      latitude: "",
      longitude: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    const validationErrors =
      validateDisasterReport(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const payload = {
        ...formData,
        affected_people:
          formData.affected_people === ""
            ? null
            : Number(formData.affected_people),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };

      const createdReport =
        await createDisasterReport(payload);

      setMessage(
        "Disaster report submitted successfully."
      );

      setFormData(initialFormData);

      if (onReportCreated) {
        onReportCreated(createdReport);
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.detail ||
          "Failed to submit the disaster report."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        Report a Disaster
      </h2>

      {message && (
        <p className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
          {message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Disaster Type *
          </label>

          <select
            name="disaster_type"
            value={formData.disaster_type}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">
              Select disaster type
            </option>

            <option value="Flood">
              Flood
            </option>

            <option value="Landslide">
              Landslide
            </option>

            <option value="Fire">
              Fire
            </option>

            <option value="Storm">
              Storm
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          {errors.disaster_type && (
            <p className="mt-1 text-sm text-red-600">
              {errors.disaster_type}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Location *
          </label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Severity *
          </label>

          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="">
              Select severity
            </option>

            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>

            <option value="Critical">
              Critical
            </option>
          </select>

          {errors.severity && (
            <p className="mt-1 text-sm text-red-600">
              {errors.severity}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Description *
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the disaster situation"
            rows="5"
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Affected People
          </label>

          <input
            type="number"
            name="affected_people"
            value={formData.affected_people}
            onChange={handleChange}
            min="0"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {errors.affected_people && (
            <p className="mt-1 text-sm text-red-600">
              {errors.affected_people}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Contact Number
          </label>

          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            placeholder="Optional contact number"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">
            Select Disaster Location
          </h3>

          <p className="mb-4 text-sm text-gray-500">
            Click on the map to select the
            disaster location.
          </p>

          <div className="overflow-hidden rounded-lg border border-gray-300">
            <MapContainer
              center={[7.8731, 80.7718]}
              zoom={7}
              style={{
                height: "400px",
                width: "100%",
              }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LocationMap
                onLocationSelect={
                  handleLocationSelect
                }
              />

              {formData.latitude !== null &&
                formData.longitude !== null && (
                  <Marker
                    position={[
                      formData.latitude,
                      formData.longitude,
                    ]}
                  />
                )}
            </MapContainer>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
              <span className="font-medium">
                Latitude:
              </span>{" "}
              {formData.latitude ?? "Not selected"}
            </p>

            <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
              <span className="font-medium">
                Longitude:
              </span>{" "}
              {formData.longitude ?? "Not selected"}
            </p>
          </div>

          {errors.latitude && (
            <p className="mt-2 text-sm text-red-600">
              {errors.latitude}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Submitting..."
            : "Submit Disaster Report"}
        </button>

      </form>
    </div>
  );
}

export default DisasterReportForm;
