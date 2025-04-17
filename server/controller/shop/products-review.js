import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addProductReview = async (req, res) => {
  try {
    let { productId, userId, userName, reviewMessage, reviewValue } = req.body;

    productId = parseInt(productId);
    userId = parseInt(userId);

    const existingReview = await prisma.productReview.findFirst({
      where: {
        productId,
        userId,
      },
    });

    if (existingReview) {
      return res.status(200).json({
        success: false,
        message: 'You already reviewed this product!',
      });
    }

    const newReview = await prisma.productReview.create({
      data: {
        productId,
        userId,
        userName,
        reviewMessage,
        reviewValue,
      },
    });

    const reviews = await prisma.productReview.findMany({
      where: { productId },
    });

    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, review) => sum + review.reviewValue, 0) / totalReviewsLength;

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageReview,
      },
    });

    return res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: 'Error adding review',
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const parsedProductId = parseInt(productId);

    if (!parsedProductId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid productId',
      });
    }

    const reviews = await prisma.productReview.findMany({
      where: { productId: parsedProductId },
    });

    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
    });
  }
};
