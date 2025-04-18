import prisma from "../../DB/db.config.js";


// Add a feature image
export const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    const newFeature = await prisma.feature.create({
      data: { image },
    });

    res.status(201).json({
      success: true,
      data: newFeature,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Get all feature images
export const getFeatureImages = async (req, res) => {
  try {
    const images = await prisma.feature.findMany();

    res.status(200).json({
      success: true,
      data: images,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};
