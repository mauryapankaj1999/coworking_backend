import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    spaceType: {
      type: String,
    },
    seats: {
      type: String,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    workspaceName: {
      type: String,
    },
    operatorName: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;