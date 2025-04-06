import prisma from "../../DB/db.config.js";
import { imageUploadUtil } from "../../helpers/cloudinary.js";

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64"); // req.file.buffer provide raw data of file in the form of binary content
    const url = "data:" + req.file.mimetype + ";base64," + b64; // req.file.mimetype provide type of file like jpg,pdf,etc
    const result = await imageUploadUtil(url);//then this url converted file is store in cloudinary
    console.log(result , "URL of image uploaded in cloudinary");

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};
export default handleImageUpload;


// adding product
export const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        image,
        title,
        description,
        category,
        brand,
        price: parseFloat(price),
        salePrice: parseFloat(salePrice),
        totalStock: Number(totalStock),
        averageReview: parseFloat(averageReview),
      },
    });

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};


//fetching all products
export const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await prisma.product.findMany();

    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching products",
    });
  }
};



//edit a product
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title: title || existingProduct.title,
        description: description || existingProduct.description,
        category: category || existingProduct.category,
        brand: brand || existingProduct.brand,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        salePrice: salePrice !== undefined ? parseFloat(salePrice) : existingProduct.salePrice,
        totalStock: totalStock !== undefined ? Number(totalStock) : existingProduct.totalStock,
        image: image || existingProduct.image,
        averageReview: averageReview !== undefined ? parseFloat(averageReview) : existingProduct.averageReview,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Error occurred while editing product",
    });
  }
};


//Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Error occurred while deleting product",
    });
  }
}

