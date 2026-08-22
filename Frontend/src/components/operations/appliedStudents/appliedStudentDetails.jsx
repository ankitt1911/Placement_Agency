import { Award, BookOpen, BriefcaseBusiness, Building2, CalendarDays, CheckCircle2, FileText, GraduationCap, Link2, Mail, MapPin, Phone, Sparkles, UserRound } from "lucide-react";

const join = (value) => {
  if (Array.isArray(value)) return value.map((item) => {
    if (!item || typeof item !== "object") return item;
    return Object.values(item).flat().filter(Boolean).join(" - ");
  }).filter(Boolean).join(", ");
  return value || "";
};

function FactCard({ label, value, icon: Icon, tone }) {
  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/80 shadow-sm">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wide opacity-75">{label}</p>
          <p className="mt-0.5 break-words text-sm font-extrabold">{value || "Not specified"}</p>
        </div>
      </div>
    </div>
  );
}

function DetailTile({ label, value }) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="rounded-2xl border border-portal-border bg-white p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-wide text-portal-muted">{label}</p>
      <p className="mt-1 break-words text-sm font-extrabold text-portal-ink">{value}</p>
    </div>
  );
}

function ProfilePhotoPanel({ url, name }) {
  if (!url) return null;

  return (
    <div className="rounded-2xl border border-portal-border bg-white p-4 shadow-sm sm:col-span-2">
      <p className="text-[10px] font-black uppercase tracking-wide text-portal-muted">Profile Photo</p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
        <img className="h-32 w-32 rounded-2xl border border-portal-border object-cover shadow-sm" src={url} alt={`${name || "Student"} profile`} />
        <a className="secondary-btn w-fit" href={url} target="_blank" rel="noreferrer">
          <Link2 className="h-4 w-4" /> Open Photo
        </a>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, subtitle, tone, children }) {
  return (
    <section className="rounded-3xl border border-portal-border bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3">
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl border ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-black text-portal-ink">{title}</h3>
          <p className="text-xs font-semibold text-portal-muted">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function AppliedStudentDetails({ application }) {
  if (!application) return null;

  const profile = application.studentProfile || {};
  const academic = profile.academicDetails || {};
  const education = profile.education || {};
  const social = profile.socialLinks || {};
  const skills = join(profile.technicalSkills || application.skills).split(",").map((item) => item.trim()).filter(Boolean);
  const notes = Array.isArray(application.notes) ? application.notes : [];

  return (
    <div className="space-y-6 pb-3 text-sm text-portal-ink">
      <section className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
        <div className="bg-blue-600 px-5 py-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wide ring-1 ring-white/25">
              <BriefcaseBusiness className="h-4 w-4" />
              Application details
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-blue-700">
              <CheckCircle2 className="h-4 w-4" />
              {application.status}
            </span>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">{application.company || "Company"}</p>
          <h2 className="mt-2 text-2xl font-black leading-tight text-portal-ink">{application.role || "Applied role"}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {application.student ? <span className="listing-chip"><UserRound className="h-3.5 w-3.5" />{application.student}</span> : null}
            {application.email ? <span className="listing-chip"><Mail className="h-3.5 w-3.5" />{application.email}</span> : null}
            {profile.mobile ? <span className="listing-chip"><Phone className="h-3.5 w-3.5" />{profile.mobile}</span> : null}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <FactCard label="Applied On" value={application.appliedDate} icon={CalendarDays} tone="border-blue-100 bg-blue-50 text-blue-700" />
            <FactCard label="Applied From Open Link" value={application.appliedFromOpenLink ? "Yes" : "No"} icon={Link2} tone="border-purple-100 bg-purple-50 text-purple-700" />
            <FactCard label="College" value={application.college || academic.college} icon={GraduationCap} tone="border-emerald-100 bg-emerald-50 text-emerald-700" />
            <FactCard label="CGPA" value={application.cgpa || academic.cgpa} icon={Award} tone="border-amber-100 bg-amber-50 text-amber-700" />
          </div>
        </div>
      </section>

      <Section icon={UserRound} title="Student Profile" subtitle="Personal and contact information submitted with the application." tone="border-blue-100 bg-blue-50 text-blue-700">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfilePhotoPanel url={profile.profilePhoto} name={application.student || profile.name} />
          <DetailTile label="Name" value={application.student || profile.name} />
          <DetailTile label="Email" value={application.email || profile.email} />
          <DetailTile label="Mobile" value={profile.mobile} />
          <DetailTile label="Date of Birth" value={profile.dob?.slice?.(0, 10) || profile.dob} />
          <DetailTile label="Gender" value={profile.gender} />
          <DetailTile label="Address" value={profile.address} />
          <DetailTile label="Current Student Status" value={profile.currentStatus} />
          <DetailTile label="Subscription Status" value={profile.subscriptionStatus} />
        </div>
      </Section>

      <Section icon={BookOpen} title="Academic Details" subtitle="Eligibility and college information used for screening." tone="border-emerald-100 bg-emerald-50 text-emerald-700">
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailTile label="College" value={application.college || academic.college} />
          <DetailTile label="University" value={academic.university} />
          <DetailTile label="Branch" value={academic.branch} />
          <DetailTile label="CGPA" value={application.cgpa || academic.cgpa} />
          <DetailTile label="Percentage" value={academic.percentage} />
          <DetailTile label="Passing Year" value={academic.passingYear} />
          <DetailTile label="Placement Eligibility" value={academic.placementEligibility} />
          <DetailTile label="Active Backlogs" value={application.backlogs || academic.activeBacklogs} />
          <DetailTile label="Total Backlogs" value={academic.totalBacklogs} />
        </div>
      </Section>

      <Section icon={GraduationCap} title="Education" subtitle="School and higher education details from the student profile." tone="border-purple-100 bg-purple-50 text-purple-700">
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailTile label="10th" value={join(education.tenth && Object.values(education.tenth))} />
          <DetailTile label="12th" value={join(education.twelfth && Object.values(education.twelfth))} />
          <DetailTile label="Diploma" value={join(education.diploma && Object.values(education.diploma))} />
          <DetailTile label="Graduation" value={join(education.graduation && Object.values(education.graduation))} />
          <DetailTile label="Post Graduation" value={join(education.postGraduation && Object.values(education.postGraduation))} />
        </div>
      </Section>

      <Section icon={Sparkles} title="Skills & Experience" subtitle="Skills, projects, internships, achievements, and certifications." tone="border-amber-100 bg-amber-50 text-amber-700">
        <div className="flex flex-wrap gap-2">
          {skills.length ? skills.map((skill) => <span className="modal-chip" key={skill}>{skill}</span>) : <span className="text-portal-muted">No technical skills listed.</span>}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <DetailTile label="Soft Skills" value={join(profile.softSkills)} />
          <DetailTile label="Languages" value={join(profile.languages)} />
          <DetailTile label="Total Experience" value={profile.totalExperience} />
          <DetailTile label="Projects" value={join(profile.projects)} />
          <DetailTile label="Internships" value={join(profile.internships)} />
          <DetailTile label="Achievements" value={join(profile.achievements)} />
          <DetailTile label="Certifications" value={join(profile.certifications)} />
        </div>
      </Section>

      <Section icon={FileText} title="Documents & Links" subtitle="Resume and external links available for this applicant." tone="border-rose-100 bg-rose-50 text-rose-700">
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailTile label="Resume Used" value={application.resume} />
          <DetailTile label="Profile Resume" value={profile.resume} />
          <DetailTile label="Github" value={social.github ? <span className="inline-flex items-center gap-2"><Link2 className="h-4 w-4" />{social.github}</span> : ""} />
          <DetailTile label="LinkedIn" value={social.linkedin ? <span className="inline-flex items-center gap-2"><Link2 className="h-4 w-4" />{social.linkedin}</span> : ""} />
          <DetailTile label="Portfolio" value={social.portfolio ? <span className="inline-flex items-center gap-2"><Link2 className="h-4 w-4" />{social.portfolio}</span> : ""} />
          <DetailTile label="Preferred Location" value={join(profile.preferredLocation)} />
          <DetailTile label="Expected Salary" value={profile.expectedSalary} />
        </div>
      </Section>

      {notes.length ? (
        <Section icon={FileText} title="Application Notes" subtitle="Status notes recorded by operations." tone="border-sky-100 bg-sky-50 text-sky-700">
          <div className="grid gap-3">
            {notes.map((note, index) => (
              <div className="rounded-2xl border border-portal-border bg-white p-4 shadow-sm" key={`${note.text}-${index}`}>
                <p className="font-extrabold text-portal-ink">{note.text}</p>
                {note.date ? <p className="mt-1 text-xs font-semibold text-portal-muted">{String(note.date).slice(0, 10)}</p> : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}
