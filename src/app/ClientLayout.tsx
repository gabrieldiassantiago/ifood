'use client'
import { CartProvider } from "./components/providers/cart-provider";

export default function ClientLayout({ children }: { children: React.ReactNode }) {



  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <main>
            {children}
          </main>
        </div>
      </div>
    </CartProvider>
  );
}