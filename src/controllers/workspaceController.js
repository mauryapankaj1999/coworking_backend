// import Workspace from "../models/Workspace.js";
// import Category from "../models/Category.js";
// import SubCategory from "../models/SubCategory.js";

// import slugify from "slugify";
// import cloudinary from "../config/cloudinary.js";

// export const createWorkspace = async (req, res) => {
//   try {
//     const {
//       name,
//       category,
//       subCategory,
//       shortDescription,
//       description,
//       address,
//       city,
//       state,
//       pincode,
//       latitude,
//       longitude,
//       plans,
//       amenities,
//       community,
//       officeTiming,
//       featured,
//       status,
//     } = req.body;

//     if (
//       !name ||
//       !category ||
//       !subCategory ||
//       !shortDescription ||
//       !description
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields are missing",
//       });
//     }

//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Workspace images are required",
//       });
//     }

//     const categoryExists = await Category.findById(category);

//     if (!categoryExists) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     const subCategoryExists = await SubCategory.findById(subCategory);

//     if (!subCategoryExists) {
//       return res.status(404).json({
//         success: false,
//         message: "Sub Category not found",
//       });
//     }

//     const images = req.files.map((file) => ({
//       url: file.path,
//       public_id: file.filename,
//     }));

//     const workspace = await Workspace.create({
//       name,
//       slug: slugify(name, { lower: true }),

//       category,
//       subCategory,

//       images,

//       shortDescription,
//       description,

//       address,
//       city,
//       state,
//       pincode,

//       latitude,
//       longitude,

//       plans: plans ? JSON.parse(plans) : [],

//       amenities: amenities
//         ? JSON.parse(amenities)
//         : [],

//       community: community
//         ? JSON.parse(community)
//         : [],

//       officeTiming: officeTiming
//         ? JSON.parse(officeTiming)
//         : {},

//       featured,

//       status,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Workspace Created Successfully",
//       data: workspace,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getWorkspaces = async (req, res) => {
//   try {
//     const workspaces = await Workspace.find()
//       .populate("category", "name")
//       .populate("subCategory", "name")
//       .sort({
//         createdAt: -1,
//       });

//     res.json({
//       success: true,
//       count: workspaces.length,
//       data: workspaces,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getWorkspace = async (req, res) => {
//   try {
//     const workspace = await Workspace.findById(req.params.id)
//       .populate("category", "name")
//       .populate("subCategory", "name");

//     if (!workspace) {
//       return res.status(404).json({
//         success: false,
//         message: "Workspace not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: workspace,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const updateWorkspace = async (req, res) => {
//   try {
//     const workspace = await Workspace.findById(req.params.id);

//     if (!workspace) {
//       return res.status(404).json({
//         success: false,
//         message: "Workspace not found",
//       });
//     }

//     const simpleFields = [
//       "name",
//       "category",
//       "subCategory",
//       "shortDescription",
//       "description",
//       "address",
//       "city",
//       "state",
//       "pincode",
//       "latitude",
//       "longitude",
//       "featured",
//       "status",
//     ];

//     simpleFields.forEach((field) => {
//       if (req.body[field] !== undefined) {
//         workspace[field] = req.body[field];
//       }
//     });

//     if (req.body.name) {
//       workspace.slug = slugify(req.body.name, {
//         lower: true,
//       });
//     }

//     if (req.body.plans)
//       workspace.plans = JSON.parse(req.body.plans);

//     if (req.body.amenities)
//       workspace.amenities = JSON.parse(req.body.amenities);

//     if (req.body.community)
//       workspace.community = JSON.parse(req.body.community);

//     if (req.body.officeTiming)
//       workspace.officeTiming = JSON.parse(req.body.officeTiming);

//     if (req.files && req.files.length > 0) {
//       for (const image of workspace.images) {
//         await cloudinary.uploader.destroy(image.public_id);
//       }

//       workspace.images = req.files.map((file) => ({
//         url: file.path,
//         public_id: file.filename,
//       }));
//     }

//     await workspace.save();

