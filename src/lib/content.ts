import fs from 'fs/promises'
import path from 'path'

/**
 * Read a markdown content file for the given locale and page name.
 * Falls back to Arabic if the requested locale file doesn't exist.
 */
export async function getContent(
  locale: string,
  page: 'about' | 'terms' | 'privacy' | 'refund'
): Promise<string> {
  const basePath = path.join(process.cwd(), 'content')
  const localeDir = locale === 'en' ? 'en' : 'ar'
  const filePath = path.join(basePath, localeDir, `${page}.md`)

  try {
    return await fs.readFile(filePath, 'utf-8')
  } catch {
    // Fallback to Arabic
    const fallbackPath = path.join(basePath, 'ar', `${page}.md`)
    return await fs.readFile(fallbackPath, 'utf-8')
  }
}
