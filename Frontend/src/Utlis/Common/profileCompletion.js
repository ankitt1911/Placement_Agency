const hasValue = (value) => {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.values(value).some(hasValue);
  return String(value).trim() !== "";
};

export const isStudentProfileComplete = (profile) => {
  if (!profile) return false;

  const personal = profile.personal || {};
  const academic = profile.academic || {};
  const education = profile.education || {};
  const skills = profile.skills || {};

  return [
    personal.name,
    personal.dob,
    personal.gender,
    personal.mobile,
    personal.email,
    personal.address,
    academic.college,
    academic.university,
    academic.branch,
    academic.passingYear,
    academic.cgpa,
    academic.percentage,
    academic.totalBacklogs,
    academic.activeBacklogs,
    education.tenth,
    education.twelfth,
    education.graduation,
    skills.technicalSkills,
    skills.languages
  ].every(hasValue);
};
