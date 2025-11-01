-- AlterTable
ALTER TABLE "StructureMember" ADD COLUMN     "isDraft" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "publishedAt" TIMESTAMP(3);
