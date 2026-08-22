import { useEffect, useState } from "react";
import { CheckCircle2, FileText, GraduationCap, Link2, Mail, Phone, Sparkles, UserRoundCheck } from "lucide-react";
import CustomButton from "../custom/customButton";
import PageLoader from "../loader/PageLoader";
import AcademicDetailsForm from "./academicDetailsForm";
import EducationDetailsForm from "./educationDetailsForm";
import ExperienceProjectsForm from "./experienceProjectsForm";
import HeardAboutForm from "./HeardAboutForm";
import PersonalDetailsForm from "./personalDetailsForm";
import ResumeDocumentsForm from "./resumeDocumentsForm";
import SkillsForm from "./skillsForm";
import SocialPreferencesForm from "./socialPreferencesForm";
import { handleGetProfile, handleUpdateProfile } from "../../Services/apiCalling/profileApis";
import { SuccessMessage } from "../../Utlis/Toastify/ToastMessage";
import { isCgpa, isEmail, isMobile, isPercentage, isRequired, isSalary, isUrl } from "../../Utlis/Common/commonValidator";

const countFilledFields = (value) => {
  if (!value || typeof value !== "object") return { filled: value ? 1 : 0, total: 1 };

  return Object.values(value).reduce(
    (summary, item) => {
      if (item && typeof item === "object") {
        const nested = countFilledFields(item);
        return { filled: summary.filled + nested.filled, total: summary.total + nested.total };
      }

      return {
        filled: summary.filled + (String(item || "").trim() ? 1 : 0),
        total: summary.total + 1
      };
    },
    { filled: 0, total: 0 }
  );
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    handleGetProfile().then(setProfile).finally(() => setLoading(false));
  }, []);

  const updateSection = (section, field, value) => {
    setProfile((current) => ({ ...current, [section]: { ...(current[section] || {}), [field]: value } }));
  };
  const updateEducation = (qualification, field, value) => {
    setProfile((current) => ({
      ...current,
      education: {
        ...(current.education || {}),
        [qualification]: { ...(current.education?.[qualification] || {}), [field]: value }
      }
    }));
  };
  const completionSummary = profile ? countFilledFields(profile) : { filled: 0, total: 0 };
  const completion = completionSummary.total ? Math.round((completionSummary.filled / completionSummary.total) * 100) : 0;
  const remainingFields = Math.max(completionSummary.total - completionSummary.filled, 0);
  const quickStats = [
    { label: "Personal", value: profile?.personal?.name || "Add your name", icon: UserRoundCheck },
    { label: "Academics", value: profile?.academic?.branch || "Add branch", icon: GraduationCap },
    { label: "Skills", value: profile?.skills?.technicalSkills || "Add skills", icon: Sparkles },
    { label: "Resume", value: profile?.uploads?.resume || "Link pending", icon: FileText }
  ];

  const validate = () => {
    const next = {
      name: isRequired(profile.personal.name, "Name"),
      dob: isRequired(profile.personal.dob, "Date of birth"),
      gender: isRequired(profile.personal.gender, "Gender"),
      email: isRequired(profile.personal.email, "Email") || isEmail(profile.personal.email),
      mobile: isRequired(profile.personal.mobile, "Mobile") || isMobile(profile.personal.mobile),
      address: isRequired(profile.personal.address, "Address"),
      college: isRequired(profile.academic.college, "College"),
      university: isRequired(profile.academic.university, "University"),
      branch: isRequired(profile.academic.branch, "Branch"),
      passingYear: isRequired(profile.academic.passingYear, "Passing year"),
      cgpa: isRequired(profile.academic.cgpa, "CGPA") || isCgpa(profile.academic.cgpa),
      percentage: isRequired(profile.academic.percentage, "Percentage") || isPercentage(profile.academic.percentage),
      totalBacklogs: isRequired(profile.academic.totalBacklogs, "Total backlogs"),
      activeBacklogs: isRequired(profile.academic.activeBacklogs, "Active backlogs"),
      "tenth.board": isRequired(profile.education.tenth?.board, "10th board"),
      "tenth.year": isRequired(profile.education.tenth?.year, "10th passing year"),
      "tenth.percentage": isRequired(profile.education.tenth?.percentage, "10th percentage") || isPercentage(profile.education.tenth?.percentage),
      "twelfth.board": isRequired(profile.education.twelfth?.board, "12th board"),
      "twelfth.year": isRequired(profile.education.twelfth?.year, "12th passing year"),
      "twelfth.percentage": isRequired(profile.education.twelfth?.percentage, "12th percentage") || isPercentage(profile.education.twelfth?.percentage),
      "graduation.college": isRequired(profile.education.graduation?.college, "Graduation college"),
      "graduation.university": isRequired(profile.education.graduation?.university, "Graduation university"),
      "graduation.branch": isRequired(profile.education.graduation?.branch, "Graduation branch or course"),
      "graduation.cgpa": isRequired(profile.education.graduation?.cgpa, "Graduation CGPA") || isCgpa(profile.education.graduation?.cgpa),
      "graduation.passingYear": isRequired(profile.education.graduation?.passingYear, "Graduation passing year"),
      technicalSkills: isRequired(profile.skills.technicalSkills, "Technical skills"),
      languages: isRequired(profile.skills.languages, "Languages"),
      portfolio: isUrl(profile.links.portfolio),
      github: isUrl(profile.links.github),
      linkedin: isUrl(profile.links.linkedin),
      resume: isUrl(profile.uploads.resume),
      profilePhoto: isUrl(profile.uploads.profilePhoto),
      expectedSalary: isSalary(profile.preferences.expectedSalary)
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const updatedProfile = await handleUpdateProfile(profile);
      if (!updatedProfile) return;
      setProfile(updatedProfile);
      SuccessMessage("Profile saved");
      globalThis.dispatchEvent(new globalThis.Event("student-profile-updated"));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) return <PageLoader />;

  return (
    <div className="page-shell">
      <section className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-[0_18px_50px_rgba(38,57,91,0.14)]">
        <div className="relative bg-gradient-to-br from-white via-blue-50 to-brand-50 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 flex-col gap-5 md:flex-row md:items-center">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white bg-blue-600 text-3xl font-black text-white shadow-[0_18px_34px_rgba(37,99,235,0.25)]">
                {profile.uploads.profilePhoto ? (
                  <img className="h-full w-full object-cover" src={profile.uploads.profilePhoto} alt="" />
                ) : (
                  (profile.personal.name || "S").slice(0, 1).toUpperCase()
                )}
              </div>
              <div className="max-w-3xl min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/85 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-700">
                <CheckCircle2 className="h-4 w-4" />
                Student profile
              </span>
                <h1 className="mt-3 truncate text-3xl font-black text-portal-ink">{profile.personal.name || "Build your placement profile"}</h1>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-portal-muted">
                  {profile.personal.email ? <span className="listing-chip"><Mail className="h-3.5 w-3.5" />{profile.personal.email}</span> : null}
                  {profile.personal.mobile ? <span className="listing-chip"><Phone className="h-3.5 w-3.5" />{profile.personal.mobile}</span> : null}
                  {profile.academic.branch ? <span className="listing-chip"><GraduationCap className="h-3.5 w-3.5" />{profile.academic.branch}</span> : null}
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-portal-muted">Keep academics, documents, skills, and preferences ready so applications move faster.</p>
              </div>
            </div>

            <div className="w-full rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm xl:w-[22rem]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-portal-muted">Form completion</p>
                  <p className="mt-1 text-4xl font-extrabold text-portal-ink">{completion}%</p>
                </div>
                <div className="rounded-lg bg-brand-50 px-3 py-2 text-right">
                  <p className="text-xs font-semibold text-brand-700">{completionSummary.filled}/{completionSummary.total}</p>
                  <p className="text-xs text-portal-muted">fields done</p>
                </div>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-500" style={{ width: `${completion}%` }} />
              </div>
              <p className="mt-3 text-xs font-medium text-portal-muted">{remainingFields ? `${remainingFields} fields left to complete your profile.` : "Profile form is complete."}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 border-t border-portal-border bg-white px-5 py-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="flex items-center gap-3 rounded-lg border border-portal-border bg-slate-50/70 p-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-portal-muted">{stat.label}</p>
                  <p className="truncate text-sm font-semibold text-portal-ink">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="sticky top-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-portal-border bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2 text-sm font-semibold text-portal-muted">
          <Link2 className="h-4 w-4 text-brand-700" />
          <span>Update your details, then save changes.</span>
        </div>
        <CustomButton onClick={save} loading={saving}>Save Profile</CustomButton>
      </div>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]">
        <div className="grid gap-5 xl:grid-cols-2">
          <PersonalDetailsForm data={profile.personal} onChange={(field, value) => updateSection("personal", field, value)} errors={errors} />
          <AcademicDetailsForm data={profile.academic} onChange={(field, value) => updateSection("academic", field, value)} errors={errors} />
          <EducationDetailsForm data={profile.education} onChange={updateEducation} errors={errors} />
          <SkillsForm data={profile.skills} onChange={(field, value) => updateSection("skills", field, value)} errors={errors} />
          <ExperienceProjectsForm data={profile.experience} onChange={(field, value) => updateSection("experience", field, value)} errors={errors} />
        </div>
        <aside className="grid content-start gap-5">
          <ResumeDocumentsForm uploads={profile.uploads} errors={errors} onChange={(field, value) => updateSection("uploads", field, value)} />
          <SocialPreferencesForm links={profile.links} preferences={profile.preferences} onLinksChange={(field, value) => updateSection("links", field, value)} onPreferencesChange={(field, value) => updateSection("preferences", field, value)} errors={errors} />
          <HeardAboutForm data={profile.heardAbout} onChange={(field, value) => updateSection("heardAbout", field, value)} />
        </aside>
      </div>
    </div>
  );
}
