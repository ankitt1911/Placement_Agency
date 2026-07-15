import { GraduationCap } from "lucide-react";
import ProfileSection from "./profileSection";

export default function EducationDetailsForm(props) {
  return <ProfileSection title="Education" icon={GraduationCap} description="Summarize your academic journey across school, diploma, and degree programs." fields={[{ name: "tenth", label: "10th", placeholder: "Board, year, percentage" }, { name: "twelfth", label: "12th", placeholder: "Board, year, percentage" }, { name: "diploma", label: "Diploma", placeholder: "College, branch, score" }, { name: "graduation", label: "Graduation", placeholder: "College, branch, CGPA", wide: true }, { name: "postGraduation", label: "Post graduation", placeholder: "College, branch, CGPA", wide: true }]} {...props} />;
}
