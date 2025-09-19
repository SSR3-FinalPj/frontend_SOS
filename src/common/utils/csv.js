export function toCSV(rows, headersMap) {
  if (!Array.isArray(rows) || rows.length === 0) return "";
  const headers = headersMap || Object.keys(rows[0] || {});
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const headLine = Array.isArray(headers)
    ? headers.join(',')
    : Object.keys(headers).join(',');
  const pick = (row) => {
    if (Array.isArray(headers)) return headers.map((h) => esc(row[h]));
    return Object.keys(headers).map((h) => esc(row[headers[h]] ?? row[h]));
  };
  const lines = rows.map((r) => pick(r).join(','));
  return [headLine, ...lines].join('\n');
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

