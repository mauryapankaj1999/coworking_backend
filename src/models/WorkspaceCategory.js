import mongoose from "mongoose";

const workspaceCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
     description: {
      type: String,
      trim: true,
    },
   
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const WorkspaceCategory = mongoose.model("WorkspaceCategory", workspaceCategorySchema);

export default WorkspaceCategory;