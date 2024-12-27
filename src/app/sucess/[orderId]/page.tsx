'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { getOrder } from '@/app/services/api'
import { Order } from '@/app/types/order'


export default function SuccessPage() {
  const params = useParams()
  const orderId = params.orderId as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
    if (orderId) {
      getOrder(orderId)
        .then(response => {
          setOrder(response.data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Error fetching order:', err)
          setError('Não foi possível carregar os detalhes do pedido.')
          setLoading(false)
        })
    }
  }, [orderId, clearCart])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando detalhes do pedido...</div>
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Pedido não encontrado.</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
        <div className="text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">Pedido realizado com sucesso!</h1>
          <p className="text-gray-600">
            Seu pedido foi confirmado e está sendo preparado.
          </p>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="font-semibold text-lg mb-2">Resumo do Pedido</p>
          <p className="text-gray-700">Número do pedido: <span className="font-medium">{order.id}</span></p>
          <p className="text-gray-700">Total: <span className="font-medium">R$ {order.total.toFixed(2)}</span></p>
          <p className="text-gray-700">Método de pagamento: <span className="font-medium">{order.paymentMethod}</span></p>
          <p className="text-gray-700">Endereço de entrega: <span className="font-medium">{order.address}</span></p>
        </div>

        <div className="space-y-2">
          <p className="font-semibold">Itens do pedido:</p>
          {order.products.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
             <span>{item.product.name}</span>
              <span>Qtd: {item.quantity}</span>
              <span>R$ {item.product.price.toFixed(2)}</span>
            
            </div>
          ))}
        </div>

        <Button
          className="w-full"
          onClick={() => window.location.href = '/'}
        >
          Voltar para a página inicial
        </Button>
      </div>
    </div>
  )
}

