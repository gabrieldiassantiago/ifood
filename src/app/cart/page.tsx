'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { BottomNav } from '@/components/ui/layout/bottom-nav'

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeFromCart } = useCart()

  const subtotal = items.reduce((acc, item) => {
    const additionsTotal = item.additions?.reduce((sum, addition) => sum + addition.price, 0) || 0
    return acc + (item.price + additionsTotal) * item.quantity
  }, 0)
  const total = subtotal

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="px-4 py-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Detalhes do Pedido</h1>

        <div className="space-y-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md"
            >
              <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                <Image
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
                <p className="text-blue-600 text-base font-semibold">R$ {item.price.toFixed(2)}</p>
                {item.additions && item.additions.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-600">Acréscimos:</h4>
                    <ul className="text-sm text-gray-600">
                      {item.additions.map((addition) => (
                        <li key={addition.id}>{addition.name} - R$ {addition.price.toFixed(2)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {item.observation && (
                  <p className="mt-2 text-sm text-gray-600">Observação: {item.observation}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-gray-200"
                  onClick={() => {
                    if (item.quantity > 1) {
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  }}
                >
                  <Minus size={14} className="text-gray-500" />
                </Button>
                <span className="text-lg w-6 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-gray-200"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={14} className="text-gray-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-gray-200"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={14} className="text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 space-y-4 shadow-md">
          <div className="flex justify-between text-base">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="pt-4 border-t">
            <div className="flex justify-between">
              <span className="font-medium text-lg">Total</span>
              <span className="font-semibold text-lg">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Button
          className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl mt-6"
          onClick={() => router.push('/checkout')}
          disabled={items.length === 0}
        >
          Continuar meu pedido
        </Button>
      </div>
      <BottomNav />
    </div>
  )
}