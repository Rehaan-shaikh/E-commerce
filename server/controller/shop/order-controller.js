import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import paypal from "../../helpers/paypal.js";

export const createOrder = async (req, res) => {
  console.log(req.body);
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body.orderData;

    // Calculate the total dynamically by using salePrice (or price if salePrice is not available)
    const calculatedTotal = cartItems.reduce((total, item) => {
      return total + (item.salePrice || item.price) * item.quantity;
    }, 0);

    // Log the calculated total to check if it's correct
    console.log("Calculated Total:", calculatedTotal);

    // Ensure the totalAmount from the request matches the calculated total
    const totalAmount = calculatedTotal;

    // Create the payment JSON with dynamically calculated total
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId.toString(),
              price: (item.salePrice || item.price).toFixed(2), // Ensure price is using salePrice or price
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2), // Use dynamically calculated total
          },
          description: "Order description",
        },
      ],
    };

    // Log the payment JSON to check structure before sending to PayPal
    console.log("Payment JSON:", create_payment_json);

    // Create the PayPal payment
    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error("Error creating PayPal payment:", error.response);
        return res.status(500).json({
          success: false,
          message: "Error while creating PayPal payment",
          error: error.response, // You can send back the error response for debugging
        });
      }

      // Log the successful payment info to inspect the response
      console.log("Payment created successfully:", paymentInfo);

      // Store order data in the database
      const newOrder = await prisma.order.create({
        data: {
          userId,
          cartId,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate: new Date(orderDate),
          orderUpdateDate: new Date(orderUpdateDate),
          paymentId,
          payerId,
          addressInfo, // Store addressInfo as a JSON field (make sure it's supported in your schema)
          cartItems,   // Alternatively, you can store cartItems in a related table if needed
        },
      });

      // Find the approval URL from PayPal payment response
      const approvalURL = paymentInfo.links.find(
        (link) => link.rel === "approval_url"
      ).href;

      // Return the approval URL and order ID
      res.status(201).json({
        success: true,
        approvalURL,
        orderId: newOrder.id,
      });
    });
  } catch (e) {
    console.error("Error in creating order:", e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while creating the order",
      error: e.message, // Provide the error message for better debugging
    });
  }
};



// const capturePayment = async (req, res) => {
//   try {
//     const { paymentId, payerId, orderId } = req.body;

//     let order = await Order.findById(orderId);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order can not be found",
//       });
//     }

//     order.paymentStatus = "paid";
//     order.orderStatus = "confirmed";
//     order.paymentId = paymentId;
//     order.payerId = payerId;

//     for (let item of order.cartItems) {
//       let product = await Product.findById(item.productId);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Not enough stock for this product ${product.title}`,
//         });
//       }

//       product.totalStock -= item.quantity;

//       await product.save();
//     }

//     const getCartId = order.cartId;
//     await Cart.findByIdAndDelete(getCartId);

//     await order.save();

//     res.status(200).json({
//       success: true,
//       message: "Order confirmed",
//       data: order,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const getAllOrdersByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const orders = await Order.find({ userId });

//     if (!orders.length) {
//       return res.status(404).json({
//         success: false,
//         message: "No orders found!",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: orders,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

// const getOrderDetails = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found!",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: order,
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };