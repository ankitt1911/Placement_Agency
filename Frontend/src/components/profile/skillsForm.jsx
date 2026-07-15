import { Sparkles } from "lucide-react";
import ProfileSection from "./profileSection";

export default function SkillsForm(props) {
  return <ProfileSection title="Skills" icon={Sparkles} description="Add searchable skills and strengths that make your profile easier to shortlist." fields={[{ name: "technicalSkills", label: "Technical skills", type: "textarea", placeholder: "JavaScript, React, Node.js, SQL" }, { name: "softSkills", label: "Soft skills", type: "textarea", placeholder: "Communication, leadership, teamwork" }, { name: "languages", label: "Languages", placeholder: "English, Hindi, Marathi", wide: true }]} {...props} />;
}
