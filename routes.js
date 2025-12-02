import { createServer } from "http";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "./controllers/menu-itlu/menu.itlu.controller.js";
import { upload } from "./config/s3config.js";
import dotenv from "dotenv";
dotenv.config();

async function registerRoutes(app) {
  // ----------------------
  // CATEGORY ROUTES
  // ----------------------
  app.get("/categories", getAllCategories);
  app.post("/categories", addCategory);
  app.put("/categories/:categoryId", updateCategory);
  app.delete("/categories/:categoryId", deleteCategory);

  // ----------------------
  // SUBCATEGORY ROUTES
  // ----------------------
  app.post("/categories/:categoryId/subcategories", addSubCategory);

  app.put(
    "/categories/:categoryId/subcategories/:subCategoryId",
    updateSubCategory
  );

  app.delete(
    "/categories/:categoryId/subcategories/:subCategoryId",
    deleteSubCategory
  );

  // ----------------------
  // MENU ITEM ROUTES (WITH IMAGE UPLOAD)
  // ----------------------
  app.post(
    "/categories/:categoryId/subcategories/:subCategoryId/items",
    upload.single("image"), // Multer middleware for single file upload
    addMenuItem
  );

  app.put(
    "/categories/:categoryId/subcategories/:subCategoryId/items/:itemId",
    upload.single("image"), // Image is optional for updates
    updateMenuItem
  );

  app.delete(
    "/categories/:categoryId/subcategories/:subCategoryId/items/:itemId",
    deleteMenuItem
  );

  const httpServer = createServer(app);
  return httpServer;
}

export { registerRoutes };
