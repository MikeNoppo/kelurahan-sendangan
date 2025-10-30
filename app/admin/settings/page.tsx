"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-600 mt-1">Pengaturan sistem</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Coming Soon</h3>
            <p className="text-slate-600">Pengaturan sistem akan segera hadir</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
