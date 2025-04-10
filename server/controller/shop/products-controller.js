import prisma from "../../DB/db.config.js";

export const getFilteredProducts= async (req, res) => {
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