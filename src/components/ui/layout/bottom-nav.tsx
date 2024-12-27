'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingCart, User } from 'lucide-react'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex items-center justify-around px-4">
      <Link 
        href="/"
        className={`flex flex-col items-center gap-1 ${
          pathname === '/' ? 'text-blue-600' : 'text-gray-400'
        }`}
      >
        <Home size={20} />
        <span className="text-[10px]">Início</span>
      </Link>
      <Link 
        href="/cart"
        className={`flex flex-col items-center gap-1 ${
          pathname === '/cart' ? 'text-blue-600' : 'text-gray-400'
        }`}
      >
        <ShoppingCart size={20} />
        <span className="text-[10px]">Carrinho</span>
      </Link>
      <Link 
        href="/track"
        className={`flex flex-col items-center gap-1 ${
          pathname === '/track' ? 'text-blue-600' : 'text-gray-400'
        }`}
      >
        <User size={20} />
        <span className="text-[10px]">Acompanhar pedido</span>
      </Link>
    
    </nav>
  )
}

