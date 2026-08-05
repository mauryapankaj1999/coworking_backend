import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    image: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },

    Description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
