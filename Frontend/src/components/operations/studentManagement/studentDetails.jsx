import { Award, BookOpen, BriefcaseBusiness, CheckCircle2, FileText, GraduationCap, Link2, Mail, MapPin, Phone, Sparkles, UserRound } from "lucide-react";

const join = (value) => {
  if (Array.isArray(value)) return value.map((item) => typeof item === "object" ? Object.values(item).filter(Boolean).join(" - ") : item).filter(Boolean).join(", ");
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

export default function StudentDetails({ student }) {
  if (!student) return null;

  const academic = student.academicDetails || {};
  const education = student.education || {};
  const social = student.socialLinks || {};
  const skills = join(student.technicalSkills || student.skills).split(",").map((item) => item.trim()).filter(Boolean);

  return (
    <div className="space-y-6 pb-3 text-sm text-portal-ink">
      <section className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
        <div className="bg-blue-600 px-5 py-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wide ring-1 ring-white/25">
              <UserRound className="h-4 w-4" />
              Student profile
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-blue-700">
              <CheckCircle2 className="h-4 w-4" />
              {student.status || "Active"}
            </span>
          </div>
        </div>
        <div className="p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-600 text-3xl font-black text-white shadow-[0_16px_32px_rgba(37,99,235,0.25)]">
              {student.profilePhoto ? (
                <img className="h-full w-full object-cover" src={student.profilePhoto} alt="" />
              ) : (
                (student.name || "S").slice(0, 1).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-blue-700">{student.college || "College not specified"}</p>
              <h2 className="mt-1 text-2xl font-black leading-tight text-portal-ink">{student.name || "Student"}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {student.email ? <span className="listing-chip"><Mail className="h-3.5 w-3.5" />{student.email}</span> : null}
                {student.mobile ? <span className="listing-chip"><Phone className="h-3.5 w-3.5" />{student.mobile}</span> : null}
                {student.branch ? <span className="listing-chip"><GraduationCap className="h-3.5 w-3.5" />{student.branch}</span> : null}
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <FactCard label="CGPA" value={student.cgpa || academic.cgpa} icon={Award} tone="border-blue-100 bg-blue-50 text-blue-700" />
            <FactCard label="Passing Year" value={student.passingYear || academic.passingYear} icon={GraduationCap} tone="border-emerald-100 bg-emerald-50 text-emerald-700" />
            <FactCard label="Location" value={student.location || join(student.preferredLocation)} icon={MapPin} tone="border-purple-100 bg-purple-50 text-purple-700" />
            <FactCard label="Current Status" value={student.currentStatus} icon={BriefcaseBusiness} tone="border-amber-100 bg-amber-50 text-amber-700" />
          </div>
        </div>
      </section>

      <Section icon={BookOpen} title="Academic Details" subtitle="College, branch, marks, and eligibility details." tone="border-emerald-100 bg-emerald-50 text-emerald-700">
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailTile label="College" value={student.college || academic.college} />
          <DetailTile label="University" value={academic.university} />
          <DetailTile label="Branch" value={student.branch || academic.branch} />
          <DetailTile label="Percentage" value={academic.percentage} />
          <DetailTile label="Active Backlogs" value={academic.activeBacklogs} />
          <DetailTile label="Total Backlogs" value={academic.totalBacklogs} />
        </div>
      </Section>

      <Section icon={GraduationCap} title="Education" subtitle="School, diploma, graduation, and post-graduation information." tone="border-purple-100 bg-purple-50 text-purple-700">
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailTile label="10th" value={join(education.tenth && Object.values(education.tenth))} />
          <DetailTile label="12th" value={join(education.twelfth && Object.values(education.twelfth))} />
          <DetailTile label="Diploma" value={join(education.diploma && Object.values(education.diploma))} />
          <DetailTile label="Graduation" value={join(education.graduation && Object.values(education.graduation))} />
          <DetailTile label="Post Graduation" value={join(education.postGraduation && Object.values(education.postGraduation))} />
        </div>
      </Section>

      <Section icon={Sparkles} title="Skills & Experience" subtitle="Technical skills, soft skills, projects, internships, and achievements." tone="border-amber-100 bg-amber-50 text-amber-700">
        <div className="flex flex-wrap gap-2">
          {skills.length ? skills.map((skill) => <span className="modal-chip" key={skill}>{skill}</span>) : <span className="text-portal-muted">No technical skills listed.</span>}
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <DetailTile label="Soft Skills" value={join(student.softSkills)} />
          <DetailTile label="Languages" value={join(student.languages)} />
          <DetailTile label="Total Experience" value={student.totalExperience} />
          <DetailTile label="Projects" value={join(student.projects)} />
          <DetailTile label="Internships" value={join(student.internships)} />
          <DetailTile label="Achievements" value={join(student.achievements)} />
          <DetailTile label="Certifications" value={join(student.certifications)} />
        </div>
      </Section>

      <Section icon={FileText} title="Documents & Links" subtitle="Resume and social links shared by the student." tone="border-rose-100 bg-rose-50 text-rose-700">
        <div className="grid gap-4 sm:grid-cols-2">
          <ProfilePhotoPanel url={student.profilePhoto} name={student.name} />
          <DetailTile label="Resume" value={student.resume} />
          <DetailTile label="Github" value={social.github ? <span className="inline-flex items-center gap-2"><Link2 className="h-4 w-4" />{social.github}</span> : ""} />
          <DetailTile label="LinkedIn" value={social.linkedin ? <span className="inline-flex items-center gap-2"><Link2 className="h-4 w-4" />{social.linkedin}</span> : ""} />
          <DetailTile label="Portfolio" value={social.portfolio ? <span className="inline-flex items-center gap-2"><Link2 className="h-4 w-4" />{social.portfolio}</span> : ""} />
          <DetailTile label="Expected Salary" value={student.expectedSalary} />
        </div>
      </Section>
    </div>
  );
}
