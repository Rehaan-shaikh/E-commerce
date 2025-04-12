import prisma from "../../DB/db.config.js";

export const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let where = {};

    if (category.length) {
      where.category = {
        in: category.split(",")
      };
    }

    if (brand.length) {
      where.brand = {
        in: brand.split(",")
      };
    }

    let orderBy = {};

    switch (sortBy) {
      case "price-lowtohigh":
        orderBy = { price: "asc" };
        break;
      case "price-hightolow":
        orderBy = { price: "desc" };
        break;
      case "title-atoz":
        orderBy = { title: "asc" };
        break;
      case "title-ztoa":
        orderBy = { title: "desc" };
        break;
      default:
        orderBy = { price: "asc" };
        break;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};