import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  getCategoryBySlug,
  updateCategory,
} from "../controllers/workspaceCategoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/", getCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;