import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;
    console.log(userId)

    if (!userId || !address || !city || !pincode || !phone || !notes) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const newlyCreatedAddress = await prisma.address.create({
      data: {
        userId,
        address,
        city,
        pincode,
        phone,
        notes,
      },
    });

    res.status(201).json({
      success: true,
      data: newlyCreatedAddress,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

export const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is required!",
      });
    }

    const addressList = await prisma.address.findMany({
      where: {
        userId: parseInt(userId),
      },
    });

    res.status(200).json({
      success: true,
      data: addressList,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

export const editAddress = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const addressId = Number(req.params.addressId);
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    const address = await prisma.address.updateMany({
      where: {
        id: addressId,
        userId,
      },
      data: formData,
    });

    if (address.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const updated = await prisma.address.findUnique({
      where: { id: addressId },
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const addressId = Number(req.params.addressId);
    console.log('User ID:', userId);
    console.log('Address ID:', addressId);

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "User and address id is required!",
      });
    }

    const deleted = await prisma.address.deleteMany({
      where: {
        id: addressId,
        userId,
      },
    });

    if (deleted.count === 0) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};
