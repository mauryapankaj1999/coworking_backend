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
  getWorkspacesByOperator,
  getWorkspacesByCategory,
  getWorkspacesByOperatorSlug,
} from "../controllers/workspaceController.js";

const router = express.Router();

router.post("/", upload.array("images", 20), createWorkspace);
router.get("/", getWorkspaces);
router.get("/city/:citySlug/:subCategorySlug", getWorkspacesBySlug);
router.get("/city/:citySlug", getWorkspacesBySlug);
router.get("/slug/:slug", getWorkspaceBySlug); 
router.get("/operator/:operatorId", getWorkspacesByOperator);
router.get("/:id", getWorkspace);
router.put("/:id", upload.array("images", 20), updateWorkspace);
router.delete("/:id", deleteWorkspace);
router.get("/workspacecategory/:categoryId", getWorkspacesByCategory);
router.get("/operator/slug/:slug", getWorkspacesByOperatorSlug);
// router.get("/operator/:operatorId", getWorkspacesByOperator);
export default router;