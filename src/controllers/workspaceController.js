import Workspace from "../models/Workspace.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import WorkspaceCategory from "../models/WorkspaceCategory.js";
import Operator from "../models/Operator.js";



export const createWorkspace = async (req, res) => {
  try {
    const {
      name,
      category,
      subCategory,
      workspaceCategory, // 🆕
      operator, // 🆕
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

    // 🆕 optional validation — agar bheja gaya hai to check karo exist karta hai
    if (workspaceCategory) {
      const wcExists = await WorkspaceCategory.findById(workspaceCategory);
      if (!wcExists) {
        return res.status(404).json({
          success: false,
          message: "Workspace Category not found",
        });
      }
    }

    if (operator) {
      const opExists = await Operator.findById(operator);
      if (!opExists) {
        return res.status(404).json({
          success: false,
          message: "Operator not found",
        });
      }
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
      workspaceCategory: workspaceCategory || undefined, // 🆕
      operator: operator || undefined, // 🆕
      images,
      description,
      address,
      city,
      state,
      pincode,
      mapLink,
      plans: plans ? JSON.parse(plans) : [],
      amenities: amenities ? JSON.parse(amenities) : [],
      connectivity: connectivity ? JSON.parse(connectivity) : [],
      officeTiming: officeTiming ? JSON.parse(officeTiming) : [],
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
      .populate("workspaceCategory", "name") // 🆕
      .populate("operator", "name") // 🆕
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

    const simpleFields = [
      "name",
      "category",
      "subCategory",
       "workspaceCategory", 
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

    if (req.body.connectivity)
      workspace.connectivity = JSON.parse(req.body.connectivity);

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