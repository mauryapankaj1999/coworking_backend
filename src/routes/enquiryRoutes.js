import express from "express";
import {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
} from "../controllers/enquiryController.js";

const router = express.Router();

router.post("/", createEnquiry);
router.get("/", getEnquiries);
router.get("/:id", getEnquiry);
router.put("/:id", updateEnquiryStatus);
router.delete("/:id", deleteEnquiry);

export default router;