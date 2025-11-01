/*
  Warnings:

  - You are about to drop the column `expireData` on the `Coupon` table. All the data in the column will be lost.
  - Added the required column `expireDate` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Coupon" DROP COLUMN "expireData",
ADD COLUMN     "expireDate" TEXT NOT NULL;
