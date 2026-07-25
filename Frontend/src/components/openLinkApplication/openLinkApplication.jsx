import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Award, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, FileText, GraduationCap, IndianRupee, Link2, Mail, MapPin, Phone, Send, Sparkles, UserRound } from "lucide-react";
import CustomButton from "../custom/customButton";
import EmptyState from "../custom/emptyState";
import HeardAboutForm from "../profile/HeardAboutForm";
import PageLoader from "../loader/PageLoader";
import { ErrorMessage, SuccessMessage } from "../../Utlis/Toastify/ToastMessage";
import { handleApplyViaOpenLink, handleGetOpenLinkOpening } from "../../Services/apiCalling/openLinkApis";
import IndiaStateCitySelect from "../custom/indiaStateCitySelect";

const initialForm = {
  name: "",
  email: "",
  dob: "",
  gender: "",
  mobile: "",
  address: "",
  college: "",
  university: "",
  branch: "",
  cgpa: "",
  percentage: "",
  passingYear: "",
  activeBacklogs: "",
  totalBacklogs: "",
  tenthPercentage: "",
  tenthYear: "",
  tenthBoard: "",
  twelfthPercentage: "",
  twelfthYear: "",
  twelfthBoard: "",
  graduationCollege: "",
  graduationUniversity: "",
  graduationBranch: "",
  graduationCgpa: "",
  graduationPassingYear: "",
  technicalSkills: "",
  softSkills: "",
  languages: "",
  projects: "",
  internships: "",
  totalExperience: "",
  achievements: "",
  certifications: "",
  resume: "",
  github: "",
  linkedin: "",
  portfolio: "",
  preferredLocation: "",
  expectedSalary: "",
  currentStatus: "Available",
  heardAbout: {
    source: "",
    referredBy: "",
    referrerContact: "",
    details: "",
  },
};

const split = (value) => String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
const numberOrUndefined = (value) => value === "" ? undefined : Number(value);
const prettyLabel = (value) => value.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());

