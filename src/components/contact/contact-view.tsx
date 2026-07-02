'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, CheckCircle2, MapPin, Phone, Mail, Clock, MessageCircle, Instagram } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s-]{8,20}$/).optional().or(z.literal('')),
  subject: z.string().min(5).max(200),
  message: z.string().min(20).max(2000),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactView() {
  const t = useTranslations()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (_data: ContactFormData) => {
    setSubmitting(true)
    // Simulate submission (n8n will handle email sending later)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitting(false)
    setSubmitted(true)
    reset()
  }

  const contactInfo = [
    { icon: MapPin, label: t('contact.info.address'), value: t('contact.info.addressValue') },
    { icon: Phone, label: t('contact.info.phone'), value: t('contact.info.phoneValue'), dir: 'ltr' as const },
    { icon: Mail, label: t('contact.info.email'), value: t('contact.info.emailValue'), dir: 'ltr' as const },
    { icon: Clock, label: t('contact.info.hours'), value: t('contact.info.hoursValue') },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
          {t('contact.title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          {t('contact.subtitle')}
        </p>
        <div className="h-1 bg-gold mt-6" style={{ width: '60px' }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="p-8 rounded-xl bg-card border border-border text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {t('contact.form.success')}
              </h2>
              <Button
                onClick={() => setSubmitted(false)}
                variant="outline"
                className="mt-4 border-border"
              >
                {t('contact.form.sendAnother')}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 p-6 rounded-xl bg-card border border-border"
            >
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">
                    {t('contact.form.name')}
                  </Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className="bg-background"
                  />
                  {errors.name && (
                    <p className="text-xs text-lut">{t('contact.form.name')} *</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">
                    {t('contact.form.email')}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    dir="ltr"
                    {...register('email')}
                    className="bg-background"
                  />
                  {errors.email && (
                    <p className="text-xs text-lut">{t('contact.form.email')} *</p>
                  )}
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone">
                    {t('contact.form.phone')}
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    dir="ltr"
                    {...register('phone')}
                    className="bg-background"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subject">
                    {t('contact.form.subject')}
                  </Label>
                  <Input
                    id="subject"
                    {...register('subject')}
                    className="bg-background"
                  />
                  {errors.subject && (
                    <p className="text-xs text-lut">{t('contact.form.subject')} *</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="message">
                  {t('contact.form.message')}
                </Label>
                <Textarea
                  id="message"
                  rows={6}
                  {...register('message')}
                  className="bg-background"
                />
                {errors.message && (
                  <p className="text-xs text-lut">{t('contact.form.message')} *</p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-lut hover:bg-lut/90 text-white py-3 text-base font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 me-2 animate-spin" />
                    {t('contact.form.submitting')}
                  </>
                ) : (
                  t('contact.form.submit')
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Contact info */}
        <div className="lg:col-span-1">
          <div className="p-6 rounded-xl bg-bg-light border border-border space-y-6">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">
                      {info.label}
                    </p>
                    <p
                      className="text-sm font-medium text-foreground break-words"
                      dir={info.dir}
                    >
                      {info.value}
                    </p>
                  </div>
                </div>
              )
            })}

            {/* Social */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3">
                {t('contact.info.whatsapp')} / {t('contact.info.instagram')}
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://wa.me/96512345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-lut hover:text-white hover:border-lut transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/lastuniquetouch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-lut hover:text-white hover:border-lut transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
