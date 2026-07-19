/**
 * Helper untuk format response sukses yang konsisten
 * Sesuai arsitektur: { success: true, message: ..., data: ... }
 */
const apiResponse = {
  success: (res, statusCode = 200, message = 'Success', data = {}) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }
};

module.exports = apiResponse;