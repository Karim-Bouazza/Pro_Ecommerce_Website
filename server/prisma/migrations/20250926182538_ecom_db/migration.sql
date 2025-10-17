/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."ProductCategory" AS ENUM ('MAN', 'WOMEN', 'CHILD');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "username",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'CUSTOMER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "comparePrice" DOUBLE PRECISION,
    "price" DOUBLE PRECISION NOT NULL,
    "category" "public"."ProductCategory" NOT NULL DEFAULT 'MAN',
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
