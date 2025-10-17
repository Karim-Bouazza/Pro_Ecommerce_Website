/*
  Warnings:

  - You are about to drop the column `adress` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Cart" DROP CONSTRAINT "Cart_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RequestProduct" DROP CONSTRAINT "RequestProduct_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SubCategory" DROP CONSTRAINT "SubCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."shippingAdress" DROP CONSTRAINT "shippingAdress_orderId_fkey";

-- AlterTable
ALTER TABLE "public"."Cart" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."RequestProduct" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Review" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."SubCategory" ALTER COLUMN "categoryId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT,
ALTER COLUMN "active" DROP NOT NULL,
ALTER COLUMN "active" SET DEFAULT true,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "verificationCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."shippingAdress" ALTER COLUMN "orderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cart" ADD CONSTRAINT "Cart_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RequestProduct" ADD CONSTRAINT "RequestProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shippingAdress" ADD CONSTRAINT "shippingAdress_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
