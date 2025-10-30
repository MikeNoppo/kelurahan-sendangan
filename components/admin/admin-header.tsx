"use client"

import { useSession } from "next-auth/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AdminHeader() {
  const { data: session } = useSession()

  const initials = session?.user?.email
    ?.split("@")[0]
    .substring(0, 2)
    .toUpperCase() || "AD"

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-slate-900">Kelurahan Sendangan CMS</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">Admin</p>
            <p className="text-xs text-slate-500">{session?.user?.email}</p>
          </div>
          <Avatar>
            <AvatarFallback className="bg-slate-900 text-white">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
