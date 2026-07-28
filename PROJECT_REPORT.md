# 📋 التقرير الشامل لمشروع Last Unique Touch & La Lounge

> **الريبو:** https://github.com/Akrout111/Last-unique-touch-and-la-lounge  
> **آخر تحديث:** يوليو 2026  
> **آخر commit:** `2f3dc94` — fix(v62): overlap detection for same-day bookings  
> **الحالة:** متزامن مع GitHub (0 unpushed)

---

## فهرس المحتويات

1. [نظرة عامة](#1-نظرة-عامة)
2. [التقنيات (Tech Stack)](#2-التقنيات-tech-stack)
3. [العلامات التجارية والهوية البصرية](#3-العلامات-التجارية-والهوية-البصرية)
4. [التصميم والأنميشن](#4-التصميم-والأنميشن)
5. [هيكل المشروع](#5-هيكل-المشروع)
6. [الصفحات والمسارات](#6-الصفحات-والمسارات)
7. [نظام الحجوزات والتأجير](#7-نظام-الحجوزات-والتأجير)
8. [نظام السلة والدفع](#8-نظام-السلة-والدفع)
9. [المصادقة والأمان](#9-المصادقة-والأمان)
10. [لوحة التحكم (Admin)](#10-لوحة-التحكم-admin)
11. [قاعدة البيانات](#11-قاعدة-البيانات)
12. [التدويل (i18n)](#12-التدويل-i18n)
13. [SEO والأداء](#13-seo-والأداء)
14. [الاختبارات](#14-الاختبارات)
15. [جودة الكود](#15-جودة-الكود)
16. [CI/CD والبنية التحتية](#16-cicd-والبنية-التحتية)
17. [التوثيق](#17-التوثيق)
18. [الإحصائيات النهائية](#18-الإحصائيات-النهائية)

---

## 1. نظرة عامة

**Last Unique Touch & La Lounge** هي منصة فاخرة متعددة العلامات التجارية (multi-tenant) لتأجير الأثاث وتخطيط الفعاليات وتنظيم الحفلات في الكويت. المنصة تخدم **ثلاث علامات تجارية** تحت مظلة واحدة، لكل علامة هوية بصرية مستقلة وألوان مخصصة مستوحاة من لوجو كل علامة:

| العلامة | التخصص | اللون الرئيسي | Hex |
|---------|--------|---------------|-----|
| **Last Unique Touch (LUT)** | تأجير الأثاث الفاخر | ذهبي نحاسي | `#8B6B3D` |
| **La Lounge** | تخطيط وإنتاج الفعاليات | وردي زاهي | `#E6007E` |
| **Your Birthday** | تنظيم الحفلات وأعياد الميلاد | ذهبي/أصفر + 4 ألوان | `#FFCC00`, `#4A235A`, `#E32636`, `#FFB6C1` |

المنصة تدعم اللغتين العربية (RTL) والإنجليزية (LTR) بالكامل، مع 573 مفتاح ترجمة لكل لغة.

---

## 2. التقنيات (Tech Stack)

### الواجهة الأمامية (Frontend)

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| **Next.js** | 16.2.11 | إطار العمل الأساسي (App Router, standalone output) |
| **React** | 19.x | مكتبة الواجهة (Concurrent Features) |
| **TypeScript** | 5.x | لغة البرمجة (strict mode + noUnusedLocals + noUnusedParameters + noImplicitReturns + noFallthroughCasesInSwitch) |
| **Tailwind CSS** | 4.x | نظام التصميم (CSS-first config via `@theme`) |
| **shadcn/ui** | New York style | مكونات UI (9 مكونات مستخدمة من أصل 44 تم توليدها) |
| **Three.js** | 0.185 | خلفيات ثلاثية الأبعاد (vanilla + @react-three/fiber + drei) |
| **Framer Motion** | 12.x | انتقالات الصفحات (`template.tsx`) + حركة العناصر |
| **next-intl** | 4.13 | التدويل (عربي/إنجليزي + RTL/LTR + `localeDetection: false`) |
| **next/font** | - | 10 خطوط Google مخصصة (self-hosted) |
| **Lucide React** | - | مكتبة الأيقونات (69 ملف يستخدمها) |
| **react-day-picker** | 9.13 | تقويم اختيار فترة التأجير |
| **react-hook-form + Zod** | 7.x / 4.x | النماذج والتحقق من المدخلات |
| **Lenis** | 1.x | تمرير سلس (smooth scroll) مع دعم `prefers-reduced-motion` |

### الباك إند (Backend)

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------|
| **Next.js API Routes** | 16.x | 9 مسارات API RESTful |
| **Server Actions** | - | عمليات الإدارة (CRUD للمنتجات، الفئات، الحجوزات) |
| **Prisma ORM** | 6.19 | طبقة قاعدة البيانات (parameterized queries) |
| **SQLite** | - | قاعدة البيانات (محلية، TODO: PostgreSQL migration) |
| **Edge Runtime** | - | middleware (`proxy.ts`) — Web Crypto API |
| **HMAC-SHA256** | - | توقيع الجلسات + تواقيع الـ webhooks |
| **Zod** | 4.x | التحقق من المدخلات في كل API route + server action |

### البنية التحتية والأدوات

| التقنية | الاستخدام |
|---------|-----------|
| **Bun** | Runtime + package manager (أسرع من npm/yarn) |
| **Caddy** | Reverse proxy + TLS termination + `XTransformPort` gate |
| **Playwright** | اختبارات E2E (12 اختبار عبر 3 ملفات) |
| **Vitest** | اختبارات الوحدة (104 اختبار عبر 12 ملف) |
| **ESLint** | 9.x مع قواعد حرجة كـ `error` (no-explicit-any, no-non-null-assertion, exhaustive-deps, إلخ) |
| **Prettier** | 3.9 تنسيق الكود (semi: false, singleQuote: true, printWidth: 100) |
| **Husky** | 9.1 Pre-commit hooks (lint-staged + commitlint) |
| **lint-staged** | 17.x تشغيل ESLint + Prettier على الملفات المعدّلة فقط |
| **commitlint** | 21.x التزام بـ conventional commits (11 نوع مسموح) |
| **GitHub Actions CI** | أتمتة: lint → typecheck → test → build |
| **Dependabot** | تحديثات أسبوعية (npm + github-actions، مجمّعة) |
| **@playwright/test** | 1.61 اختبارات E2E (Desktop Chrome + Mobile Safari) |

---

## 3. العلامات التجارية والهوية البصرية

### نظام الألوان متعدد العلامات

يستخدم المشروع نظام `data-brand` attribute على عنصر `<html>` لتبديل الألوان ديناميكياً:

```css
:root[data-brand='lut']       { --primary: #8B6B3D; --background: #faf6ef; }
:root[data-brand='lalounge']  { --primary: #E6007E; --background: #150912; }
:root[data-brand='birthday']  { --primary: #FFCC00; --background: #020204; }
```

### مقياس ألوان OKLCH (30 درجة)

تم توليد 10 درجات (50-950) لكل علامة تجارية باستخدام OKLCH (perceptual uniformity):

| الدرجة | LUT Gold | La Lounge Magenta | Birthday Gold |
|--------|----------|-------------------|---------------|
| 50 | `oklch(96% 0.02 75)` | `oklch(96% 0.02 350)` | `oklch(97% 0.03 85)` |
| 500 (الأساسي) | `oklch(62% 0.10 75)` | `oklch(62% 0.24 350)` | `oklch(75% 0.17 85)` |
| 950 | `oklch(22% 0.03 75)` | `oklch(22% 0.10 350)` | `oklch(28% 0.05 85)` |

### ألوان Your Birthday (5 ألوان من اللوجو)

| اللون | Hex | الاستخدام |
|------|-----|-----------|
| ذهبي/أصفر | `#FFCC00` | اللون الأساسي (خلفية اللوجو العلوية) |
| بنفسجي عميق | `#4A235A` | لون ثانوي (خلفية اللوجو السفلية) |
| أحمر | `#E32636` | بالونات + CTAs حرجة |
| وردي فاتح | `#FFB6C1` | بالونات + highlights |
| أصفر لامع | `#FFD700` | بالونات + توهج |

### الخطوط (10 خطوط)

| الخط | الاستخدام | الأوزان |
|------|-----------|---------|
| **Cairo** | النصوص العربية الأساسية | 400, 500, 600, 700, 900 |
| **IBM Plex Sans Arabic** | العناوين العربية لـ La Lounge | 400, 500, 600, 700 |
| **Montserrat** | العناوين الإنجليزية | 400, 500, 600, 700, 800, 900 |
| **Inter** | النصوص الإنجليزية الأساسية | Variable font |
| **Lalezar** | عنوان Your Birthday (display) | 400 |
| **Poiret One** | عنوان La Lounge (display) | 400 |
| **Luckiest Guy** | عناصر Your Birthday | 400 |
| **Baloo 2** | نصوص Your Birthday الفرعية | Variable font |
| **Questrial** | عناصر LUT | 400 |
| **Rajdhani** | عناصر Your Birthday التقنية | Variable font |

---

## 4. التصميم والأنميشن

### الخلفيات ثلاثية الأبعاد (4 خلفيات Three.js)

كل علامة تجارية لها خلفية 3D مخصصة بـ Three.js مع post-processing (Bloom + FXAA):

#### 1. الصفحة الرئيسية (`hero-3d-background.tsx` — 1998 سطر)
- نفق حلزوني ذهبي مع أثاث طافٍ (كراسي، طاولات، إضاءة)
- مشهد حفل عيد ميلاد (بالونات، هدايا، DJ booth)
- مخطط معماري (blueprint) في المنتصف
- كاميرا سينمائية تفاعلية مع التمرير
- 200 جسيم ذهبي طافٍ

#### 2. LUT (`lut-3d-background.tsx` — 624 سطر)
- نفق دائري ذهبي بأثاث طافٍ
- 30 عنصر أثاث يدور في النفق
- 600 جسيم غبار متوهج
- كاميرا تتحرك للأمام باستمرار

#### 3. La Lounge (`la-lounge-3d-background.tsx` — 847 سطر)
- مخطط معماري (blueprint) ثلاثي الأبعاد بخطوط وردية
- طاولات، كراسي، إضاءة بأسلوب wireframe
- كاميرا تدور حول المشهد بمنظور isometric
- خلفية بيضاء فاتحة (مطابقة للوجو)

#### 4. Your Birthday (`birthday-3d-background.tsx` — 2068 سطر)
- مشهد احتفالي غني يشمل:
  - كعكة 3 طبقات فاخرة (مع أعمدة ذهبية، زخارف، شمعات)
  - 7 هدايا تدور حول الكعكة (أنماط تغليف متعددة + أشرطة)
  - 3 أشرطة حريرية متدفقة + أسطوانة دوارة
  - قلادة بالونات علوية + فوانيس طافية
  - كونفيتي (4 أشكال: مستطيل، نجمة، قلب، دائرة)
  - خلفية مخملية بطيات ستائر + أشعة ضوئية
  - أرضية عاكسة (Reflector) بحلقات ذهبية + بتلات متناثرة
- رحلة سينمائية تفاعلية مع التمرير + ذروة "تمنّى أمنية"
- أنميشن دخول سينمائي (كاميرا تنزلق من أعلى + توهج)
- 5 ألوان اللوجو مطبّقة على الإضاءة والبالونات

### تحسينات الأداء ثلاثية الأبعاد

| التحسين | التفاصيل |
|---------|---------|
| `getDeviceTier()` | يقسم الأجهزة: low (يتخطى 3D)، mid (موبايل، عناصر مخفّضة)، high (سطح مكتب، كامل) |
| `isReducedMotion()` | يحترم `prefers-reduced-motion` |
| Frame skipping | على الموبايل: عرض كل إطار ثاني (50% حمل GPU) |
| `pixelRatio` | 1.5 موبايل، 2.0 سطح مكتب |
| `shouldEnable3D()` | يتحقق من WebGL + الذاكرة + الأنوية قبل التشغيل |
| Cleanup كامل | dispose لكل geometries, materials, textures, renderer عند unmount |
| Strict Mode safe | كل useEffect له cleanup كامل |

### صفحات التحميل (4 صفحات CSS-only)

كل علامة لها صفحة تحميل مخصصة بـ CSS animations فقط (بدون JavaScript):

| الصفحة | المفهوم | الأنميشن |
|--------|---------|---------|
| **الرئيسية** | تلاحم العلامات الثلاث | 3 حلقات مدارية (ذهبي/وردي/أصفر) تدور باتجاهات معاكسة + توهج مركزي |
| **LUT** | أثاث التراث الفاخر | ثريا ذهبية ترسم نفسها (SVG stroke-dashoffset) + 5 شرارات طافية + ومضة ضوئية |
| **La Lounge** | فعاليات حديثة | كريستالة وردية تدور في 3D (perspective + rotateY) + 8 شرارات متلألئة |
| **Your Birthday** | احتفال | شمعة بشعلة مرتعشة + 5 بالونات طافية + 10 قطع كونفيتي + حقل نجوم |

### انتقالات الصفحات

استخدام `template.tsx` مع Framer Motion:
- `initial: { opacity: 0, y: 8 }` → `animate: { opacity: 1, y: 0 }` → `exit: { opacity: 0, y: -8 }`
- المدة: 0.35s، الـ easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- `MotionConfig reducedMotion="user"` يحترم تفضيل تقليل الحركة

### الطباعة العربية (Arabic Typography)

```css
[dir='rtl'] {
  line-height: 1.8;       /* ارتفاع سطر أكبر للعربية */
  letter-spacing: 0;       /* لا تباعد بين الحروف (يكسر ligatures) */
}
[dir='rtl'] .font-display { letter-spacing: 0; }
[dir='rtl'] .eyebrow { letter-spacing: 0.1em; }  /* مخفّض من 0.2em+ */
```

---

## 5. هيكل المشروع

```
/home/z/my-project/
├── src/
│   ├── app/                              # 28 صفحة + 9 API routes
│   │   ├── [locale]/                     # التدويل (ar/en)
│   │   │   ├── layout.tsx                # الـ root layout (JSON-LD + skip-link + fonts)
│   │   │   ├── template.tsx              # انتقالات الصفحات (Framer Motion)
│   │   │   ├── page.tsx                  # الصفحة الرئيسية (3 brand cards)
│   │   │   ├── loading.tsx               # شاشة التحميل (3 orbiting rings)
│   │   │   ├── error.tsx                 # معالج الأخطاء
│   │   │   ├── global-error.tsx          # معالج الأخطاء العامة
│   │   │   ├── products/                 # المنتجات + [slug] تفاصيل
│   │   │   ├── cart/                     # السلة
│   │   │   ├── checkout/                 # الدفع + payment + success
│   │   │   ├── admin/                    # لوحة التحكم
│   │   │   │   ├── login/                # تسجيل الدخول
│   │   │   │   └── (dashboard)/          # المنتجات + الفئات + الحجوزات
│   │   │   ├── last-unique-touch/        # صفحة LUT
│   │   │   ├── la-lounge/                # صفحة La Lounge
│   │   │   ├── your-birthday/            # صفحة Your Birthday
│   │   │   ├── contact/                  # تواصل
│   │   │   ├── about/                    # من نحن
│   │   │   ├── privacy/ terms/ refund/   # الصفحات القانونية
│   │   │   └── sitemap.ts + robots.ts    # SEO
│   │   └── api/                          # 9 مسارات API
│   │       ├── orders/                   # إنشاء الطلبات (Serializable tx)
│   │       ├── contact/                  # نموذج التواصل (+ n8n fan-out)
│   │       ├── bookings/birthday/        # حجوزات أعياد الميلاد
│   │       ├── webhooks/                 # payment-callback + payment-success
│   │       ├── products/[id]/availability/  # فحص التوفر
│   │       ├── products/check-slug/      # فحص الـ slug
│   │       ├── v1/health/                # فحص الصحة
│   │       └── route.ts                  # معلومات API
│   ├── components/                       # 84 مكون React
│   │   ├── landing/ (11)                 # hero, experience-card, hero-3d, etc.
│   │   ├── last-unique-touch/ (2)        # lut-3d-background, last-unique-touch-view
│   │   ├── la-lounge/ (3)               # la-lounge-3d-background, la-lounge-view, loading-screen
│   │   ├── your-birthday/ (6)           # birthday-3d-background, your-birthday-view, etc.
│   │   ├── admin/ (8)                    # admin-shell, products-table, bookings-table, etc.
│   │   ├── product/ (7)                  # product-info, model-canvas, product-gallery, etc.
│   │   ├── products/ (5)                 # products-filters, pagination, empty-state, etc.
│   │   ├── cart/ (1)                     # cart-view
│   │   ├── checkout/ (3)                 # checkout-view, payment-view, success-view
│   │   ├── contact/ (1)                  # contact-view
│   │   ├── layout/ (2)                   # navbar, footer
│   │   ├── providers/ (5)                # cart-provider, theme-provider, toast-provider, etc.
│   │   ├── ui/ (9)                       # button, input, label, select, badge, checkbox, etc.
│   │   ├── ui-premium/ (5)               # magnetic-button, reveal-text, custom-cursor, etc.
│   │   ├── legal/ (2)                    # page-header
│   │   ├── brand/ (4)                    # lut-arabesque, etc.
│   │   ├── seo/ (1)                      # json-ld
│   │   └── hero-3d/ (8)                  # model-3d, background-3d, etc.
│   ├── lib/                              # 28 ملف منطق (non-test)
│   │   ├── auth.ts                       # المصادقة + HMAC + cookie management
│   │   ├── crypto-utils.ts               # safeEqualStrings (timingSafeEqual)
│   │   ├── rate-limiter.ts               # تحديد المعدل (in-memory Map)
│   │   ├── get-client-ip.ts              # XFF parsing (right-to-left walk)
│   │   ├── products.ts                   # منتجات + التوفر + حساب الأسعار
│   │   ├── cart.ts                       # سلة + validation + limits
│   │   ├── n8n.ts                        # n8n webhook integration + SSRF protection
│   │   ├── db.ts                         # Prisma client singleton
│   │   ├── admin-brand.ts                # admin brand scoping
│   │   ├── admin-stats.ts                # إحصائيات لوحة التحكم
│   │   ├── brand-colors.ts               # ألوان العلامات التجارية
│   │   ├── device-capabilities.ts        # getDeviceTier + isReducedMotion + shouldEnable3D
│   │   ├── seo.ts                        # buildMetadata helper
│   │   ├── format.ts                     # Intl.NumberFormat (KWD + Arabic)
│   │   ├── format-date.ts                # تنسيق التواريخ
│   │   ├── contact-info.ts               # معلومات التواصل + WhatsApp URL
│   │   ├── content.ts                    # محتوى ديناميكي + cache
│   │   ├── brand.ts                      # مساعدات العلامات
│   │   └── utils.ts                      # cn() helper (clsx + tailwind-merge)
│   ├── hooks/                            # custom hooks
│   ├── i18n/                             # routing.ts + request.ts
│   ├── proxy.ts                          # middleware (Edge Runtime)
│   └── messages/                         # en.json + ar.json (573 keys each)
├── prisma/
│   ├── schema.prisma                     # 6 نماذج + 8 فهارس
│   ├── seed.ts                           # 21 منتج (15 LUT + 4 La Lounge + 2 Birthday)
│   └── migrations/                       # 7 migrations
├── e2e/                                  # 3 Playwright spec files (12 tests)
├── docs/adr/                             # 12 Architecture Decision Records + README
├── .github/                              # CI/CD + Dependabot + CODEOWNERS + PR template
├── .husky/                               # pre-commit + commit-msg hooks
├── public/                               # images + logos + icons
└── [config files]                        # next.config.ts, tsconfig.json, eslint, etc.
```

---

## 6. الصفحات والمسارات

### الصفحات (28 صفحة)

#### الصفحة الرئيسية
| المسار | الوصف |
|--------|-------|
| `/ar` أو `/en` | الصفحة الرئيسية بـ 3 بطاقات هوية تفاعلية |

#### المنتجات
| المسار | الوصف |
|--------|-------|
| `/ar/products` | قائمة المنتجات مع فلترة، بحث، فرز، pagination |
| `/ar/products/[slug]` | تفاصيل المنتج + تقويم + كمية + أضف للسلة |
| `/ar/cart` | السلة مع تعديل الكميات + حذف + حساب الفوري |
| `/ar/checkout` | نموذج الدفع + ملخص الطلب |
| `/ar/checkout/payment` | صفحة الدفع (دفع عبر الهاتف) |
| `/ar/checkout/success` | تأكيد الطلب الناجح |

#### العلامات التجارية
| المسار | الوصف |
|--------|-------|
| `/ar/last-unique-touch` | صفحة LUT (تأجير الأثاث) |
| `/ar/last-unique-touch/contact` | تواصل مخصص لـ LUT |
| `/ar/la-lounge` | صفحة La Lounge (الفعاليات) |
| `/ar/la-lounge/contact` | تواصل مخصص لـ La Lounge |
| `/ar/your-birthday` | صفحة Your Birthday (الحفلات) |
| `/ar/your-birthday/features` | ميزات Your Birthday |
| `/ar/your-birthday/contact` | تواصل مخصص لـ Your Birthday |

#### لوحة التحكم
| المسار | الوصف |
|--------|-------|
| `/ar/admin/login` | تسجيل الدخول |
| `/ar/admin` | لوحة التحكم (إحصائيات) |
| `/ar/admin/products` | إدارة المنتجات |
| `/ar/admin/products/new` | إضافة منتج |
| `/ar/admin/products/[id]/edit` | تعديل منتج |
| `/ar/admin/categories` | إدارة الفئات |
| `/ar/admin/bookings` | إدارة الحجوزات |
| `/ar/admin/bookings/[id]` | تفاصيل حجز |

#### صفحات أخرى
| المسار | الوصف |
|--------|-------|
| `/ar/contact` | نموذج التواصل العام |
| `/ar/about` | من نحن |
| `/ar/privacy` | سياسة الخصوصية |
| `/ar/terms` | الشروط والأحكام |
| `/ar/refund` | سياسة الاسترجاع |

### مسارات API (9 مسارات)

| المسار | الطريقة | الوصف |
|--------|---------|-------|
| `/api/orders` | POST | إنشاء طلب (Serializable tx + idempotency) |
| `/api/contact` | POST | نموذج التواصل (+ n8n webhook fan-out) |
| `/api/bookings/birthday` | POST | حجز حفلة عيد ميلاد |
| `/api/webhooks/payment-callback` | POST | webhook الدفع (HMAC + state machine) |
| `/api/webhooks/payment-success` | POST | webhook نجاح الدفع (mock) |
| `/api/products/[id]/availability` | GET | فحص التوفر (stock-aware) |
| `/api/products/check-slug` | GET | فحص توفر الـ slug |
| `/api/v1/health` | GET | فحص الصحة (+ DB ping) |
| `/api` | GET | معلومات API |

---

## 7. نظام الحجوزات والتأجير

### منطق فحص التوفر (Stock-Aware Availability)

```
availableStock = product.stock - sum(overlappingBookings.quantity)
available = availableStock >= requestedQuantity
```

**شرط التداخل (Overlap):**
```
startDate < effectiveEndDate AND endDate >= startDate
```

حيث `effectiveEndDate` تُمدد بيوم واحد للتأجير ليوم واحد (same-day) لضمان كشف التداخل.

### منع الحجز الزائد (Overbooking Prevention)

| الطبقة | الآلية |
|--------|--------|
| **المعاملة (Transaction)** | `Serializable` isolation level — يمنع TOCTOU race |
| **فحص داخل المعاملة** | إعادة قراءة المنتجات + الحجوزات داخل المعاملة |
| **Idempotency** | مفتاح فريد + `UNIQUE` constraint — يمنع التكرار |
| **State machine** | `VALID_BOOKING_TRANSITIONS` — يمنع تخفيض الحالة |

### حساب الأسعار (Server-Side)

السيرفر **يعيد حساب** كل القيم من قاعدة البيانات (لا ثقة بالعميل):
```
calculatedDays = Math.max(1, Math.ceil((endDate - startDate) / msPerDay))
expectedTotal = rentalPricePerDay × calculatedDays × quantity + securityDeposit × quantity
```
- يرفض إذا كانت القيم المرسلة لا تطابق (ضمن تسامح `KWD_TOLERANCE = 0.001`)
- الأسعار بـ KWD (3 منازل عشرية)

### حالات الحجز (Booking Status)

```
PENDING → CONFIRMED → COMPLETED
    ↓        ↓
    └→ CANCELLED
         ↓
         └→ PAYMENT_FAILED
```

`VALID_BOOKING_TRANSITIONS` يمنع التخفيض (مثلاً CONFIRMED لا يمكن العودة لـ PENDING).

### اختبارات الحجوزات (مُختبرة فعلياً)

| الاختبار | النتيجة |
|---------|---------|
| حجز same-day (يوم واحد) | ✅ يعمل — `days=1, total=13.5` |
| حجزان same-day لنفس اليوم | ✅ كلاهما يُكتشف كمتداخل |
| حجز qty=100 مع توفر 96 | ✅ مرفوض — `out_of_stock` |
| حجز يوم مختلف | ✅ لا تداخل — `availableStock=100` |
| حجز متعدد الأيام متداخل | ✅ يُكتشف التداخل |
| Idempotency (مفتاح مكرر) | ✅ يعيد نفس النتيجة — `duplicate_request` |

---

## 8. نظام السلة والدفع

### السلة (Cart)

| الميزة | التفاصيل |
|--------|---------|
| **التخزين** | `localStorage` مع `validateCartItem` كامل |
| **التحقق** | أعداد صحيحة موجبة للكمية والأيام، تواريخ ISO صالحة |
| **الحدود** | 50 منتج كحد أقصى، 100 وحدة كحد أقصى لكل منتج |
| **الحساب الفوري** | `rentalPricePerDay × days × quantity + securityDeposit × quantity` |
| **Hydration-safe** | `hydrated` flag يمنع SSR/CSR mismatch |
| **Event-driven** | `cart-updated` CustomEvent لتحديث المكونات |
| **Context** | `CartProvider` مع `useMemo` للقيمة + `useCallback` للدوال |

### الدفع (Checkout)

| الخطوة | التفاصيل |
|--------|---------|
| **1. النموذج** | اسم، هاتف، إيميل، عنوان، مدينة (Zod validation) |
| **2. التحقق من السلة** | رفض إذا السلة فارغة |
| **3. إنشاء الطلب** | `POST /api/orders` مع idempotency key |
| **4. الدفع** | عبر الهاتف فقط (PCI scope = صفر) |
| **5. النجاح** | `checkout/success?order=ID` |

---

## 9. المصادقة والأمان

### المصادقة (Authentication)

| الميزة | التفاصيل |
|--------|---------|
| **النوع** | كلمة مرور واحدة مشتركة (admin واحد) |
| **التوقيع** | `timestamp.HMAC-SHA256(SESSION_SECRET, timestamp)` |
| **الـ Cookie** | `__Host-lut_admin_session` في الإنتاج (Secure + HttpOnly + SameSite=Lax) |
| **المدة** | 7 أيام |
| **الإبطال** | `SESSION_EPOCH` — رفع القيمة يُبطل جميع الجلسات |
| **المقارنة** | `timingSafeEqual` (constant-time) |
| **Defense-in-depth** | proxy (Edge) + layout `requireAuth()` + server actions `requireAuth()` |

### الأمان (Security)

| الميزة | التفاصيل |
|--------|---------|
| **CSP** | `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'` |
| **HSTS** | `max-age=31536000; includeSubDomains; preload` |
| **Security headers** | X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| **Rate limiting** | login 5/min, orders 10/min, contact 3/min, birthday 5/min, availability 30/min |
| **XFF parsing** | right-to-left walk past `TRUSTED_PROXY_IPS` |
| **SSRF protection** | `validateWebhookUrl` يرفض: non-https، IP الخاص، localhost، IPv6 loopback |
| **Webhook security** | HMAC-SHA256 + timestamp + nonce + 5-min skew window + idempotency |
| **Input validation** | Zod على كل API route + server action |
| **SQL injection** | Prisma parameterized queries (لا SQL خام) |
| **XSS** | لا `dangerouslySetInnerHTML` (إلا JSON-LD مع `JSON.stringify` + `<` escape) |
| **CSRF** | Next.js server actions (Origin/Host verification) + `SameSite=Lax` |
| **PII logging** | مسارات API تسجل `paths` فقط (وليس `issues` values) |

---

## 10. لوحة التحكم (Admin)

### الميزات

| الميزة | التفاصيل |
|--------|---------|
| **إدارة المنتجات** | CRUD كامل: إنشاء، عرض، تعديل، حذف مع رفع صور + slug تلقائي |
| **إدارة الفئات** | CRUD كامل مع نطاق العلامة التجارية |
| **إدارة الحجوزات** | عرض + تحديث الحالة + تفاصيل العميل (اسم، هاتف، إيميل، عنوان) |
| **الإحصائيات** | إجمالي المنتجات، الحجوزات المعلقة، الحجوزات المؤكدة، المخزون المنخفض، الإيرادات الشهرية |
| **تبديل العلامة** | `admin-brand` cookie + نطاق العلامة في كل استعلام (منع cross-tenant) |
| **Brand scoping** | كل استعلام يفلتر بـ `getAdminBrand()` — لا تسريب بيانات بين العلامات |
| **Focus trap** | admin mobile drawer + confirm-delete dialog |
| **aria-current** | على روابط الـ nav النشطة |

---

## 11. قاعدة البيانات

### النماذج (6 نماذج)

| النموذج | الوصف | الحقول الرئيسية |
|---------|-------|-----------------|
| **Product** | المنتجات | nameAr, nameEn, slug, brand, rentalPricePerDay, securityDeposit, stock, images, isActive |
| **Category** | الفئات | nameAr, nameEn, slug, brand |
| **Booking** | الحجوزات | productId, startDate, endDate, quantity, status, customerName/Phone/Email, totalAmount, address, city |
| **IdempotencyKey** | مفاتيح Idempotency | key (UNIQUE), expiresAt, orderId |
| **SecurityLog** | سجل الأمان | event, details, ip, brand |
| **ContactMessage** | رسائل التواصل | name, email, phone, subject, message, brand |

### الفهارس (13 فهرس)

| الفهرس | النموذج | الاستخدام |
|--------|---------|-----------|
| `@@unique([brand, slug])` | Category, Product | منع تكرار الـ slug داخل العلامة |
| `@@index([brand, slug])` | Category, Product | بحث سريع |
| `@@index([brand, categoryId])` | Product | فلترة بالفئة |
| `@@index([brand, isActive])` | Product | فلترة بالحالة |
| `@@index([productId, startDate, endDate])` | Booking | فحص التداخل السريع |
| `@@index([status])` | Booking | فلترة بالحالة |
| `key @unique` | IdempotencyKey | منع التكرار |
| `@@index([key, expiresAt])` | IdempotencyKey | تنظيف المفاتيح المنتهية |
| `@@index([event, createdAt])` | SecurityLog | بحث الأحداث |

### البيانات الحالية (Seed)

| العلامة | عدد المنتجات |
|---------|-------------|
| LUT | 15 (كراسي، طاولات، إضاءة) |
| La Lounge | 4 |
| Your Birthday | 2 |
| **الإجمالي** | **21 منتج** |

---

## 12. التدويل (i18n)

| الميزة | التفاصيل |
|--------|---------|
| **اللغات** | العربية (RTL، افتراضية) + الإنجليزية (LTR) |
| **التوجيه** | `next-intl` v4 مع `[locale]` routing |
| **`localeDetection`** | `false` — لا auto-detect من Accept-Language |
| **مفاتيح** | 573 مفتاح لكل لغة (parity 100%) |
| **RTL/LTR** | `dir` attribute على `<html>` + CSS logical properties |
| **CSS** | `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-` (لا `ml-`, `mr-`, `left-`, `right-`) |
| **الأسعار** | `Intl.NumberFormat` مع `numberingSystem: 'latn'` للعربية |
| **ICU plural** | `products.resultCount` يستخدم 6 صيغ جمع للعربية |

---

## 13. SEO والأداء

### SEO

| الميزة | التفاصيل |
|--------|---------|
| **Metadata** | `buildMetadata()` helper — title, description, OpenGraph, Twitter Card |
| **Canonical URLs** | لكل صفحة |
| **hreflang** | بدائل عربي/إنجليزي في sitemap |
| **JSON-LD** | Organization + WebSite structured data في layout |
| **Sitemap** | ديناميكي (`/sitemap.xml`) يشمل كل المنتجات + hreflang |
| **robots.txt** | يسمح بالصفحات، يمنع `/api` و `/admin` |
| **noIndex** | على cart, checkout, payment, success (يمنع تسريب IDs الطلبات) |
| **`dynamicParams = false`** | على صفحة المنتج → 404 صحيح للمنتجات غير الموجودة |

### الأداء

| الميزة | التفاصيل |
|--------|---------|
| **`output: 'standalone'`** | إنتاج مستقل (نشر أخف) |
| **`poweredByHeader: false`** | إخفاء Next.js version |
| **`reactStrictMode: true`** | كشف المشاكل في dev |
| **Image optimization** | `next/image` مع AVIF + WebP، cache 30 يوم |
| **Dynamic imports** | `next/dynamic` لـ Three.js (ssr: false) + react-day-picker |
| **`unstable_cache`** | على `getProducts`, `getProductBySlug`, `getCategoriesByBrand` |
| **`revalidateTag`** | إبطال cache بعد عمليات الإدارة |
| **Font optimization** | `next/font` (self-hosted, `display: swap`) |

---

## 14. الاختبارات

### اختبارات الوحدة (Vitest)

| الملف | عدد الاختبارات | التغطية |
|-------|----------------|---------|
| `auth.test.ts` | 13 | HMAC, session, epoch, timing-safe |
| `brand.test.ts` | 12 | brand resolution, color mapping |
| `cart.test.ts` | 8 | add, remove, update, merge, validate |
| `contact-info.test.ts` | 14 | WhatsApp URL, phone validation |
| `crypto-utils.test.ts` | 8 | safeEqualStrings, Unicode, mismatches |
| `format-date.test.ts` | 6 | date formatting, locales |
| `n8n.test.ts` | 6 | webhook URL, signature, timeout |
| `products.test.ts` | 14 | parseImages, calculateRentalTotal, availability |
| `rate-limiter.test.ts` | 6 | rate limiting, window reset |
| `orders.test.ts` | 5 | validation rejection paths |
| `contact.test.ts` | 10 | contact API validation |
| `health.test.ts` | 2 | health endpoint |
| **الإجمالي** | **104** | **12 ملف** |

### اختبارات E2E (Playwright)

| الملف | عدد الاختبارات | التغطية |
|-------|----------------|---------|
| `homepage.spec.ts` | 4 | AR/EN load, 3 brand cards, taglines, 3D/fallback |
| `brand-navigation.spec.ts` | 4 | click each card → correct URL, no console errors |
| `admin-login.spec.ts` | 4 | login page, empty/wrong password, rate limiting |
| **الإجمالي** | **12** | **3 ملفات** |

### حالة الاختبارات

```
✅ 104/104 unit tests pass (9.3s)
✅ ESLint: 0 errors
✅ TypeScript: 0 errors
✅ 0 console.log in src/
✅ 0 @ts-ignore in src/
```

---

## 15. جودة الكود

### معايير الجودة المطبّقة

| المعيار | الحالة |
|---------|--------|
| ESLint errors | 0 ✅ |
| TypeScript errors | 0 ✅ |
| `console.log` in src/ | 0 ✅ |
| `@ts-ignore` / `@ts-nocheck` | 0 ✅ |
| `hover:scale-*` (AI slop) | 0 ✅ |
| `transition-all` | 0 ✅ |
| `bg-clip-text` (gradient text) | 0 ✅ |
| `text-white` | 0 ✅ (استُبدلت بـ `text-primary-foreground`) |
| WCAG AA (LUT gold) | 4.92:1 ✅ |
| i18n parity | 573/573 ✅ |
| Dead code | ~5,300 سطر أُزيل ✅ |

### ESLint Rules (critical = error)

```javascript
'@typescript-eslint/no-explicit-any': 'error'
'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
'@typescript-eslint/no-non-null-assertion': 'error'
'@typescript-eslint/ban-ts-comment': 'error'
'react-hooks/exhaustive-deps': 'error'
'@next/next/no-img-element': 'error'
'prefer-const': 'error'
'no-debugger': 'error'
'no-empty': 'error'
'no-unreachable': 'error'
'no-irregular-whitespace': 'error'
'no-useless-escape': 'error'
'no-console': ['warn', { allow: ['warn', 'error'] }]
```

### TypeScript Strict Flags

```json
{
  "strict": true,
  "noImplicitAny": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true
}
```

---

## 16. CI/CD والبنية التحتية

### GitHub Actions CI Pipeline

```yaml
Trigger: push to main + pull_request to main
Steps:
  1. Checkout (actions/checkout@v4)
  2. Setup Bun (oven/setup-bun@v2)
  3. Setup Node.js 20 (actions/setup-node@v4)
  4. Cache node_modules + .next/cache
  5. Install: bun install --frozen-lockfile
  6. Lint: bun run lint
  7. Typecheck: bun run typecheck
  8. Test: bun run test
  9. Build: bun run build
Concurrency: cancel-in-progress on same branch
```

### Dependabot

- **npm**: أسبوعياً، مجمّعة (next, react, prisma, tailwind, three, eslint, vitest)
- **github-actions**: أسبوعياً
- حد أقصى: 10 PRs مفتوحة لنظام npm

### Husky Hooks

| الـ Hook | الأمر |
|---------|-------|
| `pre-commit` | `bun run lint-staged` (ESLint + Prettier على الملفات المعدّلة) |
| `commit-msg` | `bun run commitlint --edit "$1"` (conventional commits) |

### Caddy Reverse Proxy

- **TLS termination** + HTTPS
- **`XTransformPort=3000`** gate لطلبات API
- **Static assets** bypass (ملفات عامة)
- **403 fallback** لكل ما ليس static أو غير مصرّح

---

## 17. التوثيق

| الملف | الوصف |
|------|-------|
| **CLAUDE.md** | سياق المشروع للـ AI assistants (stack, brands, colors, commands, conventions) |
| **CONTRIBUTING.md** | دليل المساهمة (setup, commits, PR process, code style, testing, DB) |
| **docs/adr/README.md** | فهرس 12 ADR |
| **docs/adr/ADR-001** | Auth, security & webhooks |
| **docs/adr/ADR-002** | Multi-tenant brand scoping |
| **docs/adr/ADR-003** | Stock-aware availability |
| **docs/adr/ADR-004** | Shared layout refactor |
| **docs/adr/ADR-005** | i18n locale defaults |
| **docs/adr/ADR-006** | Performance optimizations |
| **docs/adr/ADR-007** | Brand color system & 3D |
| **docs/adr/ADR-008** | Defensive client error handling |
| **docs/adr/ADR-009** | Accessibility & focus management |
| **docs/adr/ADR-010** | Routing, 404 & dynamic params |
| **docs/adr/ADR-011** | Contact form async fanout |
| **docs/adr/ADR-012** | Edge runtime crypto & IP parsing |
| **.github/CODEOWNERS** | `@Akrout111` مالك كل الملفات |
| **.github/pull_request_template.md** | checklist (testing, security, a11y, i18n, DB) |
| **problems-tracker.md** | تتبع المشاكل المتبقية والمؤجّلة |

---

## 18. الإحصائيات النهائية

| المؤشر | القيمة |
|--------|--------|
| **ملفات TypeScript** | 191 |
| **مكونات React** | 84 |
| **الصفحات** | 28 |
| **مسارات API** | 9 |
| **ملفات lib** | 28 (non-test) |
| **ملفات اختبار** | 12 (unit) + 3 (E2E) |
| **التبعيات** | 57 (+ 23 dev) |
| **مفاتيح i18n** | 573 × 2 لغة = 1,146 |
| **اختبارات الوحدة** | 104 (جميعها تنجح) |
| **اختبارات E2E** | 12 |
| **نماذج Prisma** | 6 |
| **فهارس DB** | 13 |
| **منتجات في DB** | 21 (15 LUT + 4 La Lounge + 2 Birthday) |
| **ADRs** | 12 |
| **خطوط مخصصة** | 10 |
| **خلفيات 3D** | 4 (إجمالي ~5,500 سطر Three.js) |
| **صفحات تحميل** | 4 (CSS-only animations) |
| **commits على GitHub** | 60+ |
| **آخر commit** | `2f3dc94` (v62) |
| **حالة GitHub** | متزامن 100% ✅ |
| **ESLint errors** | 0 ✅ |
| **TypeScript errors** | 0 ✅ |
| **console.log** | 0 ✅ |
| **@ts-ignore** | 0 ✅ |

---

*تم إعداد هذا التقرير في يوليو 2026. المشروع في حالة جاهزية للإنتاج كودياً، مع توثيق شامل واختبارات كاملة.*
