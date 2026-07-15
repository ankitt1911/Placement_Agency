const sourceOptions = ["Refer", "Social Media", "Other"];

export default function HeardAboutForm({ data = {}, onChange }) {
  const source = data.source || "";

  const updateSource = (value) => {
    onChange("source", value);
    if (value === "Refer") {
      onChange("details", "");
      return;
    }
    onChange("referredBy", "");
    onChange("referrerContact", "");
  };

  return (
    <section className="profile-card">
      <div className="mb-4">
        <h2 className="section-title">Where did you hear about us?</h2>
        <p className="mt-1 text-sm text-portal-muted">Select the source and add the related detail.</p>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-wrap gap-2">
          {sourceOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`listing-action ${source === option ? "listing-action-blue" : "listing-action-purple"}`}
              onClick={() => updateSource(option)}
            >
              {option}
            </button>
          ))}
        </div>

        {source === "Refer" ? (
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="form-label">Who has referred?</span>
              <input className="form-input" value={data.referredBy || ""} onChange={(event) => onChange("referredBy", event.target.value)} />
            </label>
            <label>
              <span className="form-label">Contact detail</span>
              <input className="form-input" value={data.referrerContact || ""} onChange={(event) => onChange("referrerContact", event.target.value)} />
            </label>
          </div>
        ) : null}

        {source === "Social Media" ? (
          <label>
            <span className="form-label">Social media detail</span>
            <input className="form-input" placeholder="Instagram, LinkedIn, Facebook, etc." value={data.details || ""} onChange={(event) => onChange("details", event.target.value)} />
          </label>
        ) : null}

        {source === "Other" ? (
          <label>
            <span className="form-label">Other detail</span>
            <input className="form-input" value={data.details || ""} onChange={(event) => onChange("details", event.target.value)} />
          </label>
        ) : null}
      </div>
    </section>
  );
}
