-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('BERITA', 'PENGUMUMAN');

-- CreateEnum
CREATE TYPE "Jabatan" AS ENUM ('LURAH', 'SEKRETARIS_KELURAHAN', 'KEPALA_SEKSI_PEMERINTAHAN', 'KEPALA_SEKSI_PEMBANGUNAN', 'KEPALA_SEKSI_KESEJAHTERAAN_RAKYAT', 'KEPALA_LINGKUNGAN_1', 'PEMBANTU_KALING_1');

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "type" "PostType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Potential" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "emoji" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Potential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileInfo" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfileInfo_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "StructureMember" (
    "id" TEXT NOT NULL,
    "jabatan" "Jabatan" NOT NULL,
    "nama" TEXT,
    "nip" TEXT,
    "lingkungan" INTEGER,
    "parentId" TEXT,
    "urutan" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StructureMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StructureMember_parentId_idx" ON "StructureMember"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "StructureMember" ADD CONSTRAINT "StructureMember_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "StructureMember"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
