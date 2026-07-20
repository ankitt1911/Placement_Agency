const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseSearchTerms = (value) => [...new Set(
  String(value || "")
    .split(/\r?\n/)
    .map((term) => term.trim())
    .filter(Boolean)
)];

const regexForTerm = (term) => new RegExp(escapeRegex(term), "i");

const buildAndSearch = (value, fields) => parseSearchTerms(value).map((term) => {
  const pattern = regexForTerm(term);
  return { $or: fields.map((field) => ({ [field]: pattern })) };
});

module.exports = { buildAndSearch, parseSearchTerms, regexForTerm };
