const PDFDocument = require("pdfkit");

// Palette mirrors the portal theme so a generated resume still looks like it
// came from this product.
const INK = "#26395b";
const MUTED = "#7586a2";
const ACCENT = "#ff1f5f";
const RULE = "#dfe6ef";
const CHIP_BG = "#f5f7fb";

const asText = (value) => value === null || value === undefined ? "" : String(value).trim();
const compact = (values) => (Array.isArray(values) ? values : [values]).map(asText).filter(Boolean);
const joinParts = (values, separator = " • ") => compact(values).join(separator);
const formatDate = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  return `${String(date.getDate()).padStart(2, "0")} ${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;
};
// Rupee sign is outside WinAnsi, which is all the built-in fonts encode, so the
// amount is labelled rather than symbolised.
const formatSalary = (value) => Number(value) > 0 ? `INR ${Number(value).toLocaleString("en-IN")}` : "";
const sanitizeFileName = (value) => (asText(value) || "resume").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();

const contentWidth = (doc) => doc.page.width - doc.page.margins.left - doc.page.margins.right;
const pageBottom = (doc) => doc.page.height - doc.page.margins.bottom;
// Keeps a heading (or the first line of an entry) from being stranded alone at
// the foot of a page.
const ensureSpace = (doc, height) => {
  if (doc.y + height > pageBottom(doc)) doc.addPage();
};

const sectionTitle = (doc, title) => {
  if (doc.y > doc.page.margins.top) doc.y += 10;
  ensureSpace(doc, 56);
  const left = doc.page.margins.left;
  const width = contentWidth(doc);
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(ACCENT).text(title.toUpperCase(), left, doc.y, { width, characterSpacing: 1.2 });
  const ruleY = doc.y + 3;
  doc.moveTo(left, ruleY).lineTo(left + width, ruleY).lineWidth(0.8).strokeColor(RULE).stroke();
  doc.y = ruleY + 8;
};

// Entry title on the left, dates/score on the right, both starting on the same
// baseline and the cursor left below whichever runs longer.
const entryHeading = (doc, primary, meta) => {
  const left = doc.page.margins.left;
  const width = contentWidth(doc);
  const metaWidth = meta ? Math.min(doc.font("Helvetica-Bold").fontSize(9).widthOfString(meta) + 12, width * 0.42) : 0;
  const startY = doc.y;
  doc.font("Helvetica-Bold").fontSize(10.5).fillColor(INK).text(primary, left, startY, { width: width - metaWidth });
  const afterPrimary = doc.y;
  if (meta) {
    doc.font("Helvetica-Bold").fontSize(9).fillColor(MUTED).text(meta, left + width - metaWidth, startY + 1.5, { width: metaWidth, align: "right" });
    doc.y = Math.max(afterPrimary, doc.y);
  }
};

const paragraph = (doc, value, { size = 9.5, color = MUTED, font = "Helvetica", indent = 0, gap = 1.5 } = {}) => {
  const content = asText(value);
  if (!content) return;
  const left = doc.page.margins.left + indent;
  doc.font(font).fontSize(size).fillColor(color).text(content, left, doc.y, { width: contentWidth(doc) - indent, lineGap: gap });
};

const bulletLine = (doc, value) => {
  const content = asText(value);
  if (!content) return;
  ensureSpace(doc, 18);
  const left = doc.page.margins.left;
  const startY = doc.y;
  doc.font("Helvetica-Bold").fontSize(9.5).fillColor(ACCENT).text("•", left, startY, { width: 10, lineBreak: false });
  doc.font("Helvetica").fontSize(9.5).fillColor(INK).text(content, left + 12, startY, { width: contentWidth(doc) - 12, lineGap: 1.5 });
};

// Skills read better as pills than as one long comma run, so they are packed
// manually row by row.
const chipRow = (doc, values) => {
  const items = compact(values);
  if (!items.length) return;
  const left = doc.page.margins.left;
  const maxX = left + contentWidth(doc);
  const height = 17;
  let x = left;
  let y = doc.y;
  items.forEach((item) => {
    doc.font("Helvetica-Bold").fontSize(8.5);
    const width = Math.min(doc.widthOfString(item) + 16, contentWidth(doc));
    if (x > left && x + width > maxX) {
      x = left;
      y += height + 5;
    }
    if (y + height > pageBottom(doc)) {
      doc.addPage();
      x = left;
      y = doc.y;
    }
    doc.lineWidth(0.8).roundedRect(x, y, width, height, 8.5).fillAndStroke(CHIP_BG, RULE);
    doc.fillColor(INK).font("Helvetica-Bold").fontSize(8.5).text(item, x + 8, y + 5, { width: width - 16, align: "center", lineBreak: false });
    x += width + 5;
  });
  doc.y = y + height + 6;
};

const withProtocol = (url) => /^https?:\/\//i.test(url) ? url : `https://${url}`;

