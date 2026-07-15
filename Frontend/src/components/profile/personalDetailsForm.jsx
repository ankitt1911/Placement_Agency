import { UserRound } from "lucide-react";
import ProfileSection from "./profileSection";

export default function PersonalDetailsForm(props) {
  return <ProfileSection title="Personal Details" icon={UserRound} description="Keep your identity and contact information accurate for placement communication." fields={[{ name: "name", label: "Full name", placeholder: "Your full name" }, { name: "dob", label: "Date of birth", type: "date" }, { name: "gender", label: "Gender", placeholder: "Female, Male, Other" }, { name: "mobile", label: "Mobile", placeholder: "10 digit mobile number" }, { name: "email", label: "Email", placeholder: "name@example.com", wide: true }, { name: "address", label: "Address", type: "textarea", placeholder: "Current address" }]} {...props} />;
}
