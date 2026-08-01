const Joi = require('joi');

const verifySeller = Joi.object({
  aksi: Joi.string().valid('approve', 'reject', 'review').required().messages({
    'any.only': 'Aksi verifikasi tidak valid (harus approve, reject, atau review)',
    'any.required': 'Aksi verifikasi wajib diisi',
  }),
  alasan: Joi.string().allow('', null).optional(),
});

module.exports = {
  verifySeller,
};