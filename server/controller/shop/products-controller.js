import prisma from "../../DB/db.config.js";

export const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let where = {};
    let orderBy = {};
    // console.log(where, orderBy, "where and orderBy");
    // {
    //   category: { in: [ 'men', 'women' ] },
    //   brand: { in: [ 'nike', 'adidas' ] }
    // } 
    // { title: 'asc' } where and orderBy

    if (category.length) {
      where.category = {  //it adds a new category key to the where object
        in: category.split(",")
        //initially category = "men,women"
        // category.split(",") // ➜ ['men', 'women'] 
      };
    }

    if (brand.length) {
      where.brand = {
        in: brand.split(",")
      };
    }

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
      //this is how prisma sees this 2 objects
      // {
      //   where: {
      //     category: {
      //       in: ['men', 'women']
      //     }
      //   },
      //   orderBy: {
      //     price: 'asc'
      //   }
      // }
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

export const getProductDetails = async (req, res) => {
  const {id} = req.params;
  
  const productDetails = await prisma.product.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  // console.log( "productDetails ",productDetails , "and its id", id ,);

  if (!productDetails) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  res.status(200).json({
    success: true,
    data: productDetails,
  });
}