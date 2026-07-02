'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDeleteProps {
  trigger: ReactNode
  itemName: string
  onConfirm: () => Promise<void> | void
}

export function ConfirmDelete({ trigger, itemName, onConfirm }: ConfirmDeleteProps) {
  const t = useTranslations('admin.confirmDelete')
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

  useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !deleting) setOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, deleting])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer bg-transparent border-0 p-0"
        aria-label={t('title')}
      >
        {trigger}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => !deleting && setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={t('title')}
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
                type="button"
                onClick={() => !deleting && setOpen(false)}
                className="text-muted-foreground hover:text-foreground"
                aria-label={t('cancel')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-2">{t('title')}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t('message', { name: itemName })}
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 border-border"
                onClick={() => setOpen(false)}
                disabled={deleting}
              >
                {t('cancel')}
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleConfirm}
                disabled={deleting}
              >
                {deleting ? t('processing') : t('confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
