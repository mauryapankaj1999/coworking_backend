import Testimonial from "../models/Testimonial.js";
import cloudinary from "../config/cloudinary.js";

// CREATE TESTIMONIAL

export const createTestimonial = async (req, res) => {
  try {
    const {
      name,
      description,
      designation,
      company,
      rating,
      status,
    } = req.body;

    if (!name || !description)
      return res.status(400).json({
        success: false,
        message: "Name and Description are required",
      });

    let image = {};

    if (req.file) {
      image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const testimonial = await Testimonial.create({
      name,
      description,
      designation,
      company,
      rating,
      status,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL TESTIMONIALS

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE TESTIMONIAL

export const getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial)
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });

    res.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE TESTIMONIAL

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial)
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });

    if (req.body.name) {
      testimonial.name = req.body.name;
    }

    if (req.body.description) {
      testimonial.description = req.body.description;
    }

    if (req.body.designation !== undefined) {
      testimonial.designation = req.body.designation;
    }

    if (req.body.company !== undefined) {
      testimonial.company = req.body.company;
    }

    if (req.body.rating !== undefined) {
      testimonial.rating = req.body.rating;
    }

    if (req.body.status !== undefined) {
      testimonial.status = req.body.status;
    }

    if (req.file) {
      if (testimonial.image?.public_id) {
        await cloudinary.uploader.destroy(
          testimonial.image.public_id
        );
      }

      testimonial.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await testimonial.save();

    res.json({
      success: true,
      message: "Testimonial updated successfully",
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE TESTIMONIAL

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    if (testimonial.image?.public_id) {
      await cloudinary.uploader.destroy(
        testimonial.image.public_id
      );
    }

    await testimonial.deleteOne();

    res.json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};