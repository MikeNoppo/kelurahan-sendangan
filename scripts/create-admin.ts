import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "admin@kelurahan.go.id"
  const password = "admin123"

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    console.log("❌ User admin sudah ada!")
    return
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  })

  console.log("✅ User admin berhasil dibuat!")
  console.log("📧 Email:", email)
  console.log("🔑 Password:", password)
  console.log("⚠️  Segera ganti password setelah login!")
  console.log("🌐 Login URL: http://localhost:3000/admin/login")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
