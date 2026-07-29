import express from "express";
import upload from "../middleware/upload.js";
import {
  createSubCategory,
  deleteSubCategory,
  getSingleSubCategory,
  getSubCategories,
  getSubCategoriesByCategory,
  getSubCategoriesByCitySlug,
  updateSubCategory,
} from "../controllers/subCategoryController.js";
const router = express.Router();
router.post("/", upload.single("image"), createSubCategory);
router.get("/", getSubCategories);
router.get("/category/:categoryId", getSubCategoriesByCategory);
router.get("/city/:citySlug", getSubCategoriesByCitySlug);
router.get("/:id", getSingleSubCategory);
router.put("/:id", upload.single("image"), updateSubCategory);
router.delete("/:id", deleteSubCategory);
export default router;