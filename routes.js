import { createServer } from "http";
import { getAllCategories, addCategory, updateCategory, deleteCategory, addSubCategory, updateSubCategory, deleteSubCategory, addMenuItem, updateMenuItem, deleteMenuItem } from "./controllers/menu-itlu/menu.itlu.controller.js";

async function registerRoutes(app) {





 app.get("/categories", getAllCategories);
  app.post("/categories", addCategory);
  app.put("/categories/:categoryId", updateCategory);
  app.delete("/categories/:categoryId", deleteCategory);

  // ----------------------
  // SUBCATEGORY ROUTES
  // ----------------------
  app.post(
    "/categories/:categoryId/subcategories",
    addSubCategory
  );

  app.put(
    "/categories/:categoryId/subcategories/:subCategoryId",
    updateSubCategory
  );

  app.delete(
    "/categories/:categoryId/subcategories/:subCategoryId",
    deleteSubCategory
  );

  // ----------------------
  // MENU ITEM ROUTES
  // ----------------------
  app.post(
    "/categories/:categoryId/subcategories/:subCategoryId/items",
    addMenuItem
  );

  app.put(
    "/categories/:categoryId/subcategories/:subCategoryId/items/:itemId",
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
