import mongoose from "mongoose";

// ----------------------------
// Menu Item (Leaf level)
// ----------------------------
const MenuItemSchema = new mongoose.Schema(
    {
        id: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
        price: { type: Number, required: true, min: 0 },
        image: { type: String, default: "" },
        status: {
            type: String,
            enum: ["available", "unavailable"],
            default: "available",
        },
    },
);

// ----------------------------
// Sub-Category
// ----------------------------
const SubCategorySchema = new mongoose.Schema(
    {
        id: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        items: { type: [MenuItemSchema], default: [] },
    },

);

// ----------------------------
// Category (Top Level)
// ----------------------------
const CategorySchema = new mongoose.Schema(
    {
        id: { type: String, required: true, unique: true, trim: true },
        name: { type: String, required: true, trim: true },
        subCategories: { type: [SubCategorySchema], default: [] },
    },
    {
        timestamps: true,
    }
);

export const MenuCategory =
    mongoose.models.MenuCategory ||
    mongoose.model("MenuCategory", CategorySchema);
