import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-scam-bg">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
