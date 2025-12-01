const { z } = require("zod");

// All fields optional; accept null or undefined. Categories may be null or an empty array.
// Using nullish() allows both undefined and null for each primitive.
const insertMenuItemSchema = z.object({
  title: z.string().nullish(),
  description: z.string().nullish(),
  price: z.number().nullish(),
  imageUrl: z.string().nullish(),
  fallbackImagePath: z.string().nullish(),
  categories: z.array(z.string()).nullish(),
}).strict();

module.exports = { insertMenuItemSchema };
