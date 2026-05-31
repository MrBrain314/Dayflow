import JournalEditor from '@/components/JournalEditor'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function JournalPage() {
  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-5 py-10">
        <JournalEditor />
      </main>
      <Footer />
    </div>
  )
}