//     res.json({
//       success: true,
//       message: "Workspace Updated Successfully",
//       data: workspace,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const deleteWorkspace = async (req, res) => {
//   try {
//     const workspace = await Workspace.findById(req.params.id);

//     if (!workspace) {
//       return res.status(404).json({
//         success: false,
//         message: "Workspace not found",
//       });
//     }

//     for (const image of workspace.images) {
//       await cloudinary.uploader.destroy(
//         image.public_id
//       );
//     }

//     await workspace.deleteOne();

//     res.json({
//       success: true,
//       message: "Workspace Deleted Successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

import Workspace from "../models/Workspace.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";

export const createWorkspace = async (req, res) => {
  try {
    const {
      name,
      category,
      subCategory,
      shortDescription,
      description,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      plans,
      amenities,
      community,
      officeTiming,
      featured,
      status,
    } = req.body;

    if (
      !name ||
      !category ||
      !subCategory ||
      !shortDescription ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Workspace images are required",
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const subCategoryExists = await SubCategory.findById(subCategory);

    if (!subCategoryExists) {
      return res.status(404).json({
        success: false,
        message: "Sub Category not found",
      });
    }

    const images = req.files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    const workspace = await Workspace.create({
      name,
      slug: slugify(name, { lower: true }),

      category,
      subCategory,

      images,

      shortDescription,
      description,

      address,
      city,
      state,
      pincode,

      latitude,
      longitude,

      plans: plans ? JSON.parse(plans) : [],

      amenities: amenities ? JSON.parse(amenities) : [],

      community: community ? JSON.parse(community) : [],

      officeTiming: officeTiming ? JSON.parse(officeTiming) : {},

      featured,

      status,
    });

    res.status(201).json({
      success: true,
      message: "Workspace Created Successfully",
      data: workspace,
    });
  } catch (error) {
    res.status(500).json({
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
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: workspaces.length,
      data: workspaces,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("category", "name")
      .populate("subCategory", "name");

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
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

    const simpleFields = [
      "name",
      "category",
      "subCategory",
      "shortDescription",
      "description",
      "address",
      "city",
      "state",
      "pincode",
      "latitude",
      "longitude",
      "featured",
      "status",
    ];

    simpleFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        workspace[field] = req.body[field];
      }
    });

    if (req.body.name) {
      workspace.slug = slugify(req.body.name, {
        lower: true,
      });
    }

    if (req.body.plans) workspace.plans = JSON.parse(req.body.plans);

    if (req.body.amenities)
      workspace.amenities = JSON.parse(req.body.amenities);

    if (req.body.community)
      workspace.community = JSON.parse(req.body.community);

    if (req.body.officeTiming)
      workspace.officeTiming = JSON.parse(req.body.officeTiming);

    if (req.files && req.files.length > 0) {
      for (const image of workspace.images) {
        await cloudinary.uploader.destroy(image.public_id);
      }

      workspace.images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    await workspace.save();

    res.json({
      success: true,
      message: "Workspace Updated Successfully",
      data: workspace,
    });
  } catch (error) {
    res.status(500).json({
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

// GET WORKSPACES BY CITY SLUG + OPTIONAL SUBCATEGORY SLUG (NAYA)
export const getWorkspacesBySlug = async (req, res) => {
  try {
    const { citySlug, subCategorySlug } = req.params;

    const category = await Category.findOne({
      slug: citySlug,
      status: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "City not found",
      });
    }

    const filter = {
      category: category._id,
      status: true,
    };

    if (subCategorySlug) {
      const subCategory = await SubCategory.findOne({
        slug: subCategorySlug,
        status: true,
      });

      if (!subCategory) {
        return res.status(404).json({
          success: false,
          message: "Location not found",
        });
      }

      filter.subCategory = subCategory._id;
    }

    const workspaces = await Workspace.find(filter)
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: workspaces.length,
      data: workspaces,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE WORKSPACE BY SLUG (NAYA — details page ke liye)
export const getWorkspaceBySlug = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      slug: req.params.slug,
      status: true,
    })
      .populate("category", "name slug")
      .populate("subCategory", "name slug");

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
