import { BriefcaseBusiness } from "lucide-react";
import ProfileSection from "./profileSection";

export default function ExperienceProjectsForm(props) {
  return <ProfileSection title="Experience, Projects & Certifications" icon={BriefcaseBusiness} description="Show practical work, project proof, internships, recognitions, and certifications." fields={[{ name: "totalExperience", label: "Experience", type: "number", placeholder: "Months or years" }, { name: "companyName", label: "Company name", placeholder: "Company name" }, { name: "projects", label: "Projects", type: "textarea", placeholder: "Project title, tech stack, link, outcome" }, { name: "internships", label: "Internships", type: "textarea", placeholder: "Company, role, duration, work done" }, { name: "certifications", label: "Certifications", type: "textarea", placeholder: "Certification, issuer, date" }, { name: "achievements", label: "Achievements", type: "textarea", placeholder: "Awards, hackathons, publications" }]} {...props} />;
}
