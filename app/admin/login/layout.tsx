import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "../../globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Login - Admin Panel Kelurahan Sendangan",
  description: "Login ke panel administrasi",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={`${geist.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
