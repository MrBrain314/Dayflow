import TodoList from '@/components/TodoList'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <TodoList />
      </main>
      <Footer />
    </div>
  )
}
