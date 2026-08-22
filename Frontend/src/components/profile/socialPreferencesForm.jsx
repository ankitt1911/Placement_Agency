import { Link2, MapPin } from "lucide-react";
import ProfileSection from "./profileSection";

export default function SocialPreferencesForm({ links, preferences, onLinksChange, onPreferencesChange, errors }) {
  return (
    <>
      <ProfileSection title="Social Links" icon={Link2} description="Add links recruiters can use to verify your work and professional presence." fields={[{ name: "portfolio", label: "Portfolio", placeholder: "https://your-site.com", wide: true }, { name: "github", label: "Github", placeholder: "https://github.com/username" }, { name: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" }]} data={links} onChange={onLinksChange} errors={errors} />
      <ProfileSection title="Preferences" icon={MapPin} description="Share your location and salary preferences for better matching." fields={[{ name: "preferredLocation", label: "Preferred location", type: "india-location" }, { name: "expectedSalary", label: "Expected salary", placeholder: "600000" }]} data={preferences} onChange={onPreferencesChange} errors={errors} />
    </>
  );
}