const externalLink = (doc, url, label) => {
  const target = asText(url);
  if (!target) return;
  doc.font("Helvetica").fontSize(9).fillColor(MUTED)
    .text(label || target, doc.page.margins.left, doc.y, { width: contentWidth(doc), link: withProtocol(target), underline: true });
};

// Label/value pairs that are too thin to deserve their own section.
const factLines = (doc, facts) => {
  const rows = facts.filter((fact) => asText(fact.value));
  if (!rows.length) return;
  const left = doc.page.margins.left;
  const width = contentWidth(doc);
  rows.forEach((fact) => {
    ensureSpace(doc, 16);
    const startY = doc.y;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(MUTED).text(`${fact.label}`, left, startY, { width: 118 });
    const afterLabel = doc.y;
    doc.font("Helvetica").fontSize(9.5).fillColor(INK).text(asText(fact.value), left + 126, startY - 0.5, { width: width - 126, lineGap: 1.5 });
    doc.y = Math.max(afterLabel, doc.y) + 3;
  });
};

const contactBar = (doc, entries) => {
  if (!entries.length) return;
  const left = doc.page.margins.left;
  const width = contentWidth(doc);
  const fragments = [];
  entries.forEach((entry, index) => {
    if (index) fragments.push({ label: "  •  ", color: RULE });
    fragments.push(entry);
  });
  doc.font("Helvetica").fontSize(9);
  fragments.forEach((fragment, index) => {
    const options = { width, lineGap: 3, continued: index < fragments.length - 1, link: fragment.link || null, underline: false };
    doc.fillColor(fragment.color || (fragment.link ? INK : MUTED));
    if (index === 0) doc.text(fragment.label, left, doc.y, options);
    else doc.text(fragment.label, options);
  });
};

const drawHeader = (doc, { name, headline, contacts }) => {
  const left = doc.page.margins.left;
  const width = contentWidth(doc);
  doc.font("Helvetica-Bold").fontSize(24).fillColor(INK).text(name, left, doc.y, { width });
  if (headline) {
    doc.font("Helvetica").fontSize(11).fillColor(ACCENT).text(headline, left, doc.y + 2, { width });
  }
  doc.y += 5;
  contactBar(doc, contacts);
  const ruleY = doc.y + 8;
  doc.moveTo(left, ruleY).lineTo(left + width, ruleY).lineWidth(2).strokeColor(ACCENT).stroke();
  doc.y = ruleY + 13;
};

const drawFooters = (doc, name) => {
  const range = doc.bufferedPageRange();
  if (range.count < 2) return;
  for (let index = 0; index < range.count; index += 1) {
    doc.switchToPage(range.start + index);
    const y = doc.page.height - doc.page.margins.bottom + 16;
    // Writing inside the bottom margin would otherwise make PDFKit spill onto a
    // fresh page, so the margin is dropped for the width of the footer only.
    const bottomMargin = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.font("Helvetica").fontSize(8).fillColor(MUTED)
      .text(`${name}  •  Page ${index + 1} of ${range.count}`, doc.page.margins.left, y, { width: contentWidth(doc), align: "center", lineBreak: false });
    doc.page.margins.bottom = bottomMargin;
  }
};

