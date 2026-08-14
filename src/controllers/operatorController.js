import Operator from "../models/Operator.js";
import slugify from "slugify";

export const createOperator = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name)
      return res.status(400).json({
        success: false,
        message: "Operator name is required",
      });

    const exists = await Operator.findOne({ name });

    if (exists)
      return res.status(400).json({
        success: false,
        message: "Operator already exists",
      });

    const operator = await Operator.create({
      name,
      description,
      slug: slugify(name, { lower: true }),
    });

    res.status(201).json({
      success: true,
      message: "Operator created successfully",
      data: operator,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOperators = async (req, res) => {
  try {
    const operators = await Operator.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: operators,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOperator = async (req, res) => {
  try {
    const { id } = req.params;
    const operator = await Operator.findById(id);

    if (!operator)
      return res.status(404).json({
        success: false,
        message: "Operator not found",
      });

    res.status(200).json({
      success: true,
      data: operator,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOperatorBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const operator = await Operator.findOne({ slug });

    if (!operator)
      return res.status(404).json({
        success: false,
        message: "Operator not found",
      });

    res.status(200).json({
      success: true,
      data: operator,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOperator = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const operator = await Operator.findById(id);

    if (!operator)
      return res.status(404).json({
        success: false,
        message: "Operator not found",
      });

    if (name) {
      const exists = await Operator.findOne({ name, _id: { $ne: id } });
      if (exists)
        return res.status(400).json({
          success: false,
          message: "Operator with this name already exists",
        });

      operator.name = name;
      operator.slug = slugify(name, { lower: true });
    }

    if (description !== undefined) {
      operator.description = description;
    }

    await operator.save();

    res.status(200).json({
      success: true,
      message: "Operator updated successfully",
      data: operator,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteOperator = async (req, res) => {
  try {
    const { id } = req.params;
    const operator = await Operator.findById(id);

    if (!operator)
      return res.status(404).json({
        success: false,
        message: "Operator not found",
      });

    await operator.deleteOne();

    res.status(200).json({
      success: true,
      message: "Operator deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};