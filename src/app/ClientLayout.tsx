'use client'
import { usePathname } from 'next/navigation';
import { CartProvider } from "./components/providers/cart-provider";
import { Sidebar } from "./components/sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname.startsWith('/admin');
  const hideSidebarRoutes = ['/register', '/login'];
  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);



  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <main className={`flex-1 ${!shouldHideSidebar ? 'lg:ml-64' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    </CartProvider>
  );
}