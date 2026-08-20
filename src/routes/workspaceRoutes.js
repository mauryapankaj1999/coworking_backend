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

const uploadFields = upload.fields([
  { name: "images", maxCount: 20 },
  { name: "mainImages", maxCount: 5 },
]);

router.post("/", uploadFields, createWorkspace);

router.get("/", getWorkspaces);

router.get("/city/:citySlug/:subCategorySlug", getWorkspacesBySlug);
router.get("/city/:citySlug", getWorkspacesBySlug);

router.get("/slug/:slug", getWorkspaceBySlug);

router.get("/operator/:operatorId", getWorkspacesByOperator);

router.get("/:id", getWorkspace);

router.put("/:id", uploadFields, updateWorkspace);

router.delete("/:id", deleteWorkspace);

router.get("/workspacecategory/:categoryId", getWorkspacesByCategory);

router.get("/operator/slug/:slug", getWorkspacesByOperatorSlug);

export default router;