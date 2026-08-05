import express from "express";
import upload from "../middleware/upload.js";
import {
  createBlog,
  getBlogs,
  getBlog,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

const router = express.Router();

router.post("/", upload.single("image"), createBlog);
router.get("/", getBlogs);
router.get("/slug/:slug", getBlogBySlug);
router.get("/:id", getBlog);
router.put("/:id", upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);

export default router;