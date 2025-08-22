import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

// Create category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send({ message: "Name is required" });

    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({ success: false, message: "Category already exists" });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name)
    }).save();

    res.status(201).send({
      success: true,
      message: "Category created successfully",
      category
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in category creation",
      error
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body; 
    const { id } = req.params;  

    // Update the category by ID
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { 
        name, 
        slug: slugify(name)   
      },
      { new: true }  
    );

    res.status(200).send({
      success: true,
      message: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
    });
  }
};

// get all categories
export const categoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.status(200).send({
      success: true,
      message: "All Categories List",
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all categories",
      error,
    });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get Single Category Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Category",
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting category",
    });
  }
};