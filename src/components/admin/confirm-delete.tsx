'use client'

import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDeleteProps {
  trigger: ReactNode
  itemName: string
  onConfirm: () => Promise<void> | void
}

export function ConfirmDelete({ trigger, itemName, onConfirm }: ConfirmDeleteProps) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleConfirm = async () => {
    setDeleting(true)
    try {
      await onConfirm()
      setOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !deleting && setOpen(false)}
        >
          <div
            className="bg-card rounded-xl shadow-xl max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <button
                onClick={() => !deleting && setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">
              تأكيد الحذف
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              هل أنت متأكد من حذف &ldquo;{itemName}&rdquo;؟
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border"
                onClick={() => setOpen(false)}
                disabled={deleting}
              >
                إلغاء
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleConfirm}
                disabled={deleting}
              >
                {deleting ? 'جارٍ الحذف...' : 'حذف'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
