'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import { useRouter } from '@/i18n/routing'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { translations } from '@/components/your-birthday/translations'

const BirthdayVisualizer = dynamic(
  () => import('@/components/your-birthday/birthday-visualizer').then(m => m.BirthdayVisualizer),
  { ssr: false, loading: () => <div className="absolute inset-0" /> }
)

export default function BirthdayFeaturesView() {
  const locale = useLocale() as 'ar' | 'en'
  const router = useRouter()
  const t = translations[locale]
  const ArrowIcon = locale === 'ar' ? ArrowRight : ArrowLeft

  const services = locale === 'ar' ? [
    { icon: '🎂', title: 'تنظيم حفلات أعياد الميلاد', desc: 'تخطيط كامل لحفلة عيد الميلاد من الألف إلى الياء — ديكور، كيك، ألعاب، ومفاجآت', color: '#8B5CF6' },
    { icon: '🎭', title: 'تأجير أدوات الحفلات', desc: 'رقصات LED مضيئة، أنظمة صوت احترافية، إضاءة مسرح، مؤثرات ليزر، وأكثر', color: '#EC4899' },
    { icon: '🎈', title: 'الديكور والبالونات', desc: 'تنسيقات بالونات معدنية، زخارف احتفالية، ثيمات مخصصة لكل مناسبة', color: '#00F3FF' },
    { icon: '🎵', title: 'الصوت والموسيقى', desc: 'مكبرات صوت، DJ equipment، مايكات، وأنظمة صوت محيطية', color: '#F97316' },
    { icon: '💡', title: 'الإضاءة الاحترافية', desc: 'أضواء مسرح، إضاءة LED ملونة، سبوت لايت، ومؤثرات بصرية', color: '#10B981' },
    { icon: '📸', title: 'التصوير الفوتوغرافي', desc: 'تصوير احترافي للحفلة، فيديو، وصور ذكريات دائمة', color: '#EF4444' },
  ] : [
    { icon: '🎂', title: 'Birthday Party Planning', desc: 'Complete birthday party planning from A to Z — decor, cake, games, and surprises', color: '#8B5CF6' },
    { icon: '🎭', title: 'Party Equipment Rental', desc: 'LED dance floors, professional sound systems, stage lighting, laser effects, and more', color: '#EC4899' },
    { icon: '🎈', title: 'Decor & Balloons', desc: 'Metallic balloon arrangements, festive decorations, custom themes for every occasion', color: '#00F3FF' },
    { icon: '🎵', title: 'Sound & Music', desc: 'Speakers, DJ equipment, microphones, and surround sound systems', color: '#F97316' },
    { icon: '💡', title: 'Professional Lighting', desc: 'Stage lights, colored LED lighting, spotlights, and visual effects', color: '#10B981' },
    { icon: '📸', title: 'Photography', desc: 'Professional party photography, video, and lasting memory shots', color: '#EF4444' },
  ]

  return (
    <div className="relative w-full min-h-screen bg-[#020204] overflow-hidden">
      {/* 3D Background */}
      <BirthdayVisualizer />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-1 bg-gradient-to-t from-[#020204] via-[#020204]/80 to-[#020204]/50 pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 sm:top-10 start-6 sm:start-10 z-20">
        <button
          onClick={() => router.push('/your-birthday')}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all font-medium text-xs cursor-pointer"
        >
          <ArrowIcon className="w-4 h-4" />
          <span>{locale === 'ar' ? 'العودة' : 'Back'}</span>
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl md:text-5xl font-black uppercase tracking-wider mb-4"
              style={{
                fontFamily: locale === 'ar' ? 'var(--font-birthday-arabic), Cairo, sans-serif' : 'var(--font-birthday-headline), Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899, #00F3FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {locale === 'ar' ? 'خدماتنا' : 'Our Services'}
            </h2>
            <p className="text-sm text-white/50 max-w-xl mx-auto">
              {locale === 'ar'
                ? 'تأجير أدوات الحفلات وأعياد الميلاد وتجهيزها بالكامل'
                : 'Party & birthday equipment rental and full setup'}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#00F3FF] mx-auto rounded-full mt-6" />
          </motion.div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative p-8 rounded-3xl bg-[#09090f]/80 border border-white/5 hover:border-white/15 transition-all duration-500 backdrop-blur-md overflow-hidden"
              >
                <div
                  className="absolute -top-12 -end-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: service.color }}
                />
                <div className="relative z-10">
                  <div className="text-5xl mb-5">{service.icon}</div>
                  <h3
                    className="text-xl font-bold mb-3"
                    style={{
                      color: service.color,
                      fontFamily: locale === 'ar' ? 'var(--font-birthday-arabic), Cairo' : 'var(--font-birthday-sub), Rajdhani',
                    }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-16"
          >
            <button
              onClick={() => router.push('/contact')}
              className="px-10 py-4 rounded-full font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_25px_rgba(139,92,246,0.4)]"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                fontFamily: locale === 'ar' ? 'var(--font-birthday-arabic)' : 'var(--font-birthday-sub)',
              }}
            >
              {locale === 'ar' ? 'احجز الآن' : 'Book Now'}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
