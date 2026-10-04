import Workspace from "../models/Workspace.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import WorkspaceCategory from "../models/WorkspaceCategory.js";
import Operator from "../models/Operator.js";




export const createWorkspace = async (req, res) => {
  try {
    console.log("========== WORKSPACE CREATE ==========");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    console.log("IMAGES:", req.files?.images);
    console.log("MAIN IMAGES:", req.files?.mainImages);

    const {
      name,
      category,
      subCategory,
      workspaceCategory,
      operator,
      description,
      address,
      city,
      state,
      pincode,
      mapLink,
      plans,
      amenities,
      connectivity,
      officeTiming,
      featured,
      status,
    } = req.body;


    if (!name || !category || !subCategory || !description) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    if (!req.files?.images || req.files.images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Workspace images are required",
      });
    }


    if (!req.files?.mainImages || req.files.mainImages.length !== 5) {
      return res.status(400).json({
        success: false,
        message: "Exactly 5 main images are required",
      });
    }


    let workspaceCategories = [];

    if (workspaceCategory) {
      try {
        // Agar already array hai
        if (Array.isArray(workspaceCategory)) {
          workspaceCategories = workspaceCategory;
        }
        // Agar JSON string aa rahi hai
        else if (typeof workspaceCategory === "string") {
          const parsed = JSON.parse(workspaceCategory);

          if (Array.isArray(parsed)) {
            workspaceCategories = parsed;
          } else {
            workspaceCategories = [workspaceCategory];
          }
        }
      } catch (error) {
        workspaceCategories = [workspaceCategory];
      }
    }

    console.log(
      "WORKSPACE CATEGORIES:",
      workspaceCategories
    );


    const images = req.files.images.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

  

    const mainImages = req.files.mainImages.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));


    const workspace = await Workspace.create({
      name,

      slug: slugify(name, {
        lower: true,
      }),

      category,

      subCategory,

      // MULTIPLE WORKSPACE CATEGORIES
      workspaceCategory: workspaceCategories,

      operator: operator || undefined,

      images,

      mainImages,

      description,

      address,

      city,

      state,

      pincode,

      mapLink,

      plans: plans
        ? JSON.parse(plans)
        : [],

      amenities: amenities
        ? JSON.parse(amenities)
        : [],

      connectivity: connectivity
        ? JSON.parse(connectivity)
        : [],

      officeTiming: officeTiming
        ? JSON.parse(officeTiming)
        : [],

      featured,

      status,
    });


    return res.status(201).json({
      success: true,
      message: "Workspace Created Successfully",
      data: workspace,
    });

  } catch (error) {
    console.log("CREATE WORKSPACE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("workspaceCategory", "name")
      .populate("operator", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: workspaces.length,
      data: workspaces,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("workspaceCategory", "name") 
      .populate("operator", "name"); 

    if (!workspace) {
      return res.status(404).json({ success: false, message: "Workspace not found" });
    }

    res.json({ success: true, data: workspace });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }
    const objectIdFields = [
      "category",
      "subCategory",
      "operator",
    ];

    const simpleFields = [
      "name",
      "category",
      "subCategory",
      "operator",
      "description",
      "address",
      "city",
      "state",
      "pincode",
      "mapLink",
      "featured",
      "status",
    ];
    simpleFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        const value = req.body[field];

        // ObjectId fields
        if (objectIdFields.includes(field)) {
          if (
            value === "" ||
            value === null ||
            value === "null" ||
            value === "undefined"
          ) {
            workspace[field] = undefined;
          } else {
            workspace[field] = value;
          }
        } else {
          // Normal fields
          workspace[field] = value;
        }
      }
    });

    if (req.body.workspaceCategory !== undefined) {
      try {
        let workspaceCategories = req.body.workspaceCategory;

        console.log(
          "RAW workspaceCategory:",
          workspaceCategories
        );

        // FormData se string aa sakti hai
        if (typeof workspaceCategories === "string") {
          workspaceCategories = JSON.parse(workspaceCategories);
        }

        // Agar single ID aa gayi ho
        if (!Array.isArray(workspaceCategories)) {
          workspaceCategories = [workspaceCategories];
        }

        // Nested arrays remove + empty values remove
        workspaceCategories = workspaceCategories
          .flat(Infinity)
          .filter(
            (id) =>
              id &&
              id !== "null" &&
              id !== "undefined" &&
              id !== ""
          );

        console.log(
          "FINAL workspaceCategories:",
          workspaceCategories
        );

        workspace.workspaceCategory = workspaceCategories;
      } catch (error) {
        console.error(
          "workspaceCategory parse error:",
          error
        );

        return res.status(400).json({
          success: false,
          message: "Invalid workspaceCategory",
        });
      }
    }

    if (req.body.name) {
      workspace.slug = slugify(req.body.name, {
        lower: true,
        strict: true,
      });
    }

    if (req.body.plans !== undefined) {
      try {
        workspace.plans =
          typeof req.body.plans === "string"
            ? JSON.parse(req.body.plans)
            : req.body.plans;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid plans JSON",
        });
      }
    }


    if (req.body.amenities !== undefined) {
      try {
        workspace.amenities =
          typeof req.body.amenities === "string"
            ? JSON.parse(req.body.amenities)
            : req.body.amenities;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid amenities JSON",
        });
      }
    }

 
    if (req.body.connectivity !== undefined) {
      try {
        workspace.connectivity =
          typeof req.body.connectivity === "string"
            ? JSON.parse(req.body.connectivity)
            : req.body.connectivity;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid connectivity JSON",
        });
      }
    }

   
    if (req.body.officeTiming !== undefined) {
      try {
        workspace.officeTiming =
          typeof req.body.officeTiming === "string"
            ? JSON.parse(req.body.officeTiming)
            : req.body.officeTiming;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid officeTiming JSON",
        });
      }
    }

    if (
      req.files?.images &&
      req.files.images.length > 0
    ) {
      // Delete old images from Cloudinary
      for (const image of workspace.images || []) {
        if (image.public_id) {
          try {
            await cloudinary.uploader.destroy(
              image.public_id
            );
          } catch (error) {
            console.log(
              "Old gallery image delete error:",
              error.message
            );
          }
        }
      }

      // Add new images
      workspace.images = req.files.images.map(
        (file) => ({
          url: file.path,
          public_id: file.filename,
        })
      );
    }


    if (
      req.files?.mainImages &&
      req.files.mainImages.length > 0
    ) {
      // Delete old main images from Cloudinary
      for (const image of workspace.mainImages || []) {
        if (image.public_id) {
          try {
            await cloudinary.uploader.destroy(
              image.public_id
            );
          } catch (error) {
            console.log(
              "Old main image delete error:",
              error.message
            );
          }
        }
      }

      // Add new main images
      workspace.mainImages =
        req.files.mainImages.map((file) => ({
          url: file.path,
          public_id: file.filename,
        }));
    }

    
    await workspace.save();

 
    return res.status(200).json({
      success: true,
      message: "Workspace Updated Successfully",
      data: workspace,
    });
  } catch (error) {
    console.error(
      "Update Workspace Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    for (const image of workspace.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await workspace.deleteOne();

    res.json({
      success: true,
      message: "Workspace Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getWorkspacesBySlug = async (req, res) => {
  try {
    const { citySlug, subCategorySlug } = req.params;

    // Pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 24);

    const skip = (page - 1) * limit;

    // Find city/category
    const category = await Category.findOne({
      slug: citySlug,
      status: true,
    })
      .select("_id name slug")
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    // Base filter
    const filter = {
      category: category._id,
      status: "approved",
    };

    // If sub-category/location selected
    if (subCategorySlug) {
      const subCategory = await SubCategory.findOne({
        slug: subCategorySlug,
        status: true,
      })
        .select("_id name slug")
        .lean();

      if (!subCategory) {
        return res.status(404).json({
          success: false,
          message: "Location not found",
        });
      }

      filter.subCategory = subCategory._id;
    }

    // Get workspace data + total count together
    const [workspaces, total] = await Promise.all([
      Workspace.find(filter)
        .select(
          "_id name slug featured address city state plans images category subCategory createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Workspace.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,

      count: workspaces.length,

      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },

      data: workspaces,
    });
  } catch (error) {
    console.error("GET WORKSPACES BY SLUG ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





export const getWorkspaceBySlug = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      slug: req.params.slug,
      status: "approved",
    })
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .populate("workspaceCategory", "name")
      .populate("operator", "name slug")
      .lean();

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    res.json({
      success: true,
      data: workspace,
    });
  } catch (error) {
    console.error("GET WORKSPACE BY SLUG ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWorkspacesByOperator = async (req, res) => {
  try {
    const { operatorId } = req.params;

    const operatorExists = await Operator.findById(operatorId);
    if (!operatorExists) {
      return res.status(404).json({
        success: false,
        message: "Operator not found",
      });
    }

    const workspaces = await Workspace.find({ operator: operatorId, status: true })
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .populate("workspaceCategory", "name")
      .populate("operator", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: workspaces.length,
      data: workspaces,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getWorkspacesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const categoryExists = await WorkspaceCategory.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Workspace Category not found",
      });
    }

    const workspaces = await Workspace.find({
      workspaceCategory: categoryId,
      status: true,
    })
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .populate("workspaceCategory", "name")
      .populate("operator", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: workspaces.length,
      data: workspaces,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getWorkspacesByOperatorSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const operator = await Operator.findOne({ slug, status: true });

    if (!operator) {
      return res.status(404).json({
        success: false,
        message: "Operator not found",
      });
    }

    const workspaces = await Workspace.find({
      operator: operator._id,
      status: true,
    })
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .populate("workspaceCategory", "name")
      .populate("operator", "name slug")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      operator,
      count: workspaces.length,
      data: workspaces,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};