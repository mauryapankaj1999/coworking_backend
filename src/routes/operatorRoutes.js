import express from "express";
import {
  createOperator,
  deleteOperator,
  getOperators,
  getOperator,
  getOperatorBySlug,
  updateOperator,
} from "../controllers/operatorController.js";

const router = express.Router();

router.post("/", createOperator);
router.get("/", getOperators);
router.get("/slug/:slug", getOperatorBySlug);
router.get("/:id", getOperator);
router.put("/:id", updateOperator);
router.delete("/:id", deleteOperator);

export default router;