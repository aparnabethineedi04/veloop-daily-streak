const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(100),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1).max(100),
});

// Only `day` is read from the claim body (as an intent). Any other field is ignored.
const claimSchema = z
  .object({ day: z.coerce.number().int().min(1).max(365).optional() })
  .passthrough();

const historyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

module.exports = { registerSchema, loginSchema, claimSchema, historyQuerySchema };
