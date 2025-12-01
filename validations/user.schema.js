const { z } = require("zod");

const insertUserSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

module.exports = { insertUserSchema };
