'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingCart, User } from 'lucide-react'
import { useCart } from '@/hooks/use-cart'
import { motion } from 'framer-motion'

export function BottomNav() {
  const pathname = usePathname()
  const { items } = useCart()

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

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
        <div className="relative">
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
            >
              {totalItems}
            </motion.div>
          )}
        </div>
        <span className="text-[10px]">Carrinho</span>
      </Link>
      <Link 
        href="/track"
        className={`flex flex-col items-center gap-1 ${
          pathname === '/track' ? 'text-blue-600' : 'text-gray-400'
        }`}
      >
        <User size={20} />
        <span className="text-[10px]">Rastrear pedido</span>
      </Link>
     
    </nav>
  )
}

