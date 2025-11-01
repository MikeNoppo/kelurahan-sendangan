/*
  Warnings:

  - You are about to drop the column `lingkungan` on the `StructureMember` table. All the data in the column will be lost.
  - Made the column `nama` on table `StructureMember` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."StructureMember" DROP CONSTRAINT "StructureMember_parentId_fkey";

-- AlterTable
ALTER TABLE "StructureMember" DROP COLUMN "lingkungan",
ADD COLUMN     "fotoUrl" TEXT,
ADD COLUMN     "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "nama" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "StructureMember" ADD CONSTRAINT "StructureMember_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "StructureMember"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
