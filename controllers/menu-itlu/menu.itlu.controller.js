import { MenuCategory } from "../../models/menu-itlu/schema.js";

export const getAllCategories = async (req, res) => {
  const data = await MenuCategory.find({});
  res.json(data);
};

export const addCategory = async (req, res) => {
  const category = await MenuCategory.create(req.body);
  res.json(category);
};

export const updateCategory = async (req, res) => {
  const { categoryId } = req.params;

  const updated = await MenuCategory.findOneAndUpdate(
    { id: categoryId },
    { $set: req.body },
    { new: true }
  );

  res.json(updated);
};

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  const deleted = await MenuCategory.findOneAndDelete({ id: categoryId });
  res.json({ success: true, deleted });
};

// ------------------------------
// SUBCATEGORY CONTROLLERS
// ------------------------------

export const addSubCategory = async (req, res) => {
  const { categoryId } = req.params;
  const subData = req.body;

  const updated = await MenuCategory.findOneAndUpdate(
    { id: categoryId },
    { $push: { subCategories: subData } },
    { new: true }
  );

  res.json(updated);
};

export const updateSubCategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.params;
  const update = req.body;

  const updated = await MenuCategory.findOneAndUpdate(
    { id: categoryId, "subCategories.id": subCategoryId },
    {
      $set: {
        "subCategories.$.name": update.name,
        "subCategories.$.id": update.id
      }
    },
    { new: true }
  );

  res.json(updated);
};

export const deleteSubCategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.params;

  const updated = await MenuCategory.findOneAndUpdate(
    { id: categoryId },
    { $pull: { subCategories: { id: subCategoryId } } },
    { new: true }
  );

  res.json(updated);
};

// ------------------------------
// MENU ITEM CONTROLLERS
// ------------------------------

export const addMenuItem = async (req, res) => {
  const { categoryId, subCategoryId } = req.params;

  const updated = await MenuCategory.findOneAndUpdate(
    { id: categoryId, "subCategories.id": subCategoryId },
    { $push: { "subCategories.$.items": req.body } },
    { new: true }
  );

  res.json(updated);
};

export const updateMenuItem = async (req, res) => {
  const { categoryId, subCategoryId, itemId } = req.params;

  const updated = await MenuCategory.findOneAndUpdate(
    {
      id: categoryId,
      "subCategories.id": subCategoryId,
      "subCategories.items.id": itemId
    },
    {
      $set: {
        "subCategories.$[sc].items.$[it]": req.body
      }
    },
    {
      new: true,
      arrayFilters: [
        { "sc.id": subCategoryId },
        { "it.id": itemId }
      ]
    }
  );

  res.json(updated);
};

export const deleteMenuItem = async (req, res) => {
  const { categoryId, subCategoryId, itemId } = req.params;

  const updated = await MenuCategory.findOneAndUpdate(
    { id: categoryId, "subCategories.id": subCategoryId },
    {
      $pull: { "subCategories.$.items": { id: itemId } }
    },
    { new: true }
  );

  res.json(updated);
};