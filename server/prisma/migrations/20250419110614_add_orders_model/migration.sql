-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cartId" INTEGER NOT NULL,
    "addressInfoId" INTEGER NOT NULL,
    "orderStatus" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "orderUpdateDate" TIMESTAMP(3) NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "paymentId" TEXT,
    "payerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "CartItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressInfoId_fkey" FOREIGN KEY ("addressInfoId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
