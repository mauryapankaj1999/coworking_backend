import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import errorHandler from "./middleware/error.middleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import subCategoryRoutes from "./routes/subCategoryRoutes.js";
import workspaceRoutes from "./routes/workspaceRoutes.js";
import blogRoutes from "./routes/blogRouters.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import workspacecategoriesRoutes from "./routes/workspacecategoryRoutes.js";
import operatorRoutes from "./routes/operatorRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api/admin", adminRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/sub-category", subCategoryRoutes);
app.use("/api/workspace", workspaceRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/testimonial", testimonialRoutes);
app.use("/api/workspacecategories", workspacecategoriesRoutes);
app.use("/api/operators", operatorRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use(errorHandler);

export default app;