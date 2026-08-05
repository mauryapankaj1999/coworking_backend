import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  getCategoryBySlug,
  updateCategory,
} from "../controllers/categoryController.js";

import upload from "../middleware/upload.js";
const router = express.Router();
router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/slug/:slug", getCategoryBySlug);
router.get("/:id", getCategory);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);
export default router;