import { UserRound } from "lucide-react";
import ProfileSection from "./profileSection";

export default function PersonalDetailsForm(props) {
  return <ProfileSection title="Personal Details" icon={UserRound} description="Keep your identity and contact information accurate for placement communication." fields={[{ name: "name", label: "Full name", placeholder: "Your full name", required: true }, { name: "dob", label: "Date of birth", type: "date", required: true }, { name: "gender", label: "Gender", placeholder: "Female, Male, Other", required: true }, { name: "mobile", label: "Mobile", placeholder: "10 digit mobile number", required: true }, { name: "email", label: "Email", placeholder: "name@example.com", wide: true, required: true }, { name: "address", label: "Address", type: "textarea", placeholder: "Current address", required: true }]} {...props} />;
}
