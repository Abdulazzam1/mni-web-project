/**
 * Generate URL slug dari string
 */
const toSlug = (text) =>
  text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

/**
 * Pagination helper
 */
const paginate = (page = 1, limit = 12) => {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(50, Math.max(1, parseInt(limit)));
  return { limit: l, offset: (p - 1) * l, page: p };
};

/**
 * Standard success response
 */
const sendSuccess = (res, data, message = 'Berhasil', statusCode = 200) => {
  res.status(statusCode).json({ success: true, message, data });
};

/**
 * Standard error response
 */
const sendError = (res, message = 'Terjadi kesalahan.', statusCode = 500) => {
  res.status(statusCode).json({ success: false, message });
};

module.exports = { toSlug, paginate, sendSuccess, sendError };