// import slugify from "slugify";
// import cloudinary from "../config/cloudinary.js";

// import Category from "../models/Category.js";
// import SubCategory from "../models/SubCategory.js";

// // CREATE

// export const createSubCategory = async (req, res) => {
//   try {
//     const { category, name } = req.body;

//     if (!category || !name) {
//       return res.status(400).json({
//         success: false,
//         message: "Category and Name are required",
//       });
//     }

//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: "Image is required",
//       });
//     }

//     const categoryExists = await Category.findById(category);

//     if (!categoryExists) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     const exists = await SubCategory.findOne({
//       category,
//       name,
//     });

//     if (exists) {
//       return res.status(400).json({
//         success: false,
//         message: "SubCategory already exists",
//       });
//     }

//     const subCategory = await SubCategory.create({
//       category,

//       name,

//       slug: slugify(name, {
//         lower: true,
//       }),

//       image: {
//         url: req.file.path,
//         public_id: req.file.filename,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "SubCategory Created Successfully",
//       data: subCategory,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // GET ALL

// export const getSubCategories = async (req, res) => {
//   try {
//     const subCategories = await SubCategory.find()
//       .populate("category", "name")
//       .sort({
//         createdAt: -1,
//       });

//     res.json({
//       success: true,
//       count: subCategories.length,
//       data: subCategories,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // GET SINGLE

// export const getSingleSubCategory = async (
//   req,
//   res
// ) => {
//   try {
//     const subCategory = await SubCategory.findById(
//       req.params.id
//     ).populate("category", "name");

//     if (!subCategory) {
//       return res.status(404).json({
//         success: false,
//         message: "SubCategory not found",
//       });
//     }

//     res.json({
//       success: true,
//       data: subCategory,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // UPDATE

// export const updateSubCategory = async (
//   req,
//   res
// ) => {
//   try {
//     const subCategory = await SubCategory.findById(
//       req.params.id
//     );

//     if (!subCategory) {
//       return res.status(404).json({
//         success: false,
//         message: "SubCategory not found",
//       });
//     }

//     if (req.body.name) {
//       subCategory.name = req.body.name;

//       subCategory.slug = slugify(req.body.name, {
//         lower: true,
//       });
//     }

//     if (req.body.category) {
//       subCategory.category = req.body.category;
//     }

//     if (req.body.status !== undefined) {
//       subCategory.status = req.body.status;
//     }

//     if (req.file) {
//       if (subCategory.image?.public_id) {
//         await cloudinary.uploader.destroy(
//           subCategory.image.public_id
//         );
//       }

//       subCategory.image = {
//         url: req.file.path,
//         public_id: req.file.filename,
//       };
//     }

//     await subCategory.save();

//     res.json({
//       success: true,
//       message: "SubCategory Updated Successfully",
//       data: subCategory,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // DELETE

// export const deleteSubCategory = async (
//   req,
//   res
// ) => {
//   try {
//     const subCategory = await SubCategory.findById(
//       req.params.id
//     );

//     if (!subCategory) {
//       return res.status(404).json({
//         success: false,
//         message: "SubCategory not found",
//       });
//     }

//     if (subCategory.image?.public_id) {
//       await cloudinary.uploader.destroy(
//         subCategory.image.public_id
//       );
//     }

//     await subCategory.deleteOne();

//     res.json({
//       success: true,
//       message: "SubCategory Deleted Successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // GET BY CATEGORY
// export const getSubCategoriesByCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;

//     const subCategories = await SubCategory.find({
//       category: categoryId,
//       status: true,
//     }).sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       count: subCategories.length,
//       data: subCategories,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";

import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";

// CREATE

export const createSubCategory = async (req, res) => {
  try {
    const { category, name } = req.body;

    if (!category || !name) {
      return res.status(400).json({
        success: false,
        message: "Category and Name are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const exists = await SubCategory.findOne({
      category,
      name,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "SubCategory already exists",
      });
    }

    const subCategory = await SubCategory.create({
      category,

      name,

      slug: slugify(name, {
        lower: true,
      }),

      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.status(201).json({
      success: true,
      message: "SubCategory Created Successfully",
      data: subCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL

export const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate("category", "name")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: subCategories.length,
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE

export const getSingleSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate(
      "category",
      "name",
    );

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    res.json({
      success: true,
      data: subCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE

export const updateSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    if (req.body.name) {
      subCategory.name = req.body.name;

      subCategory.slug = slugify(req.body.name, {
        lower: true,
      });
    }

    if (req.body.category) {
      subCategory.category = req.body.category;
    }

    if (req.body.status !== undefined) {
      subCategory.status = req.body.status;
    }

    if (req.file) {
      if (subCategory.image?.public_id) {
        await cloudinary.uploader.destroy(subCategory.image.public_id);
      }

      subCategory.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await subCategory.save();

    res.json({
      success: true,
      message: "SubCategory Updated Successfully",
      data: subCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE

export const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
      return res.status(404).json({
        success: false,
        message: "SubCategory not found",
      });
    }

    if (subCategory.image?.public_id) {
      await cloudinary.uploader.destroy(subCategory.image.public_id);
    }

    await subCategory.deleteOne();

    res.json({
      success: true,
      message: "SubCategory Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BY CATEGORY (id se — admin dropdown ke liye, jaisa hai waisa hi)
export const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const subCategories = await SubCategory.find({
      category: categoryId,
      status: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: subCategories.length,
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BY CITY SLUG (NAYA — frontend city page ke liye, e.g. /coworking/delhi)
export const getSubCategoriesByCitySlug = async (req, res) => {
  try {
    const { citySlug } = req.params;

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

    const subCategories = await SubCategory.find({
      category: category._id,
      status: true,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      category,
      count: subCategories.length,
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