export default function OpenLinkApplication() {
  const { id } = useParams();
  const [opening, setOpening] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    handleGetOpenLinkOpening(id)
      .then(setOpening)
      .finally(() => setLoading(false));
  }, [id]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const updateHeardAbout = (field, value) => setForm((current) => ({ ...current, heardAbout: { ...current.heardAbout, [field]: value } }));

  const submit = async (event) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.mobile) {
      ErrorMessage("Name, email and mobile are required");
      return;
    }
    setSaving(true);
    try {
      await handleApplyViaOpenLink(id, {
        name: form.name,
        email: form.email,
        dob: form.dob,
        gender: form.gender || undefined,
        mobile: form.mobile,
        address: form.address,
        education: {
          tenth: { percentage: numberOrUndefined(form.tenthPercentage), year: numberOrUndefined(form.tenthYear), board: form.tenthBoard },
          twelfth: { percentage: numberOrUndefined(form.twelfthPercentage), year: numberOrUndefined(form.twelfthYear), board: form.twelfthBoard },
          graduation: { college: form.graduationCollege, university: form.graduationUniversity, branch: form.graduationBranch, cgpa: numberOrUndefined(form.graduationCgpa), passingYear: numberOrUndefined(form.graduationPassingYear) },
        },
        academicDetails: {
          college: form.college,
          university: form.university,
          branch: form.branch,
          cgpa: numberOrUndefined(form.cgpa),
          percentage: numberOrUndefined(form.percentage),
          passingYear: numberOrUndefined(form.passingYear),
          activeBacklogs: numberOrUndefined(form.activeBacklogs),
          totalBacklogs: numberOrUndefined(form.totalBacklogs),
        },
        technicalSkills: split(form.technicalSkills),
        softSkills: split(form.softSkills),
        languages: split(form.languages).map((language) => ({ language, proficiency: "" })),
        projects: split(form.projects).map((title) => ({ title })),
        internships: split(form.internships).map((company) => ({ company })),
        totalExperience: numberOrUndefined(form.totalExperience),
        achievements: split(form.achievements),
        certifications: split(form.certifications).map((name) => ({ name })),
        resume: form.resume,
        socialLinks: { github: form.github, linkedin: form.linkedin, portfolio: form.portfolio },
        preferredLocation: split(form.preferredLocation),
        expectedSalary: numberOrUndefined(form.expectedSalary),
        currentStatus: form.currentStatus,
        heardAbout: form.heardAbout,
      });
      SuccessMessage("Application submitted successfully");
      setSubmitted(true);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!opening?.id) return <div className="page-shell"><EmptyState title="This application link is not active" /></div>;
  if (submitted) return <div className="page-shell"><EmptyState title="Application submitted" subtitle="Your profile and application have been received." /></div>;

  const jobFacts = [
    { label: "Company", value: opening.company || "Not specified", icon: Building2, tone: "bg-blue-50 text-blue-700 border-blue-100" },
    { label: "Location", value: opening.location || "Not specified", icon: MapPin, tone: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    { label: "Job type", value: opening.jobType || "Not specified", icon: BriefcaseBusiness, tone: "bg-purple-50 text-purple-700 border-purple-100" },
    { label: "Category", value: opening.category || "Not specified", icon: BriefcaseBusiness, tone: "bg-teal-50 text-teal-700 border-teal-100" },
    { label: "Experience", value: `${opening.experience || 0} years`, icon: Award, tone: "bg-amber-50 text-amber-700 border-amber-100" },
    { label: "Salary", value: opening.salaryLabel || "Not disclosed", icon: IndianRupee, tone: "bg-rose-50 text-rose-700 border-rose-100" },
    { label: "Deadline", value: opening.applicationDeadlineDate || "Open", icon: CalendarDays, tone: "bg-sky-50 text-sky-700 border-sky-100" },
  ];
  const skillList = split(opening.skills);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:py-8">
        <section className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
          <div className="bg-blue-600 px-5 py-4 text-white sm:px-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wide ring-1 ring-white/25">
                <BriefcaseBusiness className="h-4 w-4" />
                Open application link
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-blue-700">
                <CheckCircle2 className="h-4 w-4" />
                Accepting applications
              </span>
            </div>
          </div>
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
            <div className="min-w-0">
              <p className="text-sm font-black uppercase tracking-wide text-blue-700">{opening.company}</p>
              <h1 className="mt-2 text-3xl font-black leading-tight text-portal-ink sm:text-4xl">{opening.role}</h1>
              {opening.description ? <p className="mt-4 max-w-3xl text-sm leading-7 text-portal-muted">{opening.description}</p> : null}
              <div className="mt-5 flex flex-wrap gap-2">
                {skillList.length ? skillList.slice(0, 10).map((skill) => <span className="modal-chip" key={skill}>{skill}</span>) : <span className="modal-chip">Skills not specified</span>}
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {jobFacts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div key={fact.label} className={`rounded-2xl border p-4 ${fact.tone}`}>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-black uppercase tracking-wide opacity-75">{fact.label}</p>
                        <p className="mt-0.5 truncate text-sm font-extrabold">{fact.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <form onSubmit={submit} className="grid gap-6">
          <FormCard icon={UserRound} title="Personal Details" subtitle="Basic identity and contact information." tone="blue">
            <div className="grid gap-4 md:grid-cols-2">
              <Field icon={UserRound} label="Name" value={form.name} onChange={(value) => update("name", value)} required />
              <Field icon={Mail} label="Email" type="email" value={form.email} onChange={(value) => update("email", value)} required />
              <Field icon={Phone} label="Mobile" value={form.mobile} onChange={(value) => update("mobile", value)} required />
              <Field icon={CalendarDays} label="Date of birth" type="date" value={form.dob} onChange={(value) => update("dob", value)} />
              <label>
                <span className="form-label">Gender</span>
                <select className="form-input" value={form.gender} onChange={(event) => update("gender", event.target.value)}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </label>
              <div className="md:col-span-2">
                <span className="form-label">Address</span>
                <IndiaStateCitySelect value={form.address} onChange={(value) => update("address", value)} />
              </div>
            </div>
          </FormCard>

          <FormCard icon={GraduationCap} title="Academic Details" subtitle="College, eligibility, marks, and backlog information." tone="emerald">
            <div className="grid gap-4 md:grid-cols-3">
              {["college", "university", "branch", "cgpa", "percentage", "passingYear", "activeBacklogs", "totalBacklogs"].map((field) => (
                <Field key={field} label={prettyLabel(field)} type={["cgpa", "percentage", "passingYear", "activeBacklogs", "totalBacklogs"].includes(field) ? "number" : "text"} value={form[field]} onChange={(value) => update(field, value)} />
              ))}
            </div>
          </FormCard>

          <FormCard icon={Award} title="Education History" subtitle="School and graduation details for verification." tone="purple">
            <div className="grid gap-4 md:grid-cols-3">
              {["tenthPercentage", "tenthYear", "tenthBoard", "twelfthPercentage", "twelfthYear", "twelfthBoard", "graduationCollege", "graduationUniversity", "graduationBranch", "graduationCgpa", "graduationPassingYear"].map((field) => (
                <Field key={field} label={prettyLabel(field)} type={field.toLowerCase().includes("year") || field.toLowerCase().includes("cgpa") || field.toLowerCase().includes("percentage") ? "number" : "text"} value={form[field]} onChange={(value) => update(field, value)} />
              ))}
            </div>
          </FormCard>

          <FormCard icon={Sparkles} title="Skills, Experience And Links" subtitle="Use comma separated entries where relevant." tone="amber">
            <div className="grid gap-4 md:grid-cols-2">
              {["technicalSkills", "softSkills", "languages", "projects", "internships", "achievements", "certifications"].map((field) => (
                <Field key={field} label={`${prettyLabel(field)} (comma separated)`} value={form[field]} onChange={(value) => update(field, value)} />
              ))}
              <div className="md:col-span-2">
                <span className="form-label">Preferred location</span>
                <IndiaStateCitySelect value={form.preferredLocation} onChange={(value) => update("preferredLocation", value)} />
              </div>
              <Field icon={BriefcaseBusiness} label="Total experience" type="number" value={form.totalExperience} onChange={(value) => update("totalExperience", value)} />
              <Field icon={IndianRupee} label="Expected salary" type="number" value={form.expectedSalary} onChange={(value) => update("expectedSalary", value)} />
              <Field icon={FileText} label="Resume link" value={form.resume} onChange={(value) => update("resume", value)} />
              <Field icon={Link2} label="Github" value={form.github} onChange={(value) => update("github", value)} />
              <Field icon={Link2} label="LinkedIn" value={form.linkedin} onChange={(value) => update("linkedin", value)} />
              <Field icon={Link2} label="Portfolio" value={form.portfolio} onChange={(value) => update("portfolio", value)} />
            </div>
          </FormCard>

          <HeardAboutForm data={form.heardAbout} onChange={updateHeardAbout} />

          <div className="flex justify-end rounded-2xl border border-portal-border bg-white p-3 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
            <CustomButton type="submit" loading={saving}><Send className="h-4 w-4" />Apply Now</CustomButton>
          </div>
        </form>
      </div>
    </main>
  );
}

function FormCard({ icon: Icon, title, subtitle, tone = "blue", children }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-portal-border bg-white shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
      <div className="border-b border-portal-border bg-slate-50/80 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-black text-portal-ink">{title}</h3>
            <p className="mt-1 text-xs font-semibold text-portal-muted">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Field({ label, value, onChange, type = "text", required = false, icon: Icon }) {
  return (
    <label>
      <span className="form-label capitalize">{label}</span>
      <span className="relative block">
        {Icon ? <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-portal-muted" /> : null}
        <input className={`form-input ${Icon ? "pl-9" : ""}`} type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} />
      </span>
    </label>
  );
}