const EDUCATION_LEVELS = [
  { key: "postGraduation", label: "Post Graduation" },
  { key: "graduation", label: "Graduation" },
  { key: "diploma", label: "Diploma" },
  { key: "twelfth", label: "Higher Secondary (12th)" },
  { key: "tenth", label: "Secondary (10th)" },
];

const scoreLabel = (detail = {}) => {
  if (Number(detail.cgpa) > 0) return `CGPA ${detail.cgpa}`;
  if (Number(detail.percentage) > 0) return `${detail.percentage}%`;
  return "";
};

const educationEntries = (profile) => {
  const education = profile.education || {};
  const entries = EDUCATION_LEVELS
    .map((level) => ({ level, detail: education[level.key] || {} }))
    .filter(({ detail }) => compact([detail.college, detail.university, detail.board, detail.branch, detail.cgpa, detail.percentage, detail.year, detail.passingYear]).length)
    .map(({ level, detail }) => ({
      title: joinParts([level.label, detail.branch], " — "),
      meta: asText(detail.passingYear || detail.year),
      institute: joinParts([detail.college, detail.board, detail.university], ", "),
      score: scoreLabel(detail),
    }));
  if (entries.length) return entries;

  // Some profiles only ever filled the flat academic block; without this the
  // resume would drop their education completely.
  const academics = profile.academicDetails || {};
  if (!compact([academics.college, academics.university, academics.branch, academics.cgpa, academics.percentage, academics.passingYear]).length) return [];
  return [{
    title: joinParts(["Graduation", academics.branch], " — "),
    meta: asText(academics.passingYear),
    institute: joinParts([academics.college, academics.university], ", "),
    score: scoreLabel(academics),
  }];
};

const buildResume = (profile = {}, user = {}) => {
  const academics = profile.academicDetails || {};
  const links = profile.socialLinks || {};
  const name = asText(profile.name) || asText(user.name) || asText(user.email) || "Candidate";
  const experience = Number(profile.totalExperience) > 0
    ? `${profile.totalExperience} year${Number(profile.totalExperience) === 1 ? "" : "s"} of experience`
    : "";

  return {
    name,
    fileName: `${sanitizeFileName(name)}-resume.pdf`,
    headline: joinParts([academics.branch, academics.college, experience]),
    contacts: compact([asText(user.email), asText(profile.mobile), asText(profile.address)]).map((label) => ({ label }))
      .concat(compact([links.linkedin, links.github, links.portfolio]).map((link) => ({
        label: link.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, ""),
        link: /^https?:\/\//i.test(link) ? link : `https://${link}`,
      }))),
    education: educationEntries(profile),
    technicalSkills: compact(profile.technicalSkills),
    softSkills: compact(profile.softSkills),
    languages: compact((profile.languages || []).map((item) => joinParts([item && item.language, item && item.proficiency], " — "))),
    internships: (profile.internships || [])
      .map((item) => ({
        title: joinParts([item && item.role, item && item.company], " — "),
        meta: asText(item && item.duration),
        description: asText(item && item.description),
      }))
      .filter((item) => item.title || item.description),
    projects: (profile.projects || [])
      .map((item) => ({
        title: asText(item && item.title),
        technologies: joinParts(compact(item && item.technologies), ", "),
        description: asText(item && item.description),
        link: asText(item && item.link),
      }))
      .filter((item) => item.title || item.description),
    certifications: (profile.certifications || [])
      .map((item) => ({
        title: asText(item && item.name),
        meta: formatDate(item && item.date),
        detail: asText(item && item.issuer),
        link: asText(item && item.link),
      }))
      .filter((item) => item.title),
    achievements: compact(profile.achievements),
    additional: [
      { label: "Preferred Location", value: joinParts(profile.preferredLocation, ", ") },
      { label: "Expected Salary", value: formatSalary(profile.expectedSalary) },
      { label: "Availability", value: asText(profile.currentStatus) },
      { label: "Placement Eligible", value: academics.placementEligibility === true ? "Yes" : academics.placementEligibility === false ? "No" : "" },
      { label: "Backlogs", value: joinParts([
        Number(academics.activeBacklogs) > 0 ? `${academics.activeBacklogs} active` : "",
        Number(academics.totalBacklogs) > 0 ? `${academics.totalBacklogs} total` : "",
      ], ", ") },
    ],
    personal: [
      { label: "Date of Birth", value: formatDate(profile.dob) },
      { label: "Gender", value: asText(profile.gender) },
      { label: "Address", value: asText(profile.address) },
    ],
  };
};

