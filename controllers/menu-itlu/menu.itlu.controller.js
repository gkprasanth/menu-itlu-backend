import { deleteImageFromS3 } from "../../config/s3utils.js";
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
        "subCategories.$.id": update.id,
      },
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
// MENU ITEM CONTROLLERS (WITH S3)
// ------------------------------

export const addMenuItem = async (req, res) => {
  try {
    const { categoryId, subCategoryId } = req.params;

    // Get image URL from uploaded file (if exists)
    const imageUrl = req.file ? req.file.location : "";

    const itemData = {
      ...req.body,
      image: imageUrl,
    };

    const updated = await MenuCategory.findOneAndUpdate(
      { id: categoryId, "subCategories.id": subCategoryId },
      { $push: { "subCategories.$.items": itemData } },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { categoryId, subCategoryId, itemId } = req.params;

    // Find existing item to get old image URL
    const category = await MenuCategory.findOne({
      id: categoryId,
      "subCategories.id": subCategoryId,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = category.subCategories.find(
      (sc) => sc.id === subCategoryId
    );
    const existingItem = subCategory?.items.find((item) => item.id === itemId);

    // Handle image update
    let imageUrl = existingItem?.image || "";

    if (req.file) {
      // New image uploaded
      imageUrl = req.file.location;

      // Delete old image from S3 if exists
      if (existingItem?.image) {
        await deleteImageFromS3(existingItem.image);
      }
    } else if (req.body.image !== undefined) {
      // Image URL provided in body (or explicitly set to empty)
      imageUrl = req.body.image;
    }

    const updateData = {
      ...req.body,
      image: imageUrl,
    };

    const updated = await MenuCategory.findOneAndUpdate(
      {
        id: categoryId,
        "subCategories.id": subCategoryId,
        "subCategories.items.id": itemId,
      },
      {
        $set: {
          "subCategories.$[sc].items.$[it]": updateData,
        },
      },
      {
        new: true,
        arrayFilters: [{ "sc.id": subCategoryId }, { "it.id": itemId }],
      }
    );

    res.json(updated);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { categoryId, subCategoryId, itemId } = req.params;

    // Find the item first to get image URL
    const category = await MenuCategory.findOne({
      id: categoryId,
      "subCategories.id": subCategoryId,
    });

    if (category) {
      const subCategory = category.subCategories.find(
        (sc) => sc.id === subCategoryId
      );
      const item = subCategory?.items.find((item) => item.id === itemId);

      // Delete image from S3 if exists
      if (item?.image) {
        await deleteImageFromS3(item.image);
      }
    }

    const updated = await MenuCategory.findOneAndUpdate(
      { id: categoryId, "subCategories.id": subCategoryId },
      {
        $pull: { "subCategories.$.items": { id: itemId } },
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ message: error.message });
  }
};
