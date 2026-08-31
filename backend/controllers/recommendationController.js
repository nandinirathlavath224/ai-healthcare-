const getRecommendation = (req, res) => {
  const { disease } = req.body;

  let doctor = "";

  switch (disease.toLowerCase()) {
    case "fever":
      doctor = "General Physician";
      break;

    case "diabetes":
      doctor = "Diabetologist";
      break;

    case "hypertension":
      doctor = "Cardiologist";
      break;

    case "covid-19":
      doctor = "Pulmonologist";
      break;

    case "malaria":
      doctor = "General Physician";
      break;

    case "typhoid":
      doctor = "General Physician";
      break;

    case "dengue":
      doctor = "General Physician";
      break;

    default:
      doctor = "General Physician";
  }

  res.json({
    disease,
    recommended_doctor: doctor,
  });
};

module.exports = {
  getRecommendation,
};