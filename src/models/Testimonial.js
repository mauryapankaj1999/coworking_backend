import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
      default: "",
    },

    company: {
      type: String,
      trim: true,
      default: "",
    },

    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },

    image: {
      public_id: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
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

export default mongoose.model("Testimonial", testimonialSchema);