// Sections render only when they carry content, so a sparse profile produces a
// tight resume instead of a page of empty headings.
const renderBody = (doc, resume) => {
  if (resume.technicalSkills.length) {
    sectionTitle(doc, "Technical Skills");
    chipRow(doc, resume.technicalSkills);
  }

  if (resume.education.length) {
    sectionTitle(doc, "Education");
    resume.education.forEach((entry, index) => {
      ensureSpace(doc, 46);
      if (index) doc.y += 6;
      entryHeading(doc, entry.title, entry.meta);
      paragraph(doc, entry.institute, { size: 9.5 });
      paragraph(doc, entry.score, { size: 9, font: "Helvetica-Bold", color: INK });
    });
  }

  if (resume.internships.length) {
    sectionTitle(doc, "Experience & Internships");
    resume.internships.forEach((entry, index) => {
      ensureSpace(doc, 46);
      if (index) doc.y += 6;
      entryHeading(doc, entry.title, entry.meta);
      paragraph(doc, entry.description);
    });
  }

  if (resume.projects.length) {
    sectionTitle(doc, "Projects");
    resume.projects.forEach((entry, index) => {
      ensureSpace(doc, 46);
      if (index) doc.y += 6;
      entryHeading(doc, entry.title, "");
      paragraph(doc, entry.technologies, { size: 9, font: "Helvetica-Bold", color: ACCENT });
      paragraph(doc, entry.description, { color: INK });
      externalLink(doc, entry.link);
    });
  }

  if (resume.certifications.length) {
    sectionTitle(doc, "Certifications");
    resume.certifications.forEach((entry, index) => {
      ensureSpace(doc, 34);
      if (index) doc.y += 5;
      entryHeading(doc, entry.title, entry.meta);
      paragraph(doc, entry.detail, { size: 9 });
      externalLink(doc, entry.link, "View credential");
    });
  }

  if (resume.achievements.length) {
    sectionTitle(doc, "Achievements");
    resume.achievements.forEach((item) => {
      bulletLine(doc, item);
      doc.y += 2;
    });
  }

  if (resume.softSkills.length) {
    sectionTitle(doc, "Soft Skills");
    chipRow(doc, resume.softSkills);
  }

  if (resume.languages.length) {
    sectionTitle(doc, "Languages");
    chipRow(doc, resume.languages);
  }

  if (resume.additional.some((fact) => asText(fact.value))) {
    sectionTitle(doc, "Additional Information");
    factLines(doc, resume.additional);
  }

  if (resume.personal.some((fact) => asText(fact.value))) {
    sectionTitle(doc, "Personal Details");
    factLines(doc, resume.personal);
  }
};

// Resolves once PDFKit has flushed every chunk; the buffer is small enough that
// collecting it beats streaming straight to the response.
const generateResumePdf = (profile = {}, user = {}) => new Promise((resolve, reject) => {
  const resume = buildResume(profile, user);
  const doc = new PDFDocument({ size: "A4", margins: { top: 46, bottom: 46, left: 48, right: 48 }, bufferPages: true, info: { Title: `${resume.name} - Resume`, Author: resume.name } });
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("error", reject);
  doc.on("end", () => resolve({ buffer: Buffer.concat(chunks), fileName: resume.fileName }));

  try {
    drawHeader(doc, resume);
    renderBody(doc, resume);
    drawFooters(doc, resume.name);
    doc.end();
  } catch (error) {
    reject(error);
  }
});

module.exports = { generateResumePdf };
