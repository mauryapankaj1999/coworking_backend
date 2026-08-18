import slugify from "slugify";
import WorkspaceCategory from "../models/WorkspaceCategory.js";


export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name)
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });

    const exists = await WorkspaceCategory.findOne({ name });

    if (exists)
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });

    const category = await WorkspaceCategory.create({
      name,
      description,
      slug: slugify(name, { lower: true }),
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

export const getCategories = async (req, res) => {
  try {
    const categories = await WorkspaceCategory.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await WorkspaceCategory.findById(id);

    if (!category)
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });

    res.status(200).json({
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

export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await WorkspaceCategory.findOne({ slug });

    if (!category)
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });

    res.status(200).json({
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

// export const updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name } = req.body;

//     const category = await WorkspaceCategory.findById(id);

//     if (!category)
//       return res.status(404).json({
//         success: false,
//         message: "Category not found",
//       });

//     if (name) {
//       const exists = await WorkspaceCategory.findOne({ name, _id: { $ne: id } });
//       if (exists)
//         return res.status(400).json({
//           success: false,
//           message: "Category with this name already exists",
//         });

//       category.name = name;
//       category.slug = slugify(name, { lower: true });
//     }

//     await category.save();

//     res.status(200).json({
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

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await WorkspaceCategory.findById(id);

    if (!category)
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });

    if (name) {
      const exists = await WorkspaceCategory.findOne({ name, _id: { $ne: id } });
      if (exists)
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });

      category.name = name;
      category.slug = slugify(name, { lower: true });
    }

    if (description !== undefined) {
      category.description = description;
    }

    await category.save();

    res.status(200).json({
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

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await WorkspaceCategory.findById(id);

    if (!category)
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });

    await category.deleteOne();

    res.status(200).json({
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