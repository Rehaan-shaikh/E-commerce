import prisma from "../../DB/db.config.js";

// //https://www.prisma.io/docs/orm/prisma-client/queries/full-text-search
// //refer this link to setup full txt search
// export const searchProduct = async (req, res) => {
//     const query = req.query.q;
//     const posts = await prisma.post.findMany({
//       where: {
//         description: {
//           search: query,
//         },
//       },
//     });
  
//     //http://localhost:3000/api/post/search?q=NKOCET Use such endpoint
//     return res.json({ status: 200, data: posts });
//   };
  
export const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message: "Keyword is required and must be in string format",
      });
    }

    const searchResults = await prisma.product.findMany({
      where: {
        OR: [
          { title: { search: keyword } },
          { description: { search: keyword } },
          { category: { search: keyword } },
          { brand: { search: keyword } },
        ],
      },
      orderBy: {   // Sort by relevance and rank them based on the search term 
        _relevance: {
          fields: ["title", "description", "category", "brand"],
          search: keyword,
          sort: "desc",
        },
      },
    });

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

