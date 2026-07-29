// import Category from "../models/Category.js";

// import slugify from "slugify";
// import cloudinary from "../config/cloudinary.js";



// export const createCategory = async (req, res) => {
//   try {
//     const { name } = req.body;

//     if (!name)
//       return res.status(400).json({
//         success: false,
//         message: "Category name is required",
//       });

//     if (!req.file)
//       return res.status(400).json({
//         success: false,
//         message: "Category image is required",
//       });

//     const exists = await Category.findOne({ name });

//     if (exists)
//       return res.status(400).json({
//         success: false,
//         message: "Category already exists",
//       });

//     const category = await Category.create({
//       name,
//       slug: slugify(name, { lower: true }),

//       image: {
//         url: req.file.path,
//         public_id: req.file.filename,
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "Category created successfully",
//       data: category,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // GET ALL CATEGORY

// export const getCategories = async (req, res) => {
//   try {
//     const categories = await Category.find().sort({
//       createdAt: -1,
//     });

//     res.json({
//       success: true,
//       count: categories.length,
//       data: categories,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // GET SINGLE CATEGORY

// export const getCategory = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);

//     if (!category)
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });

//     res.json({
//       success: true,
//       data: category,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // UPDATE CATEGORY

// export const updateCategory = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);

//     if (!category)
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });

//     if (req.body.name) {
//       category.name = req.body.name;
//       category.slug = slugify(req.body.name, {
//         lower: true,
//       });
//     }

//     if (req.file) {
//       if (category.image) {
//         const publicId = category.image.split("/").pop().split(".")[0];

//         await cloudinary.uploader.destroy(`workspace/categories/${publicId}`);
//       }

//       category.image = req.file.path;
//     }

//     if (req.body.status !== undefined) {
//       category.status = req.body.status;
//     }

//     await category.save();

//     res.json({
//       success: true,
//       message: "Category updated successfully",
//       data: category,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // DELETE CATEGORY

// export const deleteCategory = async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id);

//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });
//     }

//     if (category.image?.public_id) {
//       await cloudinary.uploader.destroy(category.image.public_id);
//     }

//     await category.deleteOne();

//     res.json({
//       success: true,
//       message: "Category deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

import Category from "../models/Category.js";

import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";


// CREATE CATEGORY

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });

    if (!req.file)
      return res.status(400).json({
        success: false,
        message: "Category image is required",
      });

    const exists = await Category.findOne({ name });

    if (exists)
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });

    const category = await Category.create({
        name,
        slug: slugify(name, { lower: true }),

        image: {
          url: req.file.path,
          public_id: req.file.filename,
        },
      });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// GET ALL CATEGORY

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// GET SINGLE CATEGORY

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category)
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// UPDATE CATEGORY

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category)
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });

    if (req.body.name) {
      category.name = req.body.name;
      category.slug = slugify(req.body.name, {
        lower: true,
      });
    }

    if (req.file) {
      if (category.image) {
        const publicId = category.image
          .split("/")
          .pop()
          .split(".")[0];

        await cloudinary.uploader.destroy(
          `workspace/categories/${publicId}`
        );
      }

      category.image = req.file.path;
    }

    if (req.body.status !== undefined) {
      category.status = req.body.status;
    }

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// DELETE CATEGORY

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category.image?.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// GET CATEGORY BY SLUG (NAYA — frontend city page ke liye)

export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      status: true,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};