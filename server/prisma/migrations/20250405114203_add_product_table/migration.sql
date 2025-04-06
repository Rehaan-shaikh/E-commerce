-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "title" TEXT,
    "description" TEXT,
    "category" TEXT,
    "brand" TEXT,
    "price" DOUBLE PRECISION,
    "salePrice" DOUBLE PRECISION,
    "totalStock" INTEGER,
    "averageReview" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
