export const setFormInput = (value, field, formData, setFormData) => {
  setFormData({ ...formData, [field]: value });
};

export const buildSelectOptions = (list = [], labelKey, valueKey) => {
  return list.map((item) => ({
    label: item[labelKey],
    value: item[valueKey]
  }));
};

export const downloadBlob = (blobData, fileName) => {
  const blob = blobData instanceof Blob ? blobData : new Blob([blobData]);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const filterBySearch = (items, search, keys) => {
  const query = search.trim().toLowerCase();
  if (!query) return items;
  return items.filter((item) =>
    keys.some((key) => String(item[key] || "").toLowerCase().includes(query))
  );
};

export const paginate = (items, page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
};
