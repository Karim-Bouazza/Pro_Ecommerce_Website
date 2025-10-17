/*
  Warnings:

  - The values [CUSTOMER,ADMIN] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `comparePrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Product` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageCover` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verificationCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('Cash', 'Card');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."UserRole_new" AS ENUM ('Admin', 'User');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."UserRole_new" USING ("role"::text::"public"."UserRole_new");
ALTER TYPE "public"."UserRole" RENAME TO "UserRole_old";
ALTER TYPE "public"."UserRole_new" RENAME TO "UserRole";
DROP TYPE "public"."UserRole_old";
ALTER TABLE "public"."User" ALTER COLUMN "role" SET DEFAULT 'User';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "category",
DROP COLUMN "comparePrice",
DROP COLUMN "image",
DROP COLUMN "name",
ADD COLUMN     "brandId" INTEGER,
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "colors" TEXT[],
ADD COLUMN     "imageCover" TEXT NOT NULL,
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "priceAfterDiscount" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "ratingsAverage" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "ratingsQuantity" INTEGER DEFAULT 0,
ADD COLUMN     "sold" INTEGER DEFAULT 0,
ADD COLUMN     "subCategoryId" INTEGER,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "adress" TEXT,
ADD COLUMN     "age" INTEGER,
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "gender" "public"."Gender" NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" INTEGER,
ADD COLUMN     "verificationCode" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'User';

-- DropEnum
DROP TYPE "public"."ProductCategory";

-- CreateTable
CREATE TABLE "public"."Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SubCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Review" (
    "id" SERIAL NOT NULL,
    "reviewText" TEXT,
    "rating" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Brand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cart" (
    "id" SERIAL NOT NULL,
    "totalPrice" DOUBLE PRECISION,
    "totalPriceAfterDiscount" DOUBLE PRECISION,
    "productId" INTEGER NOT NULL,
    "couponId" INTEGER,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Coupon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "expireData" TIMESTAMP(3) NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RequestProduct" (
    "id" SERIAL NOT NULL,
    "titleNeed" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "qantity" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Suppliers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tax" (
    "id" SERIAL NOT NULL,
    "texPrice" DOUBLE PRECISION,
    "shippingPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" SERIAL NOT NULL,
    "texPrice" DOUBLE PRECISION DEFAULT 0,
    "shippingPrice" DOUBLE PRECISION DEFAULT 0,
    "totalOrderPrice" DOUBLE PRECISION NOT NULL,
    "paymentMethodType" "public"."PaymentMethod" NOT NULL,
    "isPaid" BOOLEAN DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "isDelivered" BOOLEAN DEFAULT false,
    "deliveredAt" TIMESTAMP(3),
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shippingAdress" (
    "id" SERIAL NOT NULL,
    "alias" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "phone" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shippingAdress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_name_key" ON "public"."SubCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "public"."Brand"("name");

-- AddForeignKey
ALTER TABLE "public"."SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "public"."SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "public"."Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RequestProduct" ADD CONSTRAINT "RequestProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shippingAdress" ADD CONSTRAINT "shippingAdress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
