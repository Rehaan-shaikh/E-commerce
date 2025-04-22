import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const getAllOrdersOfAllUsers = async (req, res) => {
    try {
  
      // Fetch orders by userId
      const orders = await prisma.order.findMany({
        include: {
          cartItems: true, // Optionally include cartItems if needed
          addressInfo: true, // Include address information if needed
        }
      });
  
      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No orders found!",
        });
      }
  
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occurred!",
      });
    }
  };
  
  export const getOrderDetailsForAdmin = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch order by id
      const order = await prisma.order.findUnique({
        where: {
          id: id, // id should match your order model
        },
        include: {
          cartItems: true, // Optionally include cartItems if needed
          addressInfo: true, // Include address information if needed
        },
      });
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found!",
        });
      }
  
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occurred!",
      });
    }
  };
  

  export const updateOrderStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { orderStatus } = req.body;
  
      const order = await prisma.order.findUnique({
        where: {
          id: id
        }
      });
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found!",
        });
      }
  
      await prisma.order.update({
        where: {
          id: id
        },
        data: {
          orderStatus: orderStatus
        }
      });
  
      res.status(200).json({
        success: true,
        message: "Order status is updated successfully!",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: "Some error occured!",
      });
    }
  };