import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid data provided!" });
    }

    const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: Number(userId) },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: Number(userId) } });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: Number(productId) },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: Number(productId),
          quantity,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                image: true,
                title: true,
                price: true,
                salePrice: true,
              },
            },
          },
        },
      },
    });

    const formattedItems = updatedCart.items.map(item => ({
      productId: item.product?.id,
      image: item.product?.image,
      title: item.product?.title,
      price: item.product?.price,
      salePrice: item.product?.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: { ...updatedCart, items: formattedItems } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};


export const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;
    // console.log(userId, "user id from fetch cart items");

    if (!userId) {
      return res.status(400).json({ success: false, message: "User Not Found" });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: Number(userId) },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                image: true,
                title: true,
                price: true,
                salePrice: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    const validItems = cart.items.filter(item => item.product !== null);

    const formattedItems = validItems.map(item => ({
      productId: item.product.id,
      image: item.product.image,
      title: item.product.title,
      price: item.product.price,
      salePrice: item.product.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: { ...cart, items: formattedItems } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Invalid data provided!" });
    }

    const cart = await prisma.cart.findUnique({ where: { userId: Number(userId) } });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    const item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: Number(productId) },
    });

    if (!item) {
      return res.status(404).json({ success: false, message: "Cart item not present!" });
    }

    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                image: true,
                title: true,
                price: true,
                salePrice: true,
              },
            },
          },
        },
      },
    });

    const formattedItems = updatedCart.items.map(item => ({
      productId: item.product?.id,
      image: item.product?.image,
      title: item.product?.title || "Product not found",
      price: item.product?.price,
      salePrice: item.product?.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: { ...updatedCart, items: formattedItems } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    // console.log(userId, productId, "user id and product id from delete cart item");

    if (!userId || !productId) {
      return res.status(400).json({ success: false, message: "Invalid data provided!" });
    }

    const cart = await prisma.cart.findUnique({ where: { userId: Number(userId) } });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    const item = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: Number(productId) },
    });
    // console.log(item, "item from delete cart item");

    if (item) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                image: true,
                title: true,
                price: true,
                salePrice: true,
              },
            },
          },
        },
      },
    });
    // console.log(updatedCart, "updated cart after delete");

    const formattedItems = updatedCart.items.map(item => ({
      productId: item.product?.id,
      image: item.product?.image,
      title: item.product?.title || "Product not found",
      price: item.product?.price,
      salePrice: item.product?.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({ success: true, data: { ...updatedCart, items: formattedItems } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error" });
  }
};
