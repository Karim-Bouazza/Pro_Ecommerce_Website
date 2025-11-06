/*
  Warnings:

  - You are about to drop the `Tax` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Tax";

-- CreateTable
CREATE TABLE "public"."Tex" (
    "id" SERIAL NOT NULL,
    "texName" TEXT NOT NULL,
    "texPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tex_pkey" PRIMARY KEY ("id")
);
