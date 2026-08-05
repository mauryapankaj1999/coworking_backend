import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import Blog from "../models/Blog.js";


export const createBlog = async (req, res) => {
  try {
    const { title, Description } = req.body;

    if (!title || !Description) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Blog image is required",
      });
    }

    const blog = await Blog.create({
      title,
      slug: slugify(title, { lower: true }),

      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },

      Description,
    });

    res.status(201).json({
      success: true,
      message: "Blog Created Successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (req.body.title) {
      blog.title = req.body.title;
      blog.slug = slugify(req.body.title, { lower: true });
    }

    if (req.body.Description !== undefined) {
      blog.Description = req.body.Description;
    }

    if (req.file) {
      if (blog.image?.public_id) {
        await cloudinary.uploader.destroy(blog.image.public_id);
      }

      blog.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await blog.save();

    res.json({
      success: true,
      message: "Blog Updated Successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.image?.public_id) {
      await cloudinary.uploader.destroy(blog.image.public_id);
    }

    await blog.deleteOne();

    res.json({
      success: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};