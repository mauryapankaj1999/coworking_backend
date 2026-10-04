import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },

    // Multiple Images
    images: [
      {
        url: {
          type: String,
          required: true,
        },

        public_id: {
          type: String,
          required: true,
        },
      },
    ],
    mainImages: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],

    // Description

    description: {
      type: String,
      required: true,
    },

    // Address
    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    mapLink: {
      type: String,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
    },

    workspaceCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkspaceCategory",
      },
    ],
    is24x7: {
      type: Boolean,
      default: false,
    },

    operator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator",
    },
    plans: [
      {
        title: String,

        price: Number,

        description: String,
      },
    ],

    // Amenities
    amenities: [
      {
        type: String,
      },
    ],

    connectivity: [
      {
        type: String,
      },
    ],

    // Office Timing
    officeTiming: [
      {
        label: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],

    featured: {
      type: Boolean,
      default: false,
    },

   status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},
  },
  {
    timestamps: true,
  },
);

workspaceSchema.index({
  category: 1,
  status: 1,
  createdAt: -1,
});

workspaceSchema.index({
  category: 1,
  subCategory: 1,
  status: 1,
  createdAt: -1,
});

workspaceSchema.index({
  operator: 1,
  status: 1,
  createdAt: -1,
});

workspaceSchema.index({
  workspaceCategory: 1,
  status: 1,
  createdAt: -1,
});

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
