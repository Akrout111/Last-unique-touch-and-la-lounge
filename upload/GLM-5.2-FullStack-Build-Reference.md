# 🏗️ الدليل المرجعي لبناء المشاريع — GLM 5.2 Full Stack Agent

> **مرجع معياري شامل** يستخدمه وكيل GLM 5.2 Full Stack لبناء مشاريع Next.js متكاملة من الصفر.
> مبني على تجربة عملية في بناء مشاريع حقيقية (منصة الفعاليات الكويتية + مشاريع أخرى) عبر منهجية Vibe Coding 7.0.
>
> **الإصدار:** 2.0 | **الموجّه إلى:** GLM 5.2 Full Stack Agent | **آخر تحديث:** يونيو 2026

---

## 📑 فهرس المحتويات

1. [كيف يستخدم الوكيل هذا المرجع](#1-كيف-يستخدم-الوكيل-هذا-المرجع)
2. [منهجية Vibe Coding 7.0](#2-منهجية-vibe-coding-70)
3. [المكدس التقني القياسي (Tech Stack)](#3-المكدس-التقني-القياسي-tech-stack)
4. [القواعد الصارمة الـ15 (غير قابلة للتفاوض)](#4-القواعد-الصارمة-ال15-غير-قابلة-للتفاوض)
5. [بنية المشروع وترتيب المجلدات](#5-بنية-المشروع-وترتيب-المجلدات)
6. [خطوات بناء المشروع من الصفر — مرحلة بمرحلة](#6-خطوات-بناء-المشروع-من-الصفر--مرحلة-بمرحلة)
7. [الإعدادات الأساسية (Config Templates)](#7-الإعدادات-الأساسية-config-templates)
8. [قوالب الكود القياسية (Code Templates)](#8-قوالب-الكود-القياسية-code-templates)
9. [أنماط متقدمة (Advanced Patterns)](#9-أنماط-متقدمة-advanced-patterns)
10. [معايير التسمية وكتابة الكود](#10-معايير-التسمية-وكتابة-الكود)
11. [خطة العمل المرحلية (Micro-Sprints Plan)](#11-خطة-العمل-المرحلية-micro-sprints-plan)
12. [بوابة الجودة (Stop Gate QA)](#12-بوابة-الجودة-stop-gate-qa)
13. [أخطاء بيئة الـ Sandbox الحرجة (غير مذكورة في القواعد الـ15)](#13-أخطاء-بيئة-الـ-sandbox-الحرجة-غير-مذكورة-في-القواعد-ال15)
14. [طريقة البناء النهائية المُثلى (Best Build Pipeline)](#14-طريقة-البناء-النهائية-المُثلى-best-build-pipeline)

---

## 1. كيف يستخدم الوكيل هذا المرجع

### 1.1 دور هذا المرجع

هذا الملف هو **المصدر الواحد (Single Source of Truth)** لكل قرار معماري وقاعدة كتابة كود في المشروع. يجب على الوكيل (GLM 5.2 Full Stack Agent) الالتزام به من اللحظة الأولى لإنشاء المشروع وحتى تسليمه.

### 1.2 متى يُقرأ هذا المرجع؟

- **عند بدء مشروع جديد**: اقرأه بالكامل قبل كتابة أي سطر كود.
- **عند بدء ميزة جديدة**: أعد قراءة الأقسام ذات الصلة (القواعد، القوالب).
- **عند مراجعة الكود**: استخدم قسم "بوابة الجودة" كقائمة فحص.
- **عند مواجهة خطأ**: ارجع إلى الملف المرجعي للمساعد (الشقيق لهذا الملف) لتشخيصه.

### 1.3 الملف المرجعي الشقيق

يوجد ملف شقيق لهذا المرجع اسمه **`GLM-5.2-Assistant-Operations-Reference.md`**. هذا الملف الشقيق موجّه إلى وكيل آخر (GLM 5.2 Assistant) مهمته:

- استكشاف الأخطاء وإصلاحها أثناء التطوير والنشر.
- إدارة عملية الـ Deploy (Railway, Supabase, Docker).
- تحليل المشروع وتدقيقه أمنياً وأدائياً.
- تقديم قوائم المراجعة (Checklists) والقيادة في عملية الإطلاق.

**التقسيم المنطقي:**
- هذا الملف (Build Reference) = "كيف نَبني بشكل صحيح من البداية".
- الملف الشقيق (Operations Reference) = "كيف نُشخّص ونُصلح ونُنشر ونُحلّل".

### 1.4 القاعدة الذهبية

> **ابنِ بمنهجية، اختبر بصرامة، وثّق بوضوح.**
>
> كل سطر كود تكتبه يجب أن يخضع للقواعد الـ15، ويجتاز بوابة الجودة، ويكون قابلاً للصيانة من وكيل آخر بعدك.

---

## 2. منهجية Vibe Coding 7.0

### 2.1 ما هي منهجية Vibe Coding 7.0؟

هي منهجية تطوير برمجي تعتمد على ثلاث ركائز أساسية تضمن جودة الكود وأمانه وقابلية صيانته عند بناء المشاريع باستخدام وكلاء الذكاء الاصطناعي. هذه المنهجية طُوّرت عبر 13 سبنت (Sprint) من التطوير المتواصل، وقد أثبتت فعاليتها في تقليل الأخطاء الحرجة بنسبة 60% بعد تطبيقها بشكل صحيح.

### 2.2 الركيزة الأولى: مبدأ المصدر الواحد (Single Source Principle)

**المفهوم:** يجب أن يكون هناك وكيل ذكاء اصطناعي واحد فقط هو "المهندس المعماري" للمشروع، يجمع كل القرارات المعمارية والقواعد في ملف واحد قابل للوصول من جميع الوكلاء.

**التطبيق العملي:**

- أنشئ ملف `ARCHITECTURE.md` في جذر المشروع يحتوي على كل القواعد.
- كل وكيل فرعي (subagent) يجب أن يقرأ هذا الملف قبل البدء بأي مهمة.
- لا تسمح لوكلاء متعددين باتخاذ قرارات معمارية متضاربة.
- أي قرار جديد يضاف لملف `ARCHITECTURE.md` ويُوثّق بتاريخه وسببه.

**قالب `ARCHITECTURE.md`:**

```markdown
# ARCHITECTURE.md — قرارات معمارية للمشروع

## Tech Stack
- Next.js 16 (App Router)
- TypeScript (strict mode)
- Clerk for Authentication
- Prisma + PostgreSQL
- Tailwind CSS v4
- shadcn/ui components

## Rules
- Rule 1: Prisma singleton pattern (lib/prisma.ts)
- Rule 2: Clerk auth pattern (auth() + clerkMiddleware)
- Rule 3: API response format (successResponse/errorResponse)
- Rule 4: Decimal → .toString() before JSON
- Rule 5: kebab-case file names
- Rule 6: CSS Logical Properties (RTL-first)
- Rule 7: shadcn/ui only (no Material UI/Ant Design)
- Rule 8: useTranslations() for all UI text
- Rule 9: Zod v4 with `message` for every field
- Rule 10: catch blocks use `unknown` (not `any`)
- Rule 11: Role protection on server side
- Rule 12: No `any` type (use `unknown` or explicit interfaces)
- Rule 13: No Server Actions — use API Routes
- Rule 14: Link from `@/i18n/routing`
- Rule 15: `@/` import alias only

## Decisions Log
- 2026-06-15: اخترنا Clerk بدلاً من NextAuth لتوفير أسابيع من العمل
- 2026-06-16: استخدمنا Decimal(10, 3) للعملة الكويتية (KWD = 1000 فلس)
- 2026-06-17: اعتمدنا SQLite للتطوير المحلي و PostgreSQL للإنتاج
```

### 2.3 الركيزة الثانية: حلقة Micro-Sprint (Micro-Sprint Loop)

**المفهوم:** بدلاً من العمل بسبنتات طويلة (أسبوعين أو أكثر)، قسّم العمل إلى سبنتات صغيرة جداً (30 دقيقة إلى 3 ساعات لكل سبنت) مع دورة تطوير سريعة.

**هيكل السبنت الواحد:**

```
1. تحديد الهدف الواحد للسبنت (Goal)
2. كتابة الكود (Code)
3. الاختبار الفوري (Test)
4. المراجعة الذاتية (Self-Review)
5. التحقق من القواعد (Rules Check)
6. الدمج (Merge)
```

**الفوائد المثبتة:**

- اكتشاف الأخطاء في وقت مبكر جداً.
- تقليل التراجع عن القرارات (rework) بنسبة 70%.
- الحفاظ على تركيز الوكيل على مهمة واحدة.
- إمكانية العودة لنسخة سابقة بسهولة عند الفشل.

### 2.4 الركيزة الثالثة: Stop Gate QA (بوابة التوقف لضمان الجودة)

**المفهوم:** في نهاية كل سبنت، يجب التوقف عند "بوابة جودة" لا يمكن تجاوزها إلا بعد التحقق من معايير محددة (راجع قسم 12 في هذا الملف).

> ⚠️ **تحذير حرج:** لا تتجاوز بوابة الجودة أبداً. إذا فشل أي بند، أصلحه قبل المضي قدماً. تجاوز البوابة هو السبب الأول لتراكم الديون التقنية.

### 2.5 دورة حياة المشروع الكاملة

```
[التخطيط] → [الإعداد] → [السبنت 1] → [Stop Gate] → [السبنت 2] → [Stop Gate] →
   ... → [التدقيق النهائي] → [الإطلاق] → [المراقبة]
```

كل مرحلة لها مدخلات ومخرجات محددة، ولا يمكن الانتقال للمرحلة التالية إلا بإكمال مخرجات المرحلة السابقة.

---

## 3. المكدس التقني القياسي (Tech Stack)

### 3.1 الأساسيات (غير قابلة للتغيير)

| الطبقة | التقنية | السبب |
|--------|---------|-------|
| **Framework** | Next.js 16 (App Router) | أحدث إصدار، SSR/SSG، RSC، API Routes |
| **Language** | TypeScript 5 (strict) | أمان الأنواع، كشف الأخطاء قبل التشغيل |
| **Styling** | Tailwind CSS 4 | سرعة، اتساق، responsive، دعم RTL |
| **UI Components** | shadcn/ui (New York) | جودة عالية، قابلية تخصيص، لا قفل بائع |
| **Icons** | Lucide React | خفيف، tree-shaking |
| **Database ORM** | Prisma 6.x | TypeScript-first + migrations آمنة |
| **Database (Dev)** | SQLite | تطوير سريع، لا حاجة لخادم |
| **Database (Prod)** | PostgreSQL (Supabase) | موثوقية، JSONB، Enums، pooling |
| **Auth** | Clerk (مُفضّل) أو NextAuth.js v4 | جاهز، آمن، يوفّر أسابيع |
| **i18n** | next-intl | RTL/LTR، تعدد اللغات، تكامل مع App Router |
| **State (Client)** | Zustand | بساطة وأداء |
| **State (Server)** | TanStack Query | caching، optimistic updates |
| **Validation** | Zod v4 | تحقق من الأنواع في الـ runtime |
| **Animation** | Framer Motion | حركات ناعمة |
| **3D (اختياري)** | Three.js + React Three Fiber | تأثيرات بصرية متقدمة |
| **Package Manager** | Bun | سرعة فائقة + دعم TypeScript أصلي |
| **Runtime** | Bun | أداء أفضل من Node.js |
| **Containerization** | Docker (multi-stage) | بيئة متّسقة بين dev و production |
| **Base Image** | `oven/bun:1-slim` | صورة رسمية خفيفة |
| **Hosting** | Railway | نشر سهل + healthcheck + variables |
| **Database Hosting** | Supabase | طبقة مجانية + PgBouncer pooling |

### 3.2 البنية التحتية

```
Next.js App (port 3000)
    │
    ├── Caddy Gateway (port 81 → exposed externally)
    │       └── XTransformPort query → mini-services
    │
    ├── Mini-Services (WebSocket, cron, etc.)
    │       └── port 3003+ (each independent Bun project)
    │
    └── Database (SQLite dev / PostgreSQL prod)
```

### 3.3 لماذا هذه الاختيارات؟

1. **SQLite للتطوير**: لا حاجة لخادم قاعدة بيانات، سريع، كافٍ لمعظم المشاريع. انتقل إلى PostgreSQL للإنتاج.
2. **Clerk بدلاً من بناء auth من الصفر**: يوفّر أسابيع من العمل، يدعم متعدد المزودين، أمان جاهز.
3. **shadcn/ui بدلاً من مكتبات UI الجاهزة**: الكود يصبح ملكك، قابل للتخصيص الكامل، لا قفل بائع.
4. **Zustand بدلاً من Redux**: أبسط، أسرع، كافٍ لمعظم الحالات.
5. **next-intl بدلاً من next-i18next**: مدمج أفضل مع App Router.
6. **Bun بدلاً من npm/pnpm**: أسرع بـ 10-30 مرة في تثبيت الحزم، يدعم TypeScript أصلاً بدون `tsx`.

---

## 4. القواعد الصارمة الـ15 (غير قابلة للتفاوض)

> ⚠️ تطبيق هذه القواعد من البداية يمنع 90% من الأخطاء. تجاهل أي منها سيؤدي إلى أخطاء صعبة الإصلاح لاحقاً.

### القاعدة 1: Prisma Singleton Pattern

**المشكلة:** في التطوير، يحفظ Next.js الـ module، مما يُنشئ عدة اتصالات ويسبب `PrismaClientInitializationError` واستنفاد الاتصالات.

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

**الاستخدام:** `import { db } from '@/lib/db'` — دائماً، في كل مكان.

### القاعدة 2: مصادقة آمنة — `useSafeAuth()` و `useSafeUser()`

**المشكلة:** `useUser()` من Clerk يُرجع `undefined` أثناء التحميل، مما يسبب crashes في الواجهة.

```typescript
// src/hooks/use-safe-auth.ts
import { useAuth, useUser } from '@clerk/nextjs'

export function useSafeAuth() {
  const { isLoaded, isSignedIn, userId } = useAuth()
  return {
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    userId: userId ?? null,
  }
}

export function useSafeUser() {
  const { user } = useUser()
  return {
    name: user?.firstName ?? '',
    email: user?.emailAddresses?.[0]?.emailAddress ?? '',
    imageUrl: user?.imageUrl ?? '',
  }
}
```

**في Server Components:**

```typescript
import { auth, currentUser } from '@clerk/nextjs/server'

export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null

  const clerkUser = await currentUser()
  if (!clerkUser) return null

  // مزامنة مع قاعدة البيانات
  return await db.user.findUnique({ where: { clerkId: userId } })
}
```

### القاعدة 3: استجابات API موحّدة

```typescript
// src/lib/api-response.ts
export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function successResponse<T>(
  data: T,
  message: string,
  meta?: PaginationMeta,
  status = 200
) {
  return Response.json(
    { success: true, data, message, ...(meta && { meta }) },
    { status }
  )
}

export function errorResponse(
  code: string,
  message: string,
  field?: string,
  status = 400
) {
  return Response.json(
    { success: false, error: { code, message, field: field ?? null } },
    { status }
  )
}
```

**التنسيق الموحّد:**

```json
// نجاح
{ "success": true, "data": {...}, "message": "...", "meta": {...} }

// خطأ
{ "success": false, "error": { "code": "...", "message": "...", "field": null } }
```

### القاعدة 4: Decimal → `.toString()` دائماً

عند إرجاع قيم Decimal من Prisma في JSON، يجب تحويلها إلى string دائماً لتجنب فقدان الدقة وأخطاء التسلسل.

```typescript
// ❌ خطأ: قد يفقد الدقة + يفشل JSON.stringify
return successResponse({ price: event.price }, '...')

// ✅ صحيح
return successResponse({ price: event.price.toString() }, '...')
```

**لـ SQLite (الذي لا يدعم Decimal):** خزّنها كـ String بـ 3 منازل عشرية:

```prisma
price String  // "15.500" بدلاً من Decimal
```

**لـ PostgreSQL:** استخدم `Decimal(10, 3)` للعملة الكويتية (الدينار = 1000 فلس):

```prisma
price Decimal @db.Decimal(10, 3)
```

### القاعدة 5: أسماء الملفات kebab-case

```
✅ components/event-card.tsx
✅ app/(dashboard)/events/page.tsx
✅ lib/api-response.ts
✅ hooks/use-safe-auth.ts

❌ components/EventCard.tsx
❌ components/eventCard.tsx
❌ components/event_card.tsx
```

- الملفات: `kebab-case` (`event-card.tsx`, `api-client.ts`)
- المكونات داخل الملفات: `PascalCase` (`EventCard`, `ApiClient`)
- المسارات (routes): `kebab-case` أيضاً: `/event-details/[slug]`

### القاعدة 6: CSS Logical Properties (RTL-first)

صمم وأنت تفكر في RTL أولاً، لأن العربية هي اللغة الأساسية. اختبر RTL قبل LTR.

```css
/* ❌ خطأ: لا يدعم RTL */
margin-left: 16px;
padding-right: 8px;
text-align: left;
.sidebar { left: 0; }
.icon { margin-right: 8px; }

/* ✅ صحيح: يدعم RTL تلقائياً */
margin-inline-start: 16px;
padding-inline-end: 8px;
text-align: start;
.sidebar { inset-inline-start: 0; }
.icon { margin-inline-end: 8px; }
```

**في Tailwind 4:** استخدم `ms-`, `me-`, `ps-`, `pe-`, `start-0`, `end-0` بدلاً من `ml-`, `mr-`, `pl-`, `pr-`, `left-0`, `right-0`.

### القاعدة 7: shadcn/ui فقط — لا مكونات من الصفر

قبل بناء أي مكون، تحقق من `src/components/ui/`. إذا وجدت `Button`, `Card`, `Dialog`, `Sheet`, `Tabs`, `Toast`, إلخ — استخدمها.

**استثناء:** المكونات الخاصة بالأعمال (مثل `EventCard`, `BookingForm`) تُبنى فوق مكونات shadcn/ui.

**لا تثبت مكتبات UI إضافية** (Material UI, Ant Design, Chakra) لأنها:
- تتعارض مع Tailwind.
- تخلق قفل بائع (vendor lock-in).
- يصعب تخصيصها بالكامل.

### القاعدة 8: تدويل (i18n) كل النصوص

```tsx
// ❌ خطأ
<h1>مرحباً بك</h1>
<button>Book Now</button>

// ✅ صحيح
const t = useTranslations('HomePage')
<h1>{t('welcome')}</h1>
<button>{t('bookNow')}</button>
```

**ملفات الترجمة:** `src/messages/ar.json` و `src/messages/en.json` — كل نص يظهر للمستخدم يجب أن يمر عبر `useTranslations()`.

### القاعدة 9: Zod v4 مع `message` لكل حقل

```typescript
// ❌ خطأ: رسائل افتراضية غير مفهومة
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})

// ✅ صحيح: رسائل واضحة بالعربية
const schema = z.object({
  email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }),
  name: z.string().min(2, { message: 'الاسم قصير جداً' }),
  password: z
    .string()
    .min(8, { message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
    .regex(/[A-Z]/, { message: 'يجب أن تحتوي على حرف كبير' })
    .regex(/[a-z]/, { message: 'يجب أن تحتوي على حرف صغير' })
    .regex(/[0-9]/, { message: 'يجب أن تحتوي على رقم' })
    .regex(/[^A-Za-z0-9]/, { message: 'يجب أن تحتوي على رمز خاص' }),
})
```

### القاعدة 10: catch blocks تستخدم `unknown` وليس `any`

```typescript
// ❌ خطأ
try {
  // ...
} catch (error: any) {
  console.log(error.message)
  return errorResponse('ERR', error.message)
}

// ✅ صحيح
try {
  // ...
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'حدث خطأ غير متوقع'
  console.error('API error:', message, error)
  return errorResponse('INTERNAL_ERROR', message, undefined, 500)
}
```

### القاعدة 11: حماية الأدوار على مستوى الخادم

تحقق من دور المستخدم في كل صفحة محمية وAPI endpoint، وليس فقط من تسجيل الدخول.

```typescript
// src/app/api/v1/admin/users/route.ts
import { getCurrentUser } from '@/lib/auth-server'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'يجب تسجيل الدخول', undefined, 401)
    }
    if (user.role !== 'ADMIN') {
      return errorResponse('FORBIDDEN', 'غير مصرح', undefined, 403)
    }
    // ... المنطق
  } catch (error: unknown) {
    // ...
  }
}
```

**في middleware:**

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isOrganizerRoute = createRouteMatcher(['/organizer(.*)'])
const isProtected = createRouteMatcher(['/dashboard(.*)', '/api/v1/(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect({ role: 'org:admin' })
  }
  if (isOrganizerRoute(req)) {
    await auth.protect({ role: 'org:member' })
  }
  if (isProtected(req)) {
    await auth.protect()
  }
})
```

### القاعدة 12: لا `any` نهائياً

**البدائل:**

- `unknown` عندما لا تعرف النوع.
- `Record<string, unknown>` للكائنات العامة.
- تعريف `type` أو `interface` واضح.

```typescript
// ❌ خطأ
function processData(data: any) {
  return data.users
}

// ✅ صحيح
interface UserData {
  users: User[]
}

function processData(data: unknown): User[] {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Invalid data')
  }
  if (!('users' in data)) {
    throw new Error('Missing users field')
  }
  return (data as UserData).users
}
```

### القاعدة 13: لا Server Actions — استخدم API Routes

كل منطق الخادم يكون في `src/app/api/v1/.../route.ts`. الواجهة تستدعيها عبر `fetch` أو `api-client.ts`.

**الأسباب:**

- API Routes أسهل في الاختبار.
- تجنب مشاكل CSRF الافتراضية في Server Actions.
- فصل أوضح بين client و server.
- توثيق API أوضح.

### القاعدة 14: `Link` من `@/i18n/routing` وليس من `next/link`

```tsx
// ❌ خطأ: يفقد الـ locale
import Link from 'next/link'
<Link href="/events">Events</Link>

// ✅ صحيح: يحافظ على الـ locale تلقائياً
import { Link } from '@/i18n/routing'
<Link href="/events">Events</Link>
// الناتج: /ar/events أو /en/events
```

### القاعدة 15: استيراد `@/` فقط — لا استيرادات نسبية

```typescript
// ❌ خطأ
import { Button } from '../../components/ui/button'
import { db } from '../../../lib/db'

// ✅ صحيح
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
```

**الإعداد في `tsconfig.json`:**

```json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

---

## 5. بنية المشروع وترتيب المجلدات

### 5.1 البنية الكاملة الموصى بها

```
my-project/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                    # الـ seed الرئيسي (مع @/ aliases)
│   ├── seed-standalone.ts         # الـ seed بدون aliases (للـ production)
│   └── migrations/
│       └── 20260616000000_init/
│           └── migration.sql
├── src/
│   ├── app/
│   │   ├── (auth)/                # group: صفحات المصادقة
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (main)/                # group: الصفحات الرئيسية
│   │   │   └── [locale]/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx
│   │   │       ├── events/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── [slug]/page.tsx
│   │   │       │   └── error.tsx
│   │   │       └── error.tsx
│   │   ├── (dashboard)/           # group: لوحة التحكم
│   │   │   └── [locale]/dashboard/
│   │   ├── api/
│   │   │   ├── route.ts           # health check
│   │   │   ├── cron/
│   │   │   │   └── route.ts       # cron jobs
│   │   │   └── v1/
│   │   │       ├── auth/
│   │   │       │   └── register/route.ts
│   │   │       ├── users/
│   │   │       │   ├── route.ts
│   │   │       │   └── [id]/route.ts
│   │   │       ├── events/
│   │   │       │   └── route.ts
│   │   │       ├── debug-home/    # endpoint تشخيصي (احذفه قبل النشر!)
│   │   │       │   └── route.ts
│   │   │       └── csrf-token/
│   │   │           └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx             # root layout
│   │   ├── not-found.tsx
│   │   └── error.tsx              # global error
│   ├── components/
│   │   ├── ui/                    # shadcn/ui فقط
│   │   ├── shared/                # مكونات مشتركة (Header, Footer)
│   │   └── features/              # مكونات خاصة بالأعمال
│   ├── hooks/                     # custom hooks
│   │   ├── use-safe-auth.ts
│   │   └── use-events.ts
│   ├── lib/                       # utilities, db, auth, utils
│   │   ├── db.ts
│   │   ├── auth-server.ts
│   │   ├── api-response.ts
│   │   ├── api-client.ts
│   │   ├── csrf.ts
│   │   ├── utils.ts
│   │   └── validators/
│   │       ├── user-schema.ts
│   │       └── event-schema.ts
│   ├── i18n/                      # routing, config
│   │   ├── routing.ts
│   │   └── config.ts
│   ├── messages/                  # ar.json, en.json
│   │   ├── ar.json
│   │   └── en.json
│   ├── stores/                    # Zustand stores
│   │   └── use-cart-store.ts
│   ├── types/                     # TypeScript types
│   │   └── index.ts
│   └── middleware.ts
├── public/
│   ├── images/
│   └── locales/
├── scripts/
│   ├── deploy.sh                  # سكريبت النشر الآلي
│   └── check-health.sh
├── ARCHITECTURE.md                # قرارات معمارية
├── Dockerfile                     # متعدد المراحل
├── railway.json
├── .env.example
├── .env
├── .gitignore
├── bun.lockb
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 5.2 قواعد تنظيم المجلدات

1. **قاعدة المجلد الواحد:** إذا تجاوز المجلد 20 ملفاً، فكّر في تقسيمه.
2. **فصل المسؤوليات:**
   - `lib/` → منطق مشترك (db, auth, utils)
   - `components/ui/` → shadcn/ui فقط
   - `components/features/` → مكونات الأعمال
   - `components/shared/` → مكونات مشتركة بين الصفحات
   - `hooks/` → custom hooks
   - `stores/` → Zustand
   - `lib/validators/` → Zod schemas
3. **Route Groups:** استخدم `(auth)`, `(main)`, `(dashboard)` لفصل layouts دون التأثير على URL.
4. **API versioning:** كل الـ APIs تحت `/api/v1/...` لسهولة الترقية مستقبلاً.

---

## 6. خطوات بناء المشروع من الصفر — مرحلة بمرحلة

### 6.1 المرحلة 0: التخطيط والتحضير (1-2 ساعة)

**قبل كتابة أي سطر كود، يجب أن تكون لديك وثيقة متطلبات واضحة (PRD) تحتوي على:**

- **الجمهور المستهدف**: من سيستخدم المنصة؟ ما احتياجاته؟
- **الميزات الأساسية (MVP)**: ما الحد الأدنى من الميزات المطلوبة للإطلاق؟
- **الميزات الثانوية**: ما الذي يمكن تأجيله للنسخ اللاحقة؟
- **القيود التقنية**: ما اللغات، الأطر، والخدمات المطلوبة؟
- **القيود التجارية**: ما الميزانية؟ ما الجدول الزمني؟

**ثم:**

1. أنشئ repository مع `.gitignore` صحيح.
2. أعد branching strategy (`main`, `develop`, `feature/*`).
3. جهّز بيئة التطوير (Bun, Docker, VS Code).
4. أنشئ ملف `ARCHITECTURE.md` أولياً.

### 6.2 المرحلة 1: التأسيس الفني (1-2 يوم)

#### 6.2.1 تثبيت المتطلبات

```bash
# تثبيت Bun
curl -fsSL https://bun.sh/install | bash

# تأكد من إصدار Node.js
node --version  # v20+

# تثبيت Docker
docker --version
docker compose version
```

#### 6.2.2 تهيئة Next.js

```bash
bunx create-next-app@latest my-project \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-bun

cd my-project
```

> **ملاحظة:** اختر `--src-dir` ليفصل كود المصدر عن ملفات الإعداد.

#### 6.2.3 تثبيت الاعتمادات

```bash
# Prisma + Prisma Client (ثبت إصداراً محدداً لتجنب breaking changes)
bun add prisma@6.19.2 @prisma/client@6.19.2

# المصادقة (Clerk)
bun add @clerk/nextjs

# التدويل
bun add next-intl

# التحقق
bun add zod

# الأدوات المساعدة
bun add jsonwebtoken     # للمصادقة (JWT) - بديل عن Clerk
bun add bcryptjs         # لتشفير كلمات المرور
bun add isomorphic-dompurify  # لتطهير HTML

# UI
bun add lucide-react
bun add framer-motion
bun add next-themes
bun add @tanstack/react-query

# State
bun add zustand

# Rate limiting (اختياري للإنتاج)
bun add @upstash/ratelimit @upstash/redis

# أدوات التطوير
bun add -d @types/bcryptjs @types/jsonwebtoken prettier
```

> ⚠️ **تحذير:** لا تستخدم `bun add prisma@latest` لأن Prisma v7 لها breaking changes كبيرة. ثبت إصداراً محدداً (6.19.2).

#### 6.2.4 تهيئة shadcn/ui

```bash
bunx shadcn@latest init

# تثبيت المكونات الأساسية
bunx shadcn@latest add button card input dialog sheet tabs toast \
  dropdown-menu form label select separator skeleton sonner badge avatar
```

#### 6.2.5 تهيئة Prisma

```bash
bunx prisma init
```

ثم اكتب `schema.prisma` (راجع قسم 8.1).

#### 6.2.6 إعداد متغيرات البيئة

```bash
cp .env.example .env
# عدّل القيم حسب مشروعك
```

راجع قسم 7.5 لقالب `.env.example`.

### 6.3 المرحلة 2: تطبيق القواعد الأساسية (نصف يوم)

1. أنشئ `src/lib/db.ts` (Prisma singleton) — القاعدة 1.
2. أنشئ `src/lib/api-response.ts` — القاعدة 3.
3. أنشئ `src/lib/auth-server.ts` (getCurrentUser) — القاعدة 2 و 11.
4. أنشئ `src/hooks/use-safe-auth.ts` — القاعدة 2.
5. أنشئ `src/middleware.ts` (Clerk) — القاعدة 11.
6. أنشئ `src/i18n/routing.ts` و `src/i18n/config.ts` — القاعدة 14.
7. أنشئ `src/messages/ar.json` و `src/messages/en.json` فارغين.
8. حدّث `tsconfig.json` (strict mode) — قسم 7.1.
9. حدّث `next.config.ts` — قسم 7.2.
10. حدّث `tailwind.config.ts` (RTL support).

### 6.4 المرحلة 3: بناء الميزات الأساسية بترتيب الأولوية

> كل ميزة = سبنت (Sprint) صغير. بعد كل ميزة، اعبر بوابة الجودة (قسم 12).

#### الترتيب الموصى به:

1. **المصادقة (Auth)**: التسجيل، الدخول، الخروج، إدارة الجلسات.
2. **قاعدة البيانات الأساسية**: النماذج الرئيسية (User, Event, Booking).
3. **واجهات CRUD الأساسية**: إنشاء، قراءة، تحديث، حذف.
4. **نظام الأدوار (RBAC)**: User, Organizer, Admin.
5. **نظام الحجز/الطلب**: مع transactions.
6. **نظام الدفع (Payments)**: حذر شديد، اختبار كامل (إن وُجد).
7. **الترجمة (i18n)**: كل النصوص بالعربية والإنجليزية.
8. **التصميم المتقدم (UI/UX)**: التحسينات البصرية، dark mode.
9. **التحسينات (Performance)**: Caching, lazy loading.
10. **الاختبارات (Testing)**: Unit, integration, E2E.

#### مثال على بناء ميزة "إنشاء فعالية":

```
سبنت 1: نموذج Prisma للفعالية + migration
سبنت 2: API endpoint لإنشاء فعالية (POST /api/v1/events)
سبنت 3: صفحة إنشاء فعالية (UI)
سبنت 4: التحقق من الصلاحيات (RBAC)
سبنت 5: الترجمة (ar + en)
سبنت 6: الاختبار اليدوي
سبنت 7: اختبار الحالات الحدية (edge cases)
```

### 6.5 المرحلة 4: التدقيق الأمني (نصف يوم)

بعد إكمال كل ميزة رئيسية، أجرِ تدقيقاً أمنياً يغطي:

- ✅ أمان المصادقة (Auth Security)
- ✅ أمان المدفوعات (Payment Security)
- ✅ حماية APIs من CSRF و XSS
- ✅ التحقق من المدخلات (Input Validation)
- ✅ أمان قاعدة البيانات (SQL Injection)
- ✅ إدارة الأسرار (Secrets Management)
- ✅ تسجيل الأحداث (Logging)

راجع الملف الشقيق لقائمة الأخطاء الأمنية الـ40 وكيفية إصلاحها.

### 6.6 المرحلة 5: الإعداد للنشر (1-2 ساعة)

- أنشئ `Dockerfile` متعدد المراحل.
- أنشئ `railway.json`.
- حدّث `.env.example`.
- أضف endpoints تشخيصية (debug-home).
- اختبر الـ build محلياً بـ `docker build`.

**راجع الملف الشقيق للتعليمات الكاملة للنشر.**

### 6.7 المرحلة 6: النشر والتحقق (1-2 ساعة)

- إعداد Supabase.
- إعداد Railway.
- تطبيق migrations.
- تشغيل seed.
- التحقق من الصحة.

**راجع الملف الشقيق لخطوات النشر الكاملة.**

### 6.8 المرحلة 7: ما بعد الإطلاق

- مراقبة الأخطاء (Sentry).
- جمع ملاحظات المستخدمين.
- تحسينات الأداء المستمرة.
- تدقيق أمني دوري.

---

## 7. الإعدادات الأساسية (Config Templates)

### 7.1 tsconfig.json (Strict Mode)

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": false,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "incremental": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 7.2 next.config.ts

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // مهم: لتوليد .next/standalone الذي تستخدمه Docker
  output: 'standalone',

  experimental: {
    // تحسين الأداء
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.clerk.com' },
    ],
  },
}

export default nextConfig
```

**لماذا `output: 'standalone'`؟** يولّد مجلد `.next/standalone` يحتوي على كل ما يلزم لتشغيل التطبيق بدون `node_modules` كامل. الصورة النهائية أصغر (200-300 MB بدلاً من 1+ GB).

### 7.3 tailwind.config.ts (RTL-aware)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // استخدم logical properties دائماً
      // Tailwind 4 يدعم ms-, me-, ps-, pe-, start-, end- افتراضياً
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

### 7.4 package.json scripts

```json
{
  "name": "my-project",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "db:generate": "bun ./node_modules/prisma/build/index.js generate",
    "db:push": "bun ./node_modules/prisma/build/index.js db push",
    "db:migrate": "bun ./node_modules/prisma/build/index.js migrate dev",
    "db:deploy": "bun ./node_modules/prisma/build/index.js migrate deploy",
    "db:reset": "bun ./node_modules/prisma/build/index.js migrate reset",
    "db:studio": "bun ./node_modules/prisma/build/index.js studio",
    "db:seed": "bun prisma/seed-standalone.ts",
    "format": "prettier --write .",
    "deploy": "bash scripts/deploy.sh"
  },
  "prisma": {
    "seed": "bun prisma/seed.ts"
  }
}
```

> ⚠️ استخدم `bun ./node_modules/prisma/build/index.js` بدلاً من `bunx prisma` لتفادي مشكلة جلب Prisma v7 في Docker.

### 7.5 .env.example

```bash
# .env.example (يُرفع إلى Git)

# Database
DATABASE_URL="file:./dev.db"  # SQLite للتطوير
# للإنتاج:
# DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
# DIRECT_URL="postgresql://user:password@host:5432/postgres"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Next.js
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Upstash (Rate Limiting - اختياري)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""

# App
NODE_ENV="development"
```

### 7.6 .gitignore

```gitignore
# Dependencies
node_modules
.pnp
.pnp.js

# Next.js
.next
out
build
dist

# Production
*.tsbuildinfo
next-env.d.ts

# Environment
.env
.env.local
.env*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# OS
.DS_Store
*.pem

# IDE
.vscode
.idea

# Misc
coverage
*.log
```

> 🚨 **تحذير أمني حرج:** لا ترفع ملف `.env` أبداً إلى Git. إذا حدث، أمسِ التاريخ بـ `git filter-branch` أو `BFG Repo-Cleaner`، ثم بدّل كل كلمات المرور والـ secrets فوراً.

---

## 8. قوالب الكود القياسية (Code Templates)

### 8.1 Prisma Schema — نموذج مرجعي

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // أو "sqlite" للتطوير المحلي
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // مهم للـ migrations مع PostgreSQL
}

// Enums (PostgreSQL فقط — SQLite لا يدعمها)
enum EventStatus {
  DRAFT
  PUBLISHED
  CANCELLED
  COMPLETED
}

enum UserRole {
  USER
  ORGANIZER
  ADMIN
}

enum Locale {
  ar
  en
}

// النماذج
model User {
  id        String   @id @default(cuid())
  clerkId   String   @unique
  email     String   @unique
  name      String
  role      UserRole @default(USER)
  isActive  Boolean  @default(true)

  // Relations
  events    Event[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@map("users")
}

model Event {
  id          String      @id @default(cuid())
  slug        String      @unique
  status      EventStatus @default(DRAFT)
  startDate   DateTime
  endDate     DateTime
  organizerId String
  organizer   User        @relation(fields: [organizerId], references: [id])
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id])

  // ترجمات JSONB (بديل أفضل من جدول منفصل)
  title       Json        // { "ar": "...", "en": "..." }
  description Json

  // الحقول المالية — استخدم Decimal(10, 3) للعملة الكويتية
  minPrice    Decimal?    @db.Decimal(10, 3)

  ticketTiers TicketTier[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([status, startDate])
  @@index([categoryId])
  @@index([organizerId])
  @@map("events")
}

model TicketTier {
  id        String  @id @default(cuid())
  eventId   String
  event     Event   @relation(fields: [eventId], references: [id], onDelete: Cascade)
  name      Json    // { "ar": "...", "en": "..." }
  price     Decimal @db.Decimal(10, 3)
  quantity  Int
  sold      Int     @default(0)

  @@index([eventId])
  @@map("ticket_tiers")
}

model Category {
  id    String  @id @default(cuid())
  slug  String  @unique
  name  Json    // { "ar": "...", "en": "..." }
  events Event[]

  @@map("categories")
}
```

**دروس مهمة من الـ schema:**

- استخدم `Decimal(10, 3)` للعملة الكويتية (الدينار = 1000 فلس)، وليس `Decimal(10, 2)`.
- استخدم `Json` لحقل الترجمات متعددة اللغات بدلاً من جدول منفصل.
- أضف `@@index` على الحقول المستخدمة بكثرة في `WHERE` و `ORDER BY`.
- استخدم `onDelete: Cascade` بحذر — فقط عندما يكون منطقياً (مثل حذف تذاكر الفعالية عند حذف الفعالية).
- استخدم `@map("snake_case")` لأسماء الأعمدة، `@@map("plural_table")` لأسماء الجداول.
- استخدم `cuid()` للـ IDs (أفضل من UUID للـ URLs).
- **SQLite لا يدعم `enum` و `Decimal`** — خزّنها كـ `String`.

### 8.2 Prisma Client Singleton

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    // للإنتاج مع Supabase — إعدادات الـ connection pool
    // datasources: {
    //   db: {
    //     url: process.env.DATABASE_URL + '&connection_limit=1&pool_timeout=10',
    //   },
    // },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### 8.3 API Route — قالب قياسي

```typescript
// src/app/api/v1/events/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getCurrentUser } from '@/lib/auth-server'
import { eventCreateSchema } from '@/lib/validators/event-schema'
import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  locale: z.enum(['ar', 'en']).default('ar'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']).optional(),
})

export async function GET(req: NextRequest) {
  try {
    // 1. المصادقة
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return errorResponse('UNAUTHORIZED', 'يجب تسجيل الدخول', undefined, 401)
    }

    // 2. التحقق من المدخلات
    const { searchParams } = new URL(req.url)
    const { page, limit, locale, status } = querySchema.parse(
      Object.fromEntries(searchParams)
    )

    // 3. الاستعلام
    const where = {
      ...(status && { status }),
    }

    const [events, total] = await Promise.all([
      db.event.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startDate: 'asc' },
        include: {
          category: true,
          ticketTiers: { select: { id: true, price: true, quantity: true, sold: true } },
        },
      }),
      db.event.count({ where }),
    ])

    // 4. تحويل Decimal إلى String (القاعدة 4)
    const safeEvents = events.map((event) => ({
      ...event,
      minPrice: event.minPrice?.toString() ?? null,
      ticketTiers: event.ticketTiers.map((tier) => ({
        ...tier,
        price: tier.price.toString(),
      })),
    }))

    // 5. الإرجاع
    return successResponse(safeEvents, 'تم جلب الفعاليات', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        'VALIDATION_ERROR',
        'بارامترات غير صالحة',
        undefined,
        422
      )
    }
    const message = error instanceof Error ? error.message : 'خطأ غير متوقع'
    console.error('GET /api/v1/events:', message, error)
    return errorResponse('INTERNAL_ERROR', message, undefined, 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. المصادقة + الصلاحيات
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return errorResponse('UNAUTHORIZED', 'يجب تسجيل الدخول', undefined, 401)
    }
    if (currentUser.role !== 'ORGANIZER' && currentUser.role !== 'ADMIN') {
      return errorResponse('FORBIDDEN', 'غير مصرح', undefined, 403)
    }

    // 2. التحقق من المدخلات
    const body = await req.json()
    const validated = eventCreateSchema.parse(body)

    // 3. الإنشاء
    const event = await db.event.create({
      data: {
        ...validated,
        organizerId: currentUser.id,
        slug: validated.slug || generateSlug(validated.title),
      },
    })

    return successResponse(event, 'تم إنشاء الفعالية', undefined, 201)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        'VALIDATION_ERROR',
        'بيانات غير صالحة',
        error.errors[0]?.path[0]?.toString(),
        422
      )
    }
    const message = error instanceof Error ? error.message : 'خطأ غير متوقع'
    console.error('POST /api/v1/events:', message, error)
    return errorResponse('INTERNAL_ERROR', message, undefined, 500)
  }
}

function generateSlug(title: { ar: string; en: string }): string {
  return title.en
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

### 8.4 Zod Schema قياسية

```typescript
// src/lib/validators/event-schema.ts
import { z } from 'zod'

export const eventCreateSchema = z.object({
  title: z.object({
    ar: z.string().min(3, { message: 'العنوان بالعربية قصير جداً' }),
    en: z.string().min(3, { message: 'العنوان بالإنجليزية قصير جداً' }),
  }),
  description: z.object({
    ar: z.string().max(2000, { message: 'الوصف طويل جداً' }),
    en: z.string().max(2000, { message: 'الوصف طويل جداً' }),
  }),
  startDate: z.string().datetime({ message: 'تاريخ البداية غير صالح' }),
  endDate: z.string().datetime({ message: 'تاريخ النهاية غير صالح' }),
  categoryId: z.string().cuid({ message: 'معرّف الفئة غير صالح' }),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, { message: 'الـ slug يجب أن يكون أحرف صغيرة وأرقام وشرطات' })
    .optional(),
  ticketTiers: z
    .array(
      z.object({
        name: z.object({
          ar: z.string().min(2),
          en: z.string().min(2),
        }),
        price: z
          .string()
          .refine((val) => {
            const num = parseFloat(val)
            return !isNaN(num) && num >= 0 && num < 1000000
          }, { message: 'السعر غير صالح' }),
        quantity: z.number().int().min(1).max(100000),
      })
    )
    .min(1, { message: 'يجب إضافة فئة تذاكر واحدة على الأقل' }),
})

export type EventCreateInput = z.infer<typeof eventCreateSchema>
```

### 8.5 Auth Server Helpers

```typescript
// src/lib/auth-server.ts
import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export interface SafeUser {
  id: string
  clerkId: string
  email: string
  name: string
  role: 'USER' | 'ORGANIZER' | 'ADMIN'
  isActive: boolean
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const { userId } = await auth()
    if (!userId) return null

    const clerkUser = await currentUser()
    if (!clerkUser) return null

    // مزامنة مع قاعدة البيانات
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      // أنشئ المستخدم تلقائياً إذا لم يكن موجوداً (auto-provisioning)
      const newUser = await db.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
          name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim(),
          role: 'USER',
        },
      })
      return newUser
    }

    return dbUser
  } catch (error) {
    console.error('getCurrentUser error:', error)
    return null
  }
}

export async function requireUser(): Promise<SafeUser> {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireRole(...roles: SafeUser['role'][]): Promise<SafeUser> {
  const user = await requireUser()
  if (!roles.includes(user.role)) {
    redirect('/unauthorized')
  }
  return user
}
```

### 8.6 i18n Setup

```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'
import { createNavigation } from 'next-intl/navigation'

export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar', // العربية افتراضية
})

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing)
```

```typescript
// src/i18n/config.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Asia/Kuwait',
    now: new Date(),
  }
})
```

```json
// src/messages/ar.json
{
  "HomePage": {
    "welcome": "مرحباً بك",
    "bookNow": "احجز الآن",
    "browseEvents": "تصفح الفعاليات"
  },
  "Common": {
    "loading": "جارٍ التحميل...",
    "error": "حدث خطأ",
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل",
    "search": "بحث",
    "noResults": "لا توجد نتائج"
  },
  "Events": {
    "title": "الفعاليات",
    "price": "السعر",
    "date": "التاريخ",
    "venue": "المكان",
    "category": "الفئة",
    "buyTickets": "شراء التذاكر",
    "soldOut": "نفدت التذاكر"
  }
}
```

```json
// src/messages/en.json
{
  "HomePage": {
    "welcome": "Welcome",
    "bookNow": "Book Now",
    "browseEvents": "Browse Events"
  },
  "Common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "noResults": "No results found"
  },
  "Events": {
    "title": "Events",
    "price": "Price",
    "date": "Date",
    "venue": "Venue",
    "category": "Category",
    "buyTickets": "Buy Tickets",
    "soldOut": "Sold Out"
  }
}
```

### 8.7 Middleware (Clerk)

```typescript
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/organizer(.*)',
  '/api/v1/(?!csrf-token|debug-home)(.*)',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isOrganizerRoute = createRouteMatcher(['/organizer(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // 1. معالجة i18n أولاً
  const intlResponse = intlMiddleware(req)

  // 2. حماية المسارات
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
  if (isAdminRoute(req)) {
    await auth.protect({ role: 'org:admin' })
  }
  if (isOrganizerRoute(req)) {
    await auth.protect({ role: 'org:member' })
  }

  return intlResponse || NextResponse.next()
})

export const config = {
  matcher: [
    // استثني المسارات الثابتة و API من i18n
    '/((?!_next|_vercel|.*\\..*).*)',
    '/(api|trpc)(.*)',
  ],
}
```

### 8.8 API Client للواجهة

```typescript
// src/lib/api-client.ts
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: { code: string; message: string; field?: string | null }
  meta?: { page: number; limit: number; total: number; totalPages: number }
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        // تأكد من إرسال cookies (للمصادقة)
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message ?? 'Request failed')
      }

      return data
    } catch (error) {
      console.error(`API ${path} error:`, error)
      throw error
    }
  }

  get<T>(path: string) {
    return this.request<T>(path)
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  patch<T>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
```

### 8.9 Custom Hook قياسي

```typescript
// src/hooks/use-events.ts
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import type { EventCreateInput } from '@/lib/validators/event-schema'

interface Event {
  id: string
  slug: string
  title: { ar: string; en: string }
  description: { ar: string; en: string }
  startDate: string
  endDate: string
  minPrice: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
}

export function useEvents(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['events', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<Event[]>(
        `/events?page=${page}&limit=${limit}`
      )
      return response
    },
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: EventCreateInput) => {
      const response = await apiClient.post<Event>('/events', input)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('تم إنشاء الفعالية بنجاح')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'فشل إنشاء الفعالية')
    },
  })
}
```

### 8.10 صفحة Error مخصصة (للإنتاج)

```tsx
// src/app/(main)/[locale]/error.tsx
'use client'

import { useEffect, useState } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-red-600">حدث خطأ غير متوقع</h1>
        <p className="text-gray-600">
          يرجى المحاولة مرة أخرى. إذا استمرت المشكلة، تواصل مع الدعم.
        </p>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 underline"
        >
          {showDetails ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
        </button>

        {showDetails && (
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        )}

        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  )
}
```

### 8.11 Endpoint تشخيصي (مهم للنشر — احذفه قبل النشر النهائي أو حمِه)

```typescript
// src/app/api/v1/debug-home/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface DebugResponse {
  timestamp: string
  databaseUrl: string
  checks: {
    events: { ok: boolean; count?: number; error?: string }
    categories: { ok: boolean; count?: number; error?: string }
    users: { ok: boolean; count?: number; error?: string }
  }
}

export async function GET() {
  const response: DebugResponse = {
    timestamp: new Date().toISOString(),
    databaseUrl: process.env.DATABASE_URL ? 'set' : 'NOT SET',
    checks: {
      events: { ok: false },
      categories: { ok: false },
      users: { ok: false },
    },
  }

  // فحص كل جدول بشكل منفصل
  try {
    const count = await db.event.count()
    response.checks.events = { ok: true, count }
  } catch (e) {
    response.checks.events = { ok: false, error: (e as Error).message }
  }

  try {
    const count = await db.category.count()
    response.checks.categories = { ok: true, count }
  } catch (e) {
    response.checks.categories = { ok: false, error: (e as Error).message }
  }

  try {
    const count = await db.user.count()
    response.checks.users = { ok: true, count }
  } catch (e) {
    response.checks.users = { ok: false, error: (e as Error).message }
  }

  await db.$disconnect()
  return NextResponse.json(response)
}
```

### 8.12 Seed File (بدون @/ aliases — للـ production)

```typescript
// prisma/seed-standalone.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 1. أنشئ المستخدم الإداري
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      clerkId: 'admin-clerk-id',
      email: 'admin@example.com',
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin created:', admin.email)

  // 2. أنشئ الفئات
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'music' },
      update: {},
      create: {
        slug: 'music',
        name: { ar: 'موسيقى', en: 'Music' },
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        slug: 'sports',
        name: { ar: 'رياضة', en: 'Sports' },
      },
    }),
  ])
  console.log('✅ Categories created:', categories.length)

  // 3. أنشئ فعالية تجريبية
  const event = await prisma.event.create({
    data: {
      slug: 'sample-event',
      status: 'PUBLISHED',
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      organizerId: admin.id,
      categoryId: categories[0].id,
      title: { ar: 'فعالية تجريبية', en: 'Sample Event' },
      description: { ar: 'وصف الفعالية', en: 'Event description' },
      minPrice: '15.500',
      ticketTiers: {
        create: [
          {
            name: { ar: 'عادي', en: 'Regular' },
            price: '15.500',
            quantity: 100,
          },
          {
            name: { ar: 'VIP', en: 'VIP' },
            price: '50.000',
            quantity: 20,
          },
        ],
      },
    },
  })
  console.log('✅ Sample event created:', event.slug)

  console.log('🌱 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

> **مهم:** استخدم `seed-standalone.ts` (بدون `@/` aliases) في الـ production لأن Bun لا يفسّر tsconfig path aliases في السكريبتات المستقلة.

---

## 9. أنماط متقدمة (Advanced Patterns)

### 9.1 WebSocket / Real-Time (مع Caddy Gateway)

**إنشاء mini-service منفصل:**

```
mini-services/
└── chat-service/
    ├── package.json
    ├── index.ts
    └── tsconfig.json
```

**الخادم (port 3003):**

```typescript
// mini-services/chat-service/index.ts
import { Server } from 'socket.io'

const io = new Server(3003, {
  cors: { origin: '*' },
  path: '/',
})

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('message', (data) => {
    io.emit('message', data)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

console.log('🚀 Chat service running on port 3003')
```

**الواجهة:**

```typescript
// ❌ خطأ: لا تعمل في الإنتاج (البورت غير مكشوف)
import { io } from 'socket.io-client'
const socket = io('http://localhost:3003')

// ✅ صحيح: Caddy يحوّل الطلب إلى localhost:3003
const socket = io('/?XTransformPort=3003')
```

> **مهم:** لا تكتب البورت في URL أبداً. استخدم `?XTransformPort={Port}` دائماً.

### 9.2 Payment Integration — مبادئ آمنة

1. **لا تثق بالواجهة أبداً** — كل التحقق في الخادم.
2. **Idempotency** — استخدم `bookingId` فريد لمنع الدفع المزدوج.
3. **Webhook للتحقق** — لا تعتمد على redirect العودة من المستخدم.
4. **Transaction** — استخدم Prisma `$transaction` لضمان الاتساق.

```typescript
// src/app/api/v1/payments/create/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getCurrentUser } from '@/lib/auth-server'
import { Decimal } from '@prisma/client/runtime/library'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return errorResponse('UNAUTHORIZED', 'يجب تسجيل الدخول', undefined, 401)
    }

    const body = await req.json()
    const { bookingId } = body

    // 1. تحقّق من الحجز غير مدفوع (مع قفل لمنع السباق)
    const result = await db.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { ticketTier: true },
      })

      if (!booking) {
        throw new Error('BOOKING_NOT_FOUND')
      }

      if (booking.userId !== user.id) {
        throw new Error('NOT_OWNER')
      }

      if (booking.paymentStatus === 'SUCCESS') {
        throw new Error('ALREADY_PAID')
      }

      // 2. تحقّق من المبلغ من قاعدة البيانات (لا تثق بالعميل!)
      const expectedAmount = booking.ticketTier.price

      // 3. أنشئ جلسة دفع مع مزوّد الخدمة
      const payment = await knet.createPayment({
        amount: expectedAmount.toString(),
        bookingId,
      })

      // 4. خزّن معرف الدفع
      await tx.payment.create({
        data: {
          bookingId,
          providerRef: payment.id,
          amount: expectedAmount,
          status: 'PENDING',
        },
      })

      return { redirectUrl: payment.url }
    })

    return successResponse(result, 'جلسة دفع')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'خطأ غير متوقع'
    if (message === 'ALREADY_PAID') {
      return errorResponse('ALREADY_PAID', 'تم الدفع مسبقاً', undefined, 409)
    }
    if (message === 'BOOKING_NOT_FOUND') {
      return errorResponse('NOT_FOUND', 'الحجز غير موجود', undefined, 404)
    }
    console.error('Payment error:', error)
    return errorResponse('INTERNAL_ERROR', message, undefined, 500)
  }
}
```

### 9.3 Webhook Verification (نمط آمن)

```typescript
// src/app/api/v1/payments/webhook/route.ts
import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    // ⚠️ مهم: استخدم req.text() وليس req.json()!
    // req.json() قد يغيّر ترتيب الأحرف ويفشل التحقق من التوقيع
    const body = await req.text()
    const signature = req.headers.get('x-signature')

    if (!signature) {
      return Response.json(
        { success: false, error: 'Missing signature' },
        { status: 401 }
      )
    }

    // تحقّق من التوقيع
    const expectedSignature = crypto
      .createHmac('sha256', process.env.PAYMENT_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return Response.json(
        { success: false, error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // الآن آمن لـ parse
    const data = JSON.parse(body)

    // Idempotency: تحقّق أن لم نعالج هذا الـ webhook مسبقاً
    const existing = await db.payment.findUnique({
      where: { providerRef: data.payment_id },
    })

    if (existing?.status === 'SUCCESS') {
      // webhook مكرر — تجاهل بأمان
      return Response.json({ success: true })
    }

    // حدّث حالة الدفع + الحجز في transaction
    await db.$transaction([
      db.payment.update({
        where: { providerRef: data.payment_id },
        data: { status: 'SUCCESS', paidAt: new Date() },
      }),
      db.booking.update({
        where: { id: data.booking_id },
        data: { paymentStatus: 'SUCCESS' },
      }),
    ])

    return Response.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return Response.json(
      { success: false, error: 'Webhook failed' },
      { status: 500 }
    )
  }
}
```

### 9.4 CSRF Protection

```typescript
// src/lib/csrf.ts
import { headers } from 'next/headers'

export async function validateCSRF() {
  const headersList = await headers()
  const origin = headersList.get('origin')
  const host = headersList.get('host')

  if (origin !== host) {
    throw new Error('CSRF token validation failed')
  }
}

// في كل API endpoint لـ POST/PUT/DELETE:
export async function POST(req: NextRequest) {
  await validateCSRF()
  // باقي الكود
}
```

### 9.5 Rate Limiting

```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 طلبات في الدقيقة
})

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier)
  return success
}

// الاستخدام في API:
export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return errorResponse('UNAUTHORIZED', '...', undefined, 401)

  const allowed = await checkRateLimit(user.id)
  if (!allowed) {
    return errorResponse(
      'RATE_LIMIT_EXCEEDED',
      'تجاوزت الحد المسموح من الطلبات',
      undefined,
      429
    )
  }
  // باقي الكود
}
```

### 9.6 AbortController للـ API Timeout

```typescript
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 5000
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}
```

### 9.7 Dynamic Import للـ Heavy Components

```tsx
import dynamic from 'next/dynamic'

// ❌ خطأ: يحمل Three.js دائماً (حتى لو لم يُستخدم)
import ThreeCanvas from '@/components/three-canvas'

// ✅ صحيح: lazy load
const ThreeCanvas = dynamic(() => import('@/components/three-canvas'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px]" />,
})
```

### 9.8 Footer Sticky (نمط شائع)

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

### 9.9 generateStaticParams للصفحات الديناميكية

```typescript
// src/app/(main)/[locale]/events/[slug]/page.tsx
import { db } from '@/lib/db'

export async function generateStaticParams() {
  const events = await db.event.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true },
  })

  return events.map((event) => ({ slug: event.slug }))
}

export const dynamicParams = true // اسمح بصفحات جديدة (SSR fallback)
```

### 9.10 حل تعارض `[id]` مع `[slug]`

```typescript
// src/app/(main)/[locale]/events/[slug]/page.tsx
export default async function EventPage({
  params,
}: {
  params: { slug: string }
}) {
  // ابحث بـ slug أو id
  const event = await db.event.findFirst({
    where: {
      OR: [{ slug: params.slug }, { id: params.slug }],
    },
  })

  if (!event) notFound()

  // ...
}
```

---

## 10. معايير التسمية وكتابة الكود

### 10.1 جدول التسمية الشامل

| النوع | القاعدة | مثال |
|-------|---------|------|
| الملفات | kebab-case | `event-card.tsx` |
| المكونات | PascalCase | `EventCard` |
| الـ hooks | camelCase + `use` | `useSafeAuth` |
| الـ functions | camelCase | `getCurrentUser` |
| الـ constants | UPPER_SNAKE | `MAX_RETRY` |
| الـ types | PascalCase | `EventStatus` |
| الـ interfaces | PascalCase | `BookingData` |
| الـ enums | PascalCase + members UPPER | `UserRole.ADMIN` |
| متغيرات state | camelCase | `isLoading` |
| CSS classes | kebab-case | `event-card` |
| جداول DB | snake_case plural | `event_bookings` |
| أعمدة DB | snake_case | `created_at` |
| API endpoints | kebab-case + versioned | `/api/v1/event-bookings` |
| Git branches | `feature/kebab-case` | `feature/event-booking` |

### 10.2 Git Commit Conventions

**الصيغة:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**الأنواع:**

- `feat` — ميزة جديدة
- `fix` — إصلاح خطأ
- `refactor` — إعادة هيكلة
- `chore` — صيانة
- `docs` — توثيق
- `style` — تنسيق فقط
- `test` — اختبارات
- `perf` — تحسين أداء

**مثال:**

```
feat(events): add event detail page with booking

- Add /events/[slug] route with generateStaticParams
- Implement booking form with Zod validation
- Add QR code generation for confirmed bookings
- Include full Arabic/English translations
```

### 10.3 ترتيب imports

```typescript
// 1. React و Next.js
import { NextRequest } from 'next/server'
import { useState, useEffect } from 'react'

// 2. مكتبات خارجية
import { z } from 'zod'
import { useTranslations } from 'next-intl'

// 3. ملفات داخلية (@/ alias)
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { getCurrentUser } from '@/lib/auth-server'

// 4. Types
import type { Event } from '@/types'

// 5. CSS Modules (إن وجدت)
import styles from './page.module.css'
```

### 10.4 هرم معالجة الأخطاء

1. **منع الخطأ** (validation، types).
2. **كشف الخطأ** (try/catch، error boundaries).
3. **التعامل مع الخطأ** (fallback UI، retry).
4. **تبليغ المستخدم** (toast، inline message).
5. **تسجيل الخطأ** (console.error، Sentry).

### 10.5 قواعد إضافية للكود

- **لا `console.log` في الإنتاج** — استخدم logger مخصص.
- **لا `any` نهائياً** — استخدم `unknown` + type narrowing.
- **لا Non-null assertion `!`** بدون تحقق:
  ```typescript
  // ❌ خطأ
  const user = users.find((u) => u.id === id)!
  user.name // crash إذا undefined

  // ✅ صحيح
  const user = users.find((u) => u.id === id)
  if (!user) throw new Error('User not found')
  user.name // آمن
  ```
- **استخدم `select` في Prisma** لتقليل البيانات وتجنّب تسريب الحقول الحساسة:
  ```typescript
  // ❌ خطأ: يرجع passwordHash!
  const user = await db.user.findUnique({ where: { id } })

  // ✅ صحيح
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, role: true },
  })
  ```
- **استخدم `Promise.all` للـ queries المستقلة:**
  ```typescript
  const [events, total] = await Promise.all([
    db.event.findMany({ ... }),
    db.event.count(),
  ])
  ```

---

## 11. خطة العمل المرحلية (Micro-Sprints Plan)

> عند البدء بمشروعك، اتبع هذه الخطة بالترتيب. كل مرحلة لها معايير خروج واضحة لا يمكن تجاوزها.

### المرحلة 0: ما قبل البدء (Pre-flight Check) — 1-2 ساعة

- [ ] تعريف المتطلبات في PRD.
- [ ] اختيار Tech Stack.
- [ ] إنشاء repository مع `.gitignore` صحيح.
- [ ] إعداد branching strategy (`main`, `develop`, `feature/*`).
- [ ] تجهيز بيئة التطوير (Bun, Docker, VS Code).
- [ ] إنشاء `ARCHITECTURE.md` أولياً.

### المرحلة 1: الإعداد الفني (Foundation) — 1-2 يوم

#### Sprint 1.1: Next.js + TypeScript

- [ ] `bunx create-next-app@latest`.
- [ ] تفعيل strict TypeScript.
- [ ] إعداد ESLint + Prettier.
- [ ] إعداد `@/` alias في `tsconfig.json`.

#### Sprint 1.2: Prisma + Database

- [ ] `bunx prisma init`.
- [ ] إنشاء النماذج الأساسية (`User`, `Role`).
- [ ] أول migration.
- [ ] إنشاء `lib/db.ts` (singleton — القاعدة 1).

#### Sprint 1.3: Clerk Authentication

- [ ] تثبيت `@clerk/nextjs`.
- [ ] إعداد `middleware.ts`.
- [ ] صفحات sign-in, sign-up.
- [ ] اختبار التدفق الكامل.

#### Sprint 1.4: next-intl

- [ ] تثبيت next-intl.
- [ ] إنشاء `i18n/routing.ts`.
- [ ] ملفات الترجمة `messages/ar.json`, `messages/en.json`.
- [ ] اختبار التبديل بين اللغتين.

#### Sprint 1.5: shadcn/ui

- [ ] `bunx shadcn@latest init`.
- [ ] تثبيت المكونات الأساسية (button, card, input, dialog).
- [ ] إعداد `tailwind.config.ts` لـ RTL.

### المرحلة 2: الميزات الأساسية (Core Features) — 2-3 أسابيع

#### Sprint 2.1: نموذج البيانات الأساسي

- [ ] نماذج `Event`, `Booking`, `Payment`.
- [ ] Relations الصحيحة.
- [ ] Migrations.
- [ ] Seed أولي.

#### Sprint 2.2: CRUD للفعاليات

- [ ] API: `GET`, `POST`, `PATCH`, `DELETE`.
- [ ] صفحات: `list`, `detail`, `create`, `edit`.
- [ ] التحقق من الصلاحيات (RBAC).
- [ ] الترجمة الكاملة.

#### Sprint 2.3: نظام الحجز

- [ ] API: `POST /api/v1/bookings`.
- [ ] التحقق من توفر المقاعد.
- [ ] Transaction للعمليات الذرية.
- [ ] UI: تأكيد الحجز.

### المرحلة 3: الدفع والأمان (Payments & Security) — 1-2 أسبوع

#### Sprint 3.1: تكامل بوابة الدفع

- [ ] إنشاء خادم server-side للـ API keys.
- [ ] API: `POST /api/v1/payments/create`.
- [ ] Webhook endpoint مع التحقق من التوقيع.
- [ ] اختبار في وضع sandbox.

#### Sprint 3.2: الأمان الشامل

- [ ] CSRF protection.
- [ ] Rate limiting.
- [ ] Input validation (Zod) لكل API.
- [ ] Output sanitization (لا تسريب بيانات).
- [ ] Logs للأحداث الأمنية.

### المرحلة 4: UI/UX والتحسينات — 1-2 أسبوع

#### Sprint 4.1: التصميم النهائي

- [ ] Dark mode.
- [ ] Responsive design (mobile-first).
- [ ] Loading states (skeletons).
- [ ] Error boundaries.
- [ ] Toast notifications.

#### Sprint 4.2: SEO والأداء

- [ ] Meta tags ديناميكية (`generateMetadata`).
- [ ] Sitemap (`sitemap.ts`).
- [ ] `robots.txt` (`robots.ts`).
- [ ] تحسين الصور (`next/image`).
- [ ] Caching strategy.

### المرحلة 5: الاختبار والإطلاق — 1 أسبوع

#### Sprint 5.1: الاختبارات

- [ ] Unit tests (Vitest) للدوال الحرجة.
- [ ] Integration tests للـ APIs.
- [ ] E2E tests (Playwright) للتدفقات الرئيسية.
- [ ] اختبار يدوي شامل.

#### Sprint 5.2: النشر

- [ ] إعداد Dockerfile متعدد المراحل.
- [ ] إعداد Railway (أو Vercel).
- [ ] إعداد Supabase.
- [ ] متغيرات البيئة في الإنتاج.
- [ ] Domain و SSL.
- [ ] Monitoring (Sentry).

> 📖 **راجع الملف الشقيق (`GLM-5.2-Assistant-Operations-Reference.md`) للخطوات الكاملة للنشر.**

### المرحلة 6: ما بعد الإطلاق

- [ ] مراقبة الأخطاء.
- [ ] جمع ملاحظات المستخدمين.
- [ ] تحسينات الأداء المستمرة.
- [ ] تدقيق أمني دوري.

---

## 12. بوابة الجودة (Stop Gate QA)

> ⚠️ في نهاية كل سبنت، يجب التوقف عند بوابة الجودة. **لا يمكن تجاوز البوابة إلا بعد التحقق من جميع المعايير.**

### 12.1 قائمة بوابة الجودة لكل سبنت

#### ✅ الكود

- [ ] لا توجد أخطاء TypeScript (`bunx tsc --noEmit` نظيف).
- [ ] لا توجد تحذيرات ESLint (`bun run lint` نظيف).
- [ ] لا يوجد `any` في الكود الجديد.
- [ ] لا يوجد `console.log` (استخدم logger مخصص).
- [ ] استيرادات `@/` فقط (لا استيرادات نسبية).
- [ ] أسماء ملفات kebab-case.
- [ ] catch blocks تستخدم `unknown` وليس `any`.

#### ✅ القواعد الـ15

- [ ] تم تطبيق القاعدة 1 (Prisma singleton).
- [ ] تم تطبيق القاعدة 3 (API response format).
- [ ] تم تطبيق القاعدة 4 (Decimal → `.toString()`).
- [ ] تم تطبيق القاعدة 8 (i18n لكل النصوص الجديدة).
- [ ] تم تطبيق القاعدة 9 (Zod مع `message` لكل حقل).
- [ ] تم تطبيق القاعدة 11 (Role protection على الخادم).
- [ ] تم تطبيق القاعدة 14 (`Link` من `@/i18n/routing`).

#### ✅ قاعدة البيانات

- [ ] `select` مستخدم (لا `findMany()` بدون select للحساس).
- [ ] `@@index` للأعمدة المستخدمة في `where`/`orderBy`.
- [ ] Decimal → `.toString()`.
- [ ] لا N+1 queries (استخدم `include` أو `select`).

#### ✅ الواجهة

- [ ] Loading states (Skeleton/Spinner) لكل البيانات.
- [ ] Error handling لكل الطلبات.
- [ ] responsive على mobile/tablet/desktop.
- [ ] RTL/LTR صحيح.
- [ ] كل النصوص الجديدة في `messages/*.json`.
- [ ] `Link` من `@/i18n/routing`.

#### ✅ الأمان

- [ ] كل APIs المحمية تستخدم `getCurrentUser()`.
- [ ] فحص الأدوار على مستوى الخادم.
- [ ] لا توجد بيانات حساسة في API responses (`select` صحيح).
- [ ] CSRF tokens للنماذج الحساسة.
- [ ] Input validation (Zod) لكل API.

#### ✅ الاختبار

- [ ] `bun run dev` يعمل بدون أخطاء.
- [ ] `dev.log` نظيف.
- [ ] التحقق في المتصفح:
  - [ ] الصفحة تُعرض (لا شاشة بيضاء).
  - [ ] لا أخطاء في Console.
  - [ ] الـ footer ملتصق بالأسفل.
  - [ ] responsive على الموبايل والديسكتوب.
  - [ ] RTL/LTR يعمل.
- [ ] اختبر المسارات الرئيسية (تسجيل → شراء → نجاح).

### 12.2 قائمة بوابة الجودة قبل النشر

#### 🔐 الأمان (Security)

- [ ] لا توجد ثغرات CSRF في APIs.
- [ ] كل APIs محمية بمصادقة مناسبة.
- [ ] كل APIs محمية بالأدوار المناسبة.
- [ ] التحقق من توقيع webhook.
- [ ] Rate limiting على APIs الحساسة.
- [ ] لا توجد بيانات حساسة في الـ responses.
- [ ] تشفير البيانات الحساسة في قاعدة البيانات.
- [ ] لا توجد أسرار في Git.
- [ ] كلمات المرور قوية (Zod validation).
- [ ] 2FA متاح للمستخدمين الحساسين (إن لزم).

#### 💻 الكود (Code Quality)

- [ ] لا يوجد `any` في الكود.
- [ ] كل المدخلات مُتحق منها بـ Zod.
- [ ] لا يوجد `console.log` في الإنتاج.
- [ ] ESLint نظيف.
- [ ] TypeScript strict mode نظيف.
- [ ] لا توجد تكرار للكود (DRY).
- [ ] تعليقات على الدوال المعقدة.
- [ ] أسماء متغيرات واضحة.

#### 🌐 i18n & RTL

- [ ] كل النصوص في ملفات الترجمة.
- [ ] RTL و LTR يعملان بشكل صحيح.
- [ ] CSS Logical Properties مستخدمة.
- [ ] التواريخ والأرقام منسقة حسب الـ locale.

#### 🎨 UI/UX

- [ ] Responsive design (mobile-first).
- [ ] Dark mode (اختياري لكن موصى به).
- [ ] Loading states (skeletons).
- [ ] Error states واضحة.
- [ ] Toast notifications.
- [ ] Focus states للوصول.
- [ ] Aria labels للأيقونات.
- [ ] Skip-to-content link.

#### ⚡ الأداء (Performance)

- [ ] Lighthouse score > 90.
- [ ] الصور محسنة (`next/image`).
- [ ] Caching مضبوط.
- [ ] لا توجد N+1 queries.
- [ ] Bundle size معقول.
- [ ] Lazy loading للـ heavy components.

#### 🔍 SEO

- [ ] Meta tags ديناميكية (`generateMetadata`).
- [ ] Open Graph tags.
- [ ] Sitemap (`sitemap.ts`).
- [ ] `robots.txt` (`robots.ts`).
- [ ] Structured data (JSON-LD).

#### 📦 النشر (Deployment)

- [ ] Dockerfile multi-stage صحيح.
- [ ] `railway.json` أو إعداد النشر.
- [ ] متغيرات البيئة في الإنتاج.
- [ ] قاعدة بيانات الإنتاج جاهزة.
- [ ] Domain و SSL.
- [ ] CDN مهيأ.
- [ ] Backup strategy.
- [ ] Rollback plan.

> 📖 **راجع الملف الشقيق (`GLM-5.2-Assistant-Operations-Reference.md`) للحصول على:**
>
> - كتالوج الأخطاء الـ40 وكيفية إصلاحها.
> - دليل النشر الكامل (Railway + Supabase + Docker).
> - أخطاء الإنتاج الـ12 وحلولها.
> - أدوات التشخيص والتحليل.
> - أوامر جاهزة (Cheat Sheet).
> - قوائم مراجعة ما قبل/ما بعد النشر.

---

## 13. أخطاء بيئة الـ Sandbox الحرجة (غير مذكورة في القواعد الـ15)

> ⚠️ **هذا القسم ثمين جداً** — يوثّق أخطاءً واجهناها فعلياً أثناء بناء منصة "لَمَّة" (Lamma) الكويتية، ولم تُذكر في أي مكان آخر من هذا المرجع. هذه الأخطاء **خاصة ببيئة السحابة المعزولة (sandbox)** ولا تظهر في بيئة التطوير المحلية العادية. إذا كنت تبني مشروعاً في sandbox مشابه، اقرأ هذا القسم أولاً.

### 13.1 خطأ #1: binary الـ SWC الفاسد (SIGBUS / Bus Error)

**الأعراض:**
- `bun run dev` يبدأ بنجاح (`✓ Ready in 1.5s`) لكنه **ينهار فور استلام أول request** أثناء الـ compile.
- في الـ log: `Bus error` أو `SIGBUS` أو ببساطة انقطاع صامت للعملية.
- `next build` يفشل بنفس الطريقة.
- لا توجد رسالة خطأ واضحة — العملية تُقتل ببساطة.

**السبب الجذري:**
الـ binary الـ native لـ `@next/swc-linux-x64-gnu` (ملف `next-swc.linux-x64-gnu.node` بحجم ~115MB) **فاسد** في بعض بيئات الـ sandbox. Next.js 16 يستخدم Turbopack افتراضياً والذي يعتمد على هذا الـ binary. عند الفساد، يُقتل الـ process بـ SIGBUS.

**التشخيص المؤكد:**
```bash
# 1. تحقق من وجود الـ binary
ls -la node_modules/@next/swc-linux-x64-gnu/*.node
# لو حجمه 0 أو أقل من 100MB → فاسد

# 2. جرّب التشغيل في foreground لرؤية الخطأ
timeout 20 bunx next dev -p 3000
# لو انقطع بعد "Ready" بدون سبب → SWC binary فاسد
```

**الحل المضمون:**
```json
// package.json — استخدم --webpack لتجاوز Turbopack
{
  "scripts": {
    "dev": "next dev --webpack -p 3000 2>&1 | tee dev.log"
  }
}
```

> 🔑 **ملاحظة حرجة:** `--webpack` يجبر Next.js على استخدام Webpack + WASM SWC fallback بدلاً من الـ native binary. هذا **أبطأ بـ 2-3 مرات** في الـ compile، لكنه **الوحيد الذي يعمل** في الـ sandbox الفاسد. في الإنتاج (Docker مع `bun install` نظيف) عُد لـ Turbopack (احذف `--webpack`).

**طريقة التحقق من نجاح الحل:**
```bash
# بعد إضافة --webpack، شغّل في foreground أولاً
bunx next dev --webpack -p 3000
# يجب أن ترى:
# ✓ Ready in 1.5s
# GET / 200 in 8.5s  ← الـ compile ينجح أخيراً
```

---

### 13.2 خطأ #2: مجلد `andle]` بدلاً من `[handle]` (Glob Expansion)

**الأعراض:**
- صفحة `/hosts/some-handle` تُرجع **404** رغم وجود الملف.
- `generateStaticParams` لا يُولّد المسارات الديناميكية.
- في الـ filesystem يظهر مجلد باسم غريب مثل `andle]` بدلاً من `[handle]`.

**السبب الجذري:**
عند إنشاء مجلد باسم يحتوي على `[` أو `]` (مطلوب لـ Next.js dynamic routes مثل `[slug]`, `[handle]`, `[locale]`)، تُفسَّر الأقواس كـ **glob pattern** في bash:

```bash
# ❌ هذا يفشل — [handle] يُوسَّع كـ glob
mkdir -p "src/app/[locale]/hosts/[handle]"
# النتيجة الفعلية: src/app/[locale]/hosts/andle]  (خطأ!)

# ❌ حتى مع quotes في بعض الأحيان
mkdir 'src/app/hosts/[handle]'  # قد يفشل أيضاً
```

> ⚠️ **الفخ الأكبر:** الطرفية (terminal) **تعرض** `andle]` حتى لو كان المجلد فعلياً `[handle]`! لأن `[h` يُؤكل كـ escape sequence في العرض. هذا يضلّل المطور ليعتقد أن المجلد خطأ بينما هو صحيح.

**التشخيص المؤكد (لا تعتمد على العرض):**
```bash
# استخدم od -c لرؤية البايتات الفعلية
ls "src/app/[locale]/hosts/" | od -c | head -3
# أو استخدم find مع print0
find "src/app/[locale]/hosts" -maxdepth 1 -type d -print0 | od -c

# الأفضل: استخدم bun لقراءة الـ directory
bun -e "const fs=require('fs');const e=fs.readdirSync('src/app/[locale]/hosts');e.forEach(x=>{console.log(JSON.stringify(x),'len='+x.length,'chars='+Array.from(x).map(c=>c.charCodeAt(0)).join(','));});"
# لو رأيت: chars=[91,104,97,110,100,108,101,93] = [handle] ✅ (صحيح)
# لو رأيت: chars=[97,110,100,108,101,93] = andle] ❌ (خطأ)
```

**الحل المضمون — استخدم `Write` tool دائماً:**
أداة `Write` تنشئ المجلدات الأصلية بشكل صحيح، لكنها **ترفض المسارات بـ `[`** أحياناً. الحل البديل الموثوق:

```javascript
// scripts/create-dynamic-route.cjs
const fs = require('fs');
const path = require('path');

// ✅ path.join يتعامل مع الأقواس بشكل صحيح
const dir = path.join('src', 'app', '[locale]', 'hosts', '[handle]');
fs.mkdirSync(dir, { recursive: true });

// تحقق من الاسم الفعلي
const created = fs.readdirSync(path.join('src', 'app', '[locale]', 'hosts'));
created.forEach(e => {
  console.log('Created:', JSON.stringify(e), 'len=' + e.length);
});
```

ثم شغّله: `bun scripts/create-dynamic-route.cjs`

**القاعدة الذهبية:**
> 🔒 **عند إنشاء أي dynamic route folder (`[slug]`, `[handle]`, `[locale]`, `[id]`):** لا تستخدم أبداً `mkdir` في bash. استخدم دائماً `path.join()` في سكربت Node/Bun، أو أداة `Write` (مع ملاحظة أنها قد ترفض `[`).

---

### 13.3 خطأ #3: `ignoreBuildErrors: true` يخفي كل الأخطاء

**الأعراض:**
- `bun run lint` يُرجع 0 أخطاء (مُخادِع!).
- `bun run build` ينجح.
- لكن `tsc --noEmit` يكشف **13+ خطأ TypeScript حقيقي**.
- الموقع "يعمل" في الـ dev لكنه **سينهار في الإنتاج** عند أول user flow.

**السبب الجذري:**
```typescript
// next.config.ts — الإعداد الكارثي
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // ❌ يخفي كل أخطاء TS!
  },
  reactStrictMode: false,     // ❌ يخفي أخطاء effects
};
```

بالإضافة لـ ESLint معطّل بالكامل:
```javascript
// eslint.config.mjs — كل القواعد "off"
"@typescript-eslint/no-explicit-any": "off",
"@typescript-eslint/no-unused-vars": "off",
"no-unreachable": "off",
"no-debugger": "off",
// ... كل شيء off
```

**النتيجة:** `bun run lint` يُرجع 0 أخطاء لأنه **لا يفحص شيئاً**! والمطور يعتقد أن الكود نظيف.

**الحل المضمون:**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,  // ✅ أبداً لا تتجاهل
  },
  reactStrictMode: true,       // ✅ فعّل دائماً
};
```

```javascript
// eslint.config.mjs — أعد تفعيل القواعد كـ warnings (لا errors)
rules: {
  "@typescript-eslint/no-explicit-any": "warn",
  "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  "@typescript-eslint/no-non-null-assertion": "warn",
  "react-hooks/exhaustive-deps": "warn",
  "react-hooks/purity": "off",  // Date.now() في server components مقبول
  "@next/next/no-img-element": "warn",
  "prefer-const": "warn",
  "no-console": ["warn", { allow: ["warn", "error"] }],
  "no-debugger": "error",
  "no-unreachable": "error",
  "no-irregular-whitespace": "error",
},
```

**إضافة `typecheck` script ضروري:**
```json
{
  "scripts": {
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

**بوابة الجودة المح aggiornate:**
```bash
# قبل كل commit، شغّل الثلاثة:
bun run typecheck  # يجب: 0 errors
bun run lint       # يجب: 0 errors (warnings مسموحة)
# ثم جرّب build
```

> 🔑 **القاعدة:** `eslint` و`tsc` يفحصان أشياء **مختلفة**. ESLint يفحص الأنماط (patterns)، و`tsc` يفحص الأنواع (types). لا يكفي أحدهما.

---

### 13.4 خطأ #4: `react-hooks/purity` يرفض `Date.now()` في Server Components

**الأعراض:**
بعد تفعيل ESLint rules (الخطأ #3)، يظهر هذا الخطأ:
```
Error: Cannot call impure function during render

  44 |   const hostGatherings = gatherings.filter((g) => g.hostHandle === host.handle);
> 45 |   const now = Date.now();
     |               ^^^^^^^^^^ Cannot call impure function
```

**السبب:**
قاعدة `react-hooks/purity` (من React Compiler) تعتبر `Date.now()` "impure" لأنها تُرجع قيمة مختلفة كل استدعاء. لكن في **Server Components** هذا مقبول تماماً (لا re-render).

**الحل:**
```javascript
// eslint.config.mjs
rules: {
  "react-hooks/purity": "off",  // ✅ مقبول في server components
}
```

> 🔑 **ملاحظة:** لو كنت في Client Component، استخدم `useEffect` + `useState` لـ `Date.now()` بدلاً من استدعائها مباشرة في الـ render.

---

### 13.5 خطأ #5: next-intl v4 `redirect()` يتطلب `{href, locale}`

**الأعراض:**
```typescript
// ❌ كان يعمل في next-intl v3
import { redirect } from '@/i18n/routing';
redirect('/dashboard/host/gatherings');
// Error: Argument of type 'string' is not assignable to parameter of type
// '{ href: string; locale: string; forcePrefix?: boolean }'
```

**السبب:**
next-intl v4 غيّر توقيع `redirect()` ليتطلب كائناً بدلاً من string.

**الحل:**
```typescript
// ✅ next-intl v4
export default async function HostIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: '/dashboard/host/gatherings', locale });
}
```

> 🔑 **قاعدة عامة:** عند ترقية next-intl من v3 إلى v4، راجع كل استدعاءات `redirect()`, `useRouter().push()`, `usePathname()`. التوقيعات تغيّرت.

---

### 13.6 خطأ #6: اختفاء الـ Optional Fields بعد زوال النوع

**الأعراض:**
مكونات مثل `LocationCard` و `CapacityCard` تقرأ حقولاً مثل `gathering.isLocationRevealed`, `gathering.pendingCount`, `gathering.approvedAttendees` — لكن **النوع `Gathering` لا يحتوي هذه الحقول** رغم أنها موجودة في `HostGathering`.

**السبب:**
عند بناء نظامين متوازيين (static data + host-created data)، نُعرّف نوعين منفصلين:
- `Gathering` (في `data/types.ts`) — للبيانات الثابتة العامة.
- `HostGathering` (في `lib/host-gatherings-store.ts`) — لللمات التي ينشئها الأصحاب.

لكن المكونات UI تستخدم `Gathering` كـ prop type، فلا تستطيع الوصول لحقول `HostGathering`.

**الحل — توسيع `Gathering` بحقول optional:**
```typescript
// src/data/types.ts
export const attendeeRefSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  avatarUrl: z.string().min(1),
});
export type AttendeeRef = z.infer<typeof attendeeRefSchema>;

export const gatheringSchema = z.object({
  // ... الحقول الموجودة ...
  approvedAttendeesCount: z.number().int().nonnegative(),

  // ✅ حقول مشتركة optional — تُملأ من HostGathering عند الحاجة
  isLocationRevealed: z.boolean().optional(),
  pendingCount: z.number().int().nonnegative().optional(),
  waitlistedCount: z.number().int().nonnegative().optional(),
  approvedAttendees: z.array(attendeeRefSchema).optional(),
  whoShouldAttend: z.array(localizedStringSchema).optional(),
  whatToExpect: z.array(localizedStringSchema).optional(),
});
```

**في المكونات — استخدم `??` للـ defaults:**
```typescript
// ✅ LocationCard
{gathering.isLocationRevealed !== false ? (
  <MapSVG />  // undefined = revealed (السلوك الافتراضي)
) : (
  <HiddenMessage />
)}

// ✅ CapacityCard
const pending = gathering.pendingCount ?? 0;
const approvedAttendees = gathering.approvedAttendees ?? [];
```

> 🔑 **القاعدة:** `!== false` تعني "كل شيء عدا false صريح" (undefined يُعتبر true). هذا أنسب من `?` (truthy) لأن `undefined` يُعامَل كـ "مكشوف" بدلاً من "مخفي".

---

### 13.7 خطأ #7: Zustand `create()` يتجاهل `.default()` في Zod

**الأعراض:**
عند إنشاء لمّة جديدة عبر `useHostGatheringsStore().create(data)`, الحقول ذات `.default()` في الـ schema تُحفظ كـ `undefined` بدلاً من قيمتها الافتراضية.

**السبب:**
```typescript
// ❌ الطريقة الخاطئة
create: (data) => {
  const newG: HostGathering = {
    ...data,  // data لا يحتوي الحقول الافتراضية!
    id: `host-g-${Date.now()}`,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
  };
  // newG.pendingCount = undefined (رغم .default(0) في schema!)
  set((s) => ({ gatherings: [...s.gatherings, newG] }));
  return newG;
}
```

**الحل — استخدم `z.input` + `schema.parse()`:**
```typescript
// ✅ الطريقة الصحيحة
export type HostGatheringInput = Omit<
  z.input<typeof hostGatheringSchema>,
  'id' | 'createdAt' | 'status'
>;

interface State {
  create: (data: HostGatheringInput) => HostGathering;
}

create: (data) => {
  // parse() يطبّق كل .default() تلقائياً
  const newG = hostGatheringSchema.parse({
    ...data,
    id: `host-g-${Date.now()}`,
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
  });
  set((s) => ({ gatherings: [...s.gatherings, newG] }));
  return newG;
}
```

> 🔑 **الفرق بين `z.infer` و `z.input`:**
> - `z.infer` (= `z.output`): النوع بعد تطبيق defaults (كل الحقول مطلوبة).
> - `z.input`: النوع قبل تطبيق defaults (الحقول الافتراضية optional).
>
> استخدم `z.input` لـ input type، و `z.infer` لـ output type.

---

### 13.8 خطأ #8: AIActionButton `extract` prop مفقود

**الأعراض:**
زر "اقترح أسئلة بالـ AI" يظهر وكأنه يعمل (loading spinner → checkmark)، لكن **لا أسئلة تُضاف** فعلياً.

**السبب:**
الـ API endpoint يُرجع `{ success, questions: [...] }`، لكن `AIActionButton` يبحث افتراضياً عن `data.result`:
```typescript
// AIActionButton.tsx — الإعداد الافتراضي
const result = extract ? extract(data) : (
  typeof data.result === 'string' ? data.result : undefined
);
// data.result = undefined (لأن API يرجع data.questions!)
// → result = undefined → onResult لا يُستدعى أبداً
```

**الحل — مرّر `extract` function:**
```tsx
<AIActionButton
  endpoint="/api/v1/ai/suggest-questions"
  payload={{ title, topic, format, locale }}
  extract={(data) =>
    Array.isArray(data.questions) ? JSON.stringify(data.questions) : undefined
  }
  onResult={(result) => {
    const qs = JSON.parse(result);
    update('questions', qs.map(q => q.question));
  }}
  label="اقترح أسئلة"
/>
```

> 🔑 **القاعدة:** عندما تُرجع APIs شكلاً مختلفاً عن `{result: string}`، مرّر دائماً `extract` function لتحويل الاستجابة. وإلا فالزر سيبدو وكأنه يعمل بينما لا يفعل شيئاً.

---

### 13.9 خطأ #9: i18n في Recharts/Menus (hardcoded `.ar`)

**الأعراض:**
في الواجهة الإنجليزية، تظهر أسماء اللمات بالعربية في القوائم المنسدلة والرسوم البيانية.

**السبب:**
```typescript
// ❌ hardcoded .ar
{name: g.title.ar.slice(0, 25)}
<SelectItem>{g.title.ar}</SelectItem>
```

**الحل:**
```typescript
import { useLocale } from 'next-intl';
import { localized } from '@/lib/use-localized';

const locale = useLocale() as 'ar' | 'en';

// ✅ يحترم اللغة النشطة
{name: localized(g.title, locale).slice(0, 25)}
<SelectItem>{localized(g.title, locale)}</SelectItem>
```

> 🔑 **قاعدة التدقيق:** ابحث في الكود عن `.title.ar` و `.name.ar` و `.description.ar`. كل hardcoded reference يجب استبداله بـ `localized(obj, locale)`.

---

### 13.10 خطأ #10: استبدال `@old_handle` بـ `@new_handle` عبر `sed`

**الأعراض:**
عند إعادة تسمية host (مثلاً `@mohammed_poet` → `@khaled_artist`)، ننسى تحديث بعض الملفات.

**الحل — استبدال شامل عبر `sed`:**
```bash
# استبدل في كل ملفات src و scripts
for f in src/data/gatherings.ts src/data/letters.ts src/data/seed-applications.ts scripts/generate-letters.ts; do
  sed -i "s/@mohammed_poet/@khaled_artist/g" "$f"
done

# تحقق من عدم وجود بقايا
rg "@mohammed_poet" src/ scripts/
# يجب: لا نتائج
```

> 🔑 **قاعدة:** عند إعادة تسمية أي identifier فريد (handle, slug, userId)، استخدم `sed -i` عبر كل الملفات ثم تحقق بـ `rg`. لا تعتمد على الذاكرة.

---

## 14. طريقة البناء النهائية المُثلى (Best Build Pipeline)

> 🎯 **هذا القسم هو الخلاصة العملية** — الخطوات بالترتيب الصحيح لبناء مشروع Next.js كامل في بيئة sandbox دون أن تنهار. مُختبرة فعلياً على منصة Lamma (145 ملف، 8 topics، 5 hosts، 8 gatherings، AI concierge، WebSocket live companion، PWA).

### 14.1 الترتيب الصحيح للخطوات (لا تخرج عنه)

```
1. تهيئة المشروع + الإعدادات الأساسية
2. التعريف بالأنواع (types.ts) — قبل أي كود
3. البيانات الثابتة (data/*.ts)
4. الإعدادات (next.config, eslint, tsconfig, .env.example)
5. المكونات الأساسية (Container, Header, Footer, Card)
6. الصفحات الثابتة (home, about, faq)
7. الصفحات الديناميكية ([slug], [handle])
8. الـ stores (Zustand) + lib helpers
9. الـ API routes
10. الـ dashboard + auth flows
11. الميزات المتقدمة (AI, WebSocket, PWA)
12. الاختبار الشامل (tsc + lint + browser)
13. ملفات الإنتاج (Dockerfile, railway.json)
14. git commit + push
```

> ⚠️ **الخطأ الشائع:** بناء UI قبل تعريف الأنواع يؤدي لـ type mismatches في كل مكان. ابدأ بـ `types.ts` دائماً.

### 14.2 الإعدادات النهائية المُختبرة

#### `package.json` scripts (النسخة المُثلى للـ sandbox):
```json
{
  "scripts": {
    "dev": "next dev --webpack -p 3000 2>&1 | tee dev.log",
    "build": "next build && cp -r .next/static .next/standalone/.next/ && cp -r public .next/standalone/",
    "start": "NODE_ENV=production bun .next/standalone/server.js 2>&1 | tee server.log",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "live:start": "cd mini-services/live-companion && bun run dev",
    "live:install": "cd mini-services/live-companion && bun install",
    "db:push": "prisma db push",
    "db:generate": "prisma generate",
    "gen:images": "bun run scripts/generate-images.ts"
  }
}
```

> 🔑 **ملاحظات:**
> - `--webpack`: ضروري في sandbox (انظر خطأ #1). في الإنتاج احذفه.
> - `2>&1 | tee dev.log`: يحفظ الـ logs لملف لسهولة التشخيص.
> - `typecheck`: منفصل عن `lint` لأنهما يفحصان أشياء مختلفة.

#### `next.config.ts` (الإنتاج الجيد):
```typescript
import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,  // ✅ أبداً لا تتجاهل
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
};

export default withNextIntl(nextConfig);
```

#### `eslint.config.mjs` (الإعداد المتوازن):
```javascript
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    // TypeScript — warnings (لا errors) لتجنب blocking
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/ban-ts-comment": "warn",

    // React
    "react-hooks/exhaustive-deps": "warn",
    "react-hooks/purity": "off",  // Date.now() في server components مقبول
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",

    // Next.js
    "@next/next/no-img-element": "warn",
    "@next/next/no-html-link-for-pages": "off",

    // General — errors للأشياء الخطيرة فقط
    "prefer-const": "warn",
    "no-unused-vars": "off",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "no-empty": "warn",
    "no-irregular-whitespace": "error",
    "no-unreachable": "error",
    "no-useless-escape": "warn",
  },
}, {
  ignores: [
    "node_modules/**", ".next/**", "out/**", "build/**",
    "next-env.d.ts", "examples/**", "skills",
    "mini-services/**",  // mini-service له package مستقل
  ],
}];

export default eslintConfig;
```

#### `.gitignore` (الشامل):
```gitignore
# dependencies
node_modules

# next.js
/.next/
/out/

# env files — keep .env.example, ignore real secrets
.env
.env.local
.env.*.local

# typescript
*.tsbuildinfo
next-env.d.ts

# local database
db/*.db
db/*.db-journal

# agent artifacts (internal)
.claude
.z-ai-config
*.log
dev.log
server.log
worklog.md
/skills/
```

### 14.3 Dockerfile (multi-stage للإنتاج)

```dockerfile
# Stage 1: deps
FROM oven/bun:1-slim AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Stage 2: builder
FROM oven/bun:1-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN bun ./node_modules/prisma/build/index.js generate
RUN bun run build
RUN cd mini-services/live-companion && bun install

# Stage 3: prod-deps
FROM oven/bun:1-slim AS prod-deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --production --frozen-lockfile --ignore-scripts
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Stage 4: runner
FROM oven/bun:1-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=prod-deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --chown=nextjs:nodejs prisma ./prisma
COPY --chown=nextjs:nodejs package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/mini-services ./mini-services

USER nextjs
EXPOSE 3000 3003

CMD sh -c "node server.js & cd mini-services/live-companion && bun run start & wait"
```

### 14.4 بوابة الجودة النهائية (قبل كل commit)

```bash
#!/bin/bash
# scripts/pre-commit-check.sh

set -e

echo "=== 1. TypeScript check ==="
bun run typecheck
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found. Fix them before committing."
  exit 1
fi

echo "=== 2. ESLint check ==="
bun run lint
LINT_EXIT=$?
if [ $LINT_EXIT -ne 0 ]; then
  echo "❌ ESLint errors found (warnings are OK)."
  exit 1
fi

echo "=== 3. Verify dev server starts ==="
pkill -f "next" 2>/dev/null || true
sleep 2
bunx next dev --webpack -p 3000 > /dev/null 2>&1 &
DEV_PID=$!
sleep 8

# Test homepage
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 http://localhost:3000/)
kill $DEV_PID 2>/dev/null

if [ "$HTTP_CODE" != "200" ]; then
  echo "❌ Homepage returned HTTP $HTTP_CODE (expected 200)"
  exit 1
fi

echo ""
echo "✅ All checks passed! Ready to commit."
echo "   - tsc: 0 errors"
echo "   - eslint: 0 errors"
echo "   - homepage: HTTP 200"
```

### 14.5 سير عمل الـ Sandbox المُختبر

```
┌─────────────────────────────────────────────────────────────┐
│  1. اقرأ ARCHITECTURE.md + هذا المرجع                       │
├─────────────────────────────────────────────────────────────┤
│  2. ثبت الحزم: bun install                                   │
├─────────────────────────────────────────────────────────────┤
│  3. اكتب types.ts أولاً (كل الأنواع قبل أي كود)              │
├─────────────────────────────────────────────────────────────┤
│  4. اكتب data/*.ts (static data)                             │
├─────────────────────────────────────────────────────────────┤
│  5. اكتب الإعدادات (next.config, eslint, package.json)       │
│     ← هنا ضع --webpack و ignoreBuildErrors: false            │
├─────────────────────────────────────────────────────────────┤
│  6. اكتب المكونات الأساسية (Container, Header, Footer)       │
├─────────────────────────────────────────────────────────────┤
│  7. اكتب الصفحات (ابدأ بالثابتة، ثم الديناميكية)             │
│     ← استخدم Write tool لـ [slug]/[handle] folders          │
├─────────────────────────────────────────────────────────────┤
│  8. اكتب الـ stores + lib helpers                            │
├─────────────────────────────────────────────────────────────┤
│  9. اكتب API routes                                          │
├─────────────────────────────────────────────────────────────┤
│  10. شغّل dev server واختبر في المتصفح                       │
│      ← اقرأ dev.log بعد كل تغيير                             │
├─────────────────────────────────────────────────────────────┤
│  11. بعد كل ميزة:                                            │
│      bun run typecheck && bun run lint                      │
│      ← 0 errors مطلوب قبل المتابعة                           │
├─────────────────────────────────────────────────────────────┤
│  12. اكتب Dockerfile + railway.json                          │
├─────────────────────────────────────────────────────────────┤
│  13. git add + commit + push                                 │
│      ← لا ترفع .env, db/*.db, worklog.md                     │
├─────────────────────────────────────────────────────────────┤
│  14. تحقق من GitHub أن الملفات صحيحة                         │
│      ← استخدم GitHub API للتحقق من المحتوى                   │
└─────────────────────────────────────────────────────────────┘
```

### 14.6 القواعد الذهبية المستفادة من التجربة

1. **`--webpack` ينقذ الـ sandbox** — استخدمه دائماً في sandbox، واحذفه في الإنتاج.
2. **`Write` tool لـ dynamic routes** — لا تستخدم `mkdir` في bash للمجلدات بـ `[`.
3. **`tsc --noEmit` ≠ `eslint`** — شغّل الاثنين دائماً.
4. **`ignoreBuildErrors: false` دائماً** — لا تخفِ الأخطاء أبداً.
5. **`z.input` للـ input types** — `z.infer` للـ output. الفرق مهم في Zustand stores.
6. **`?? 0` و `?? []` للـ optional fields** — لا تثق بـ `?.` وحدها.
7. **`localized(obj, locale)` بدلاً من `obj.ar`** — في كل مكان.
8. **`extract` prop للـ AI buttons** — عندما يُرجع API شكلاً غير `{result}`.
9. **`sed -i` للإعادة التسمية الشاملة** — ثم تحقق بـ `rg`.
10. **اقرأ `dev.log` بعد كل تغيير** — الأخطاء تظهر هناك أولاً.

---

## 🎯 خاتمة

هذا الدليل هو خلاصة تجربة عملية في بناء مشاريع Full Stack باستخدام وكلاء GLM. الالتزام بالقواعد الـ15 ومنهجية Vibe Coding 7.0 سيوفر عليك 60-70% من الأخطاء الشائعة.

**تذكّر دائماً:**

1. **ابدأ بالقواعد الصارمة** — تطبيقها من البداية يمنع 90% من الأخطاء.
2. **تحقّق في المتصفح** — `build` ناجح لا يعني الموقع يعمل.
3. **أصلح السبب الجذري** — لا تُصلح العرض فقط.
4. **وثّق القرارات** — سجل لماذا اخترت X بدلاً من Y في `ARCHITECTURE.md`.
5. **راجع الكود** — قبل كل commit، راجع التغييرات عبر بوابة الجودة.
6. **لا تتجاوز بوابة الجودة أبداً** — كل تحذير تتجاوزه الآن يصبح خطأ صعب تتبعه لاحقاً.
7. **قسّم العمل لسبنتات صغيرة** — 30 دقيقة إلى 3 ساعات لكل سبنت.
8. **استخدم الملف الشقيق** للتعامل مع مشاكل النشر والتشخيص.

**الهدف النهائي:** مشروع يعمل بسلاسة، آمن، سريع، قابل للصيانة — مبني بأقل قدر من الأخطاء.

---

**الإصدار:** 2.0 | **الموجّه إلى:** GLM 5.2 Full Stack Agent | **آخر تحديث:** يونيو 2026
**المنهجية:** Vibe Coding 7.0 | **المرجع الشقيق:** `GLM-5.2-Assistant-Operations-Reference.md`
