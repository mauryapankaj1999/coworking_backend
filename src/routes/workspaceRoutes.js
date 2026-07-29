import express from "express";
import upload from "../middleware/upload.js";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getWorkspacesBySlug,
  getWorkspaceBySlug,
} from "../controllers/workspaceController.js";

const router = express.Router();

router.post("/", upload.array("images", 20), createWorkspace);
router.get("/", getWorkspaces);
router.get("/city/:citySlug/:subCategorySlug", getWorkspacesBySlug);
router.get("/city/:citySlug", getWorkspacesBySlug);
router.get("/slug/:slug", getWorkspaceBySlug); 
router.get("/:id", getWorkspace);
router.put("/:id", upload.array("images", 20), updateWorkspace);
router.delete("/:id", deleteWorkspace);

export default router;