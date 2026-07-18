import { BadgeCheck } from "lucide-react";
import ProfileSection from "./profileSection";

export default function AcademicDetailsForm(props) {
  return <ProfileSection title="Academic Details & Eligibility" icon={BadgeCheck} description="These fields help recruiters and operations teams match you with eligible openings." fields={[{ name: "college", label: "College", placeholder: "College name", wide: true, required: true }, { name: "university", label: "University", placeholder: "University name", wide: true, required: true }, { name: "branch", label: "Branch", placeholder: "Computer Science", required: true }, { name: "passingYear", label: "Passing year", placeholder: "2026", required: true }, { name: "cgpa", label: "CGPA", placeholder: "8.5", required: true }, { name: "percentage", label: "Percentage", placeholder: "82", required: true }, { name: "totalBacklogs", label: "Total backlogs", placeholder: "0", required: true }, { name: "activeBacklogs", label: "Active backlogs", placeholder: "0", required: true }]} {...props} />;
}
