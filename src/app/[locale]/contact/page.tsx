import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { ContactView } from '@/components/contact/contact-view'

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="bg-background">
        <ContactView />
      </div>
      <Footer />
    </>
  )
}
