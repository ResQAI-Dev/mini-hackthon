export function validateDisasterReport(formData) {
  const errors = {};

  if (!formData.disaster_type) {
    errors.disaster_type = "Please select a disaster type.";
  }

  if (!formData.location?.trim()) {
    errors.location = "Please enter the disaster location.";
  }

  if (!formData.severity) {
    errors.severity = "Please select the severity.";
  }

  if (!formData.description?.trim()) {
    errors.description = "Please describe the disaster situation.";
  }

  if (
    formData.affected_people !== "" &&
    (Number(formData.affected_people) < 0 ||
      !Number.isInteger(Number(formData.affected_people)))
  ) {
    errors.affected_people = "Affected people must be a valid non-negative number.";
  }

  if (formData.latitude === null || formData.longitude === null) {
    errors.latitude = "Please select the disaster location on the map.";
  }

  return errors;
}