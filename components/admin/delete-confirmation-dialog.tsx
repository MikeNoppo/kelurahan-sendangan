"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Trash2 } from "lucide-react"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  title?: string
  description?: string
  itemName?: string
  loading?: boolean
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Yakin ingin menghapus?",
  description = "Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen dari server.",
  itemName,
  loading = false,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="text-base">
            {description}
          </AlertDialogDescription>
          {itemName && (
            <div className="mt-3 p-3 bg-slate-100 rounded-lg border border-slate-200">
              <p className="text-sm font-medium text-slate-900">
                <span className="text-slate-600">Item: </span>
                {itemName}
              </p>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel disabled={loading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
