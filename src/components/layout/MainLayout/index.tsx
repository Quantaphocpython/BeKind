import MainContent from '../MainContent'
import Footer from './Footer'
import Header from './Header'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="app-layout">
      <Header />

      <MainContent>
        {children}

        <Footer />
      </MainContent>
    </main>
  )
}
