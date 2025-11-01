/*
  Warnings:

  - You are about to drop the column `isDraft` on the `StructureMember` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `StructureMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StructureMember" DROP COLUMN "isDraft",
DROP COLUMN "publishedAt";

-- CreateTable
CREATE TABLE "PublishedStructure" (
    "id" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nip" TEXT,
    "fotoUrl" TEXT,
    "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "urutan" INTEGER,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublishedStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StructureMetadata" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "hasUnpublished" BOOLEAN NOT NULL DEFAULT false,
    "lastPublishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StructureMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublishedStructure_parentId_idx" ON "PublishedStructure"("parentId");
