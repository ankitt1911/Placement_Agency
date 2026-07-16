export const unwrapData = (response, fallback = []) => response?.data ?? response?.raw?.data ?? fallback;
export const unwrapBlob = (response) => response?.blob || response?.raw || response;
export const asList = (response) => {
  const data = unwrapData(response, []);
  return Array.isArray(data) ? data : [];
};
export const unwrapFilterOptions = (response) => unwrapData(response, {});

const join = (value) => Array.isArray(value) ? value.join(", ") : value || "";
const money = (salary) => {
  if (typeof salary === "number") return salary;
  if (!salary || typeof salary !== "object") return 0;
  return salary.max || salary.min || 0;
};
const salaryLabel = (salary) => {
  if (typeof salary === "number") return salary.toLocaleString();
  if (!salary || typeof salary !== "object") return "";
  const min = Number(salary.min) || 0;
  const max = Number(salary.max) || 0;
  if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()}`;
  return (max || min || "").toLocaleString();
};
const numberOrUndefined = (value) => value === "" || value === null || value === undefined ? undefined : Number(value);
const activeApplicationStatuses = ["Applied", "Under Review", "Shortlisted", "Selected", "Rejected"];
const isActiveApplicationStatus = (status) => activeApplicationStatuses.includes(status);

export const mapCompany = (company = {}) => ({
  ...company,
  id: company._id || company.id,
  locations: join(company.locations),
  status: company.isActive === false ? "Inactive" : "Active"
});

export const mapJob = (job = {}) => ({
  ...job,
  id: job._id || job.id,
  companyId: job.company?._id || "",
  company: job.company?.name || job.company || "",
  companyIndustry: job.company?.industry || "",
  companyLocations: join(job.company?.locations),
  companyWebsite: job.company?.website || "",
  companyLogo: job.company?.logo || "",
  companyStatus: job.company?.isActive === false ? "Inactive" : "Active",
  role: job.title || job.role || "",
  title: job.title || job.role || "",
  location: join(job.location),
  locations: job.location || [],
  skills: join(job.skills),
  skillList: job.skills || [],
  languages: join(job.languages),
  languageList: job.languages || [],
  salary: money(job.salary),
  salaryMin: job.salary?.min || "",
  salaryMax: job.salary?.max || "",
  salaryLabel: salaryLabel(job.salary),
  category: job.category || "IT",
  minCGPA: job.eligibility?.minCGPA || "",
  activeBacklogs: job.eligibility?.activeBacklogs ?? "",
  branches: join(job.eligibility?.branches),
  passingYear: join(job.eligibility?.passingYear),
  applicationDeadlineDate: job.applicationDeadline?.slice?.(0, 10) || "",
  openLinkActive: Boolean(job.openLink?.isActive),
  openLinkExpiresAt: job.openLink?.expiresAt?.slice?.(0, 10) || "",
  postedDate: job.createdAt?.slice?.(0, 10) || "",
  updatedDate: job.updatedAt?.slice?.(0, 10) || "",
  applicationStatus: job.applicationStatus || "",
  applied: isActiveApplicationStatus(job.applicationStatus),
  status: isActiveApplicationStatus(job.applicationStatus) ? job.applicationStatus : job.status || "Open"
});

export const mapApplication = (application = {}) => {
  const job = application.job || {};
  const company = job.company || {};
  const opening = mapJob({ ...job, applicationStatus: application.status });
  const studentProfile = application.student || {};

  return {
    ...application,
    id: application._id || application.id,
    student: application.student?.name || application.student?.user?.name || application.student || "",
    email: application.student?.email || application.student?.user?.email || "",
    company: company.name || "",
    role: job.title || application.role || "",
    location: join(company.locations || job.location),
    skills: join(job.skills || application.skills),
    college: application.student?.academicDetails?.college || "",
    cgpa: application.student?.academicDetails?.cgpa || "",
    backlogs: application.student?.academicDetails?.activeBacklogs || 0,
    resume: application.resumeUsed || "resume.pdf",
    status: application.status || "Applied",
    appliedFromOpenLink: Boolean(application.appliedFromOpenLink),
    appliedDate: (application.appliedAt || application.createdAt || "").slice(0, 10),
    timeline: ["Applied", ...(application.notes || []).map((note) => note.text), application.status].filter(Boolean),
    studentProfile,
    jobDetails: job,
    opening: {
      ...opening,
      company: company.name || opening.company || "",
      companyIndustry: company.industry || opening.companyIndustry || "",
      companyLocations: join(company.locations) || opening.companyLocations || "",
      applicationStatus: application.status || opening.applicationStatus || "",
      status: opening.status || job.status || "Open"
    }
  };
};

export const mapStudent = (profile = {}) => ({
  ...profile,
  id: profile._id || profile.id,
  name: profile.name || profile.user?.name || "",
  email: profile.user?.email || "",
  mobile: profile.mobile || "",
  college: profile.academicDetails?.college || "",
  branch: profile.academicDetails?.branch || "",
  cgpa: profile.academicDetails?.cgpa || "",
  location: join(profile.preferredLocation),
  skills: join(profile.technicalSkills),
  passingYear: profile.academicDetails?.passingYear || "",
  status: profile.user?.isActive === false ? "Disabled" : "Active",
  resume: profile.resume || "resume.pdf"
});

export const mapIssue = (issue = {}) => ({
  ...issue,
  id: issue._id || issue.id,
  subject: issue.subject || "",
  description: issue.description || "",
  priority: issue.priority || "Medium",
  status: issue.status || "Open",
  raisedByName: issue.raisedBy?.name || issue.raisedBy?.email || "",
  raisedByEmail: issue.raisedBy?.email || "",
  raisedByRole: issue.raisedBy?.role || "",
  closedByName: issue.closedBy?.name || issue.closedBy?.email || "",
  createdDate: (issue.createdAt || "").slice(0, 10),
  updatedDate: (issue.updatedAt || "").slice(0, 10),
  closedDate: (issue.closedAt || "").slice(0, 10)
});

export const mapProfileToUi = (profile = {}) => ({
  personal: {
    name: profile.name || profile.user?.name || "",
    email: profile.user?.email || "",
    dob: profile.dob?.slice?.(0, 10) || "",
    gender: profile.gender || "",
    mobile: profile.mobile || "",
    address: profile.address || ""
  },
  education: profile.education || {},
  academic: profile.academicDetails || {},
  skills: {
    technicalSkills: join(profile.technicalSkills),
    softSkills: join(profile.softSkills),
    languages: Array.isArray(profile.languages) ? profile.languages.map((item) => `${item.language} - ${item.proficiency}`).join(", ") : ""
  },
  experience: {
    totalExperience: profile.totalExperience ?? "",
    projects: profile.projects || [],
    internships: profile.internships || [],
    achievements: join(profile.achievements),
    certifications: profile.certifications || []
  },
  uploads: {
    profilePhoto: profile.profilePhoto || "",
    resume: profile.resume || ""
  },
  links: profile.socialLinks || {},
  preferences: {
    preferredLocation: join(profile.preferredLocation),
    expectedSalary: profile.expectedSalary || "",
    currentStatus: profile.currentStatus || "",
    subscriptionStatus: profile.subscriptionStatus || ""
  },
  heardAbout: {
    source: profile.heardAbout?.source || "",
    referredBy: profile.heardAbout?.referredBy || "",
    referrerContact: profile.heardAbout?.referrerContact || "",
    details: profile.heardAbout?.details || ""
  }
});

export const mapProfileToApi = (profile = {}) => ({
  name: profile.personal?.name,
  dob: profile.personal?.dob,
  gender: profile.personal?.gender,
  mobile: profile.personal?.mobile,
  address: profile.personal?.address,
  education: profile.education,
  academicDetails: profile.academic,
  technicalSkills: split(profile.skills?.technicalSkills),
  softSkills: split(profile.skills?.softSkills),
  achievements: split(profile.experience?.achievements),
  totalExperience: numberOrUndefined(profile.experience?.totalExperience),
  projects: profile.experience?.projects || [],
  internships: profile.experience?.internships || [],
  certifications: profile.experience?.certifications || [],
  socialLinks: profile.links,
  preferredLocation: split(profile.preferences?.preferredLocation),
  expectedSalary: Number(profile.preferences?.expectedSalary) || undefined,
  currentStatus: profile.preferences?.currentStatus,
  subscriptionStatus: profile.preferences?.subscriptionStatus,
  heardAbout: profile.heardAbout
});

const split = (value) => Array.isArray(value) ? value : String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
