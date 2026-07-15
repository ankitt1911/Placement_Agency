import { Building2, CheckCircle2, FileText, Globe, Image, Link2, Mail, MapPin, Phone, UserRound } from "lucide-react";

const join = (value) => Array.isArray(value) ? value.join(", ") : value || "";

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

export default function CompanyDetails({ company }) {
  if (!company) return null;

  const contact = company.contactPerson || {};

  return (
    <div className="space-y-6 pb-3 text-sm text-portal-ink">
      <section className="overflow-hidden rounded-3xl border border-white bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
        <div className="bg-blue-600 px-5 py-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-wide ring-1 ring-white/25">
              <Building2 className="h-4 w-4" />
              Company details
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-extrabold text-blue-700">
              <CheckCircle2 className="h-4 w-4" />
              {company.status || "Active"}
            </span>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">{company.industry || "Industry not specified"}</p>
          <h2 className="mt-2 text-2xl font-black leading-tight text-portal-ink">{company.name || "Company"}</h2>
          {company.description ? <p className="mt-3 leading-7 text-portal-muted">{company.description}</p> : null}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <FactCard label="Industry" value={company.industry} icon={Building2} tone="border-blue-100 bg-blue-50 text-blue-700" />
            <FactCard label="Locations" value={join(company.locations)} icon={MapPin} tone="border-emerald-100 bg-emerald-50 text-emerald-700" />
            <FactCard label="Website" value={company.website} icon={Globe} tone="border-purple-100 bg-purple-50 text-purple-700" />
            <FactCard label="Address" value={company.address} icon={MapPin} tone="border-amber-100 bg-amber-50 text-amber-700" />
          </div>
        </div>
      </section>

      <Section icon={UserRound} title="Contact Person" subtitle="Primary company contact details." tone="border-emerald-100 bg-emerald-50 text-emerald-700">
        <div className="grid gap-4 sm:grid-cols-3">
          <DetailTile label="Name" value={contact.name} />
          <DetailTile label="Email" value={contact.email ? <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />{contact.email}</span> : ""} />
          <DetailTile label="Phone" value={contact.phone ? <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" />{contact.phone}</span> : ""} />
        </div>
      </Section>

      <Section icon={FileText} title="Assets & Documents" subtitle="Logo, website, and document references." tone="border-purple-100 bg-purple-50 text-purple-700">
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailTile label="Logo" value={company.logo ? <span className="inline-flex items-center gap-2"><Image className="h-4 w-4" />{company.logo}</span> : ""} />
          <DetailTile label="Documents" value={join(company.documents)} />
          <DetailTile label="Website" value={company.website ? <span className="inline-flex items-center gap-2"><Link2 className="h-4 w-4" />{company.website}</span> : ""} />
        </div>
      </Section>

    </div>
  );
}
