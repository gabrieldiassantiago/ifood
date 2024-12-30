'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  CreditCard, 
  Package, 
  ChevronLeft,
  
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CartItem, useCart } from '@/hooks/use-cart'
import { getOrder } from '@/app/services/api'
import { Order } from '@/app/types/order'
import { motion, AnimatePresence } from 'framer-motion'

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pendente' },
    preparing: { color: 'bg-blue-100 text-blue-800', label: 'Preparando' },
    delivering: { color: 'bg-purple-100 text-purple-800', label: 'Em entrega' },
    completed: { color: 'bg-green-100 text-green-800', label: 'Entregue' },
  }[status] || { color: 'bg-gray-100 text-gray-800', label: status }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
      {statusConfig.label}
    </span>
  )
}

const OrderItem = ({ item }: { item: CartItem }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-3"
  >
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.product.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Quantidade: {item.quantity} × R$ {item.product.price.toFixed(2)}
        </p>
      </div>
      <p className="font-semibold text-gray-900 dark:text-gray-100">
        R$ {(item.quantity * item.product.price).toFixed(2)}
      </p>
    </div>

    {item.additions && item.additions.length > 0 && (
      <div className="space-y-2">
        <h5 className="font-medium text-gray-700 dark:text-gray-300">Adicionais:</h5>
        <ul className="text-sm text-gray-600 dark:text-gray-400">
          {item.additions.map(addition => (
            <li key={addition.id}>
              <Badge variant="secondary" className="px-2 py-1">
                {addition.name} - R$ {addition.price.toFixed(2)}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    )}

    {item.observation && (
      <div className="text-sm bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
        <p className="font-medium text-gray-700 dark:text-gray-300">Observações:</p>
        <p className="text-gray-600 dark:text-gray-400 italic">{item.observation}</p>
      </div>
    )}
  </motion.div>
)

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Clock className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Carregando detalhes do pedido...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 bg-red-100 p-4 rounded-full inline-block">
            <Package className="w-12 h-12" />
          </div>
          <p className="text-red-500 font-medium">{error}</p>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Package className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-gray-600">Pedido não encontrado.</p>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    )
  }

  const subtotal = order.products.reduce((sum, item) => {
    const itemTotal = item.product.price * item.quantity
    const additionsTotal = item.additions?.reduce((acc, add) => acc + add.price, 0) || 0
    return sum + itemTotal + (additionsTotal * item.quantity)
  }, 0)

  const deliveryFee = order.deliveryMethod === 'delivery' ? order.neighborhood?.value || 0 : 0
  const total = subtotal + deliveryFee

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Pedido realizado com sucesso!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Seu pedido foi confirmado e está sendo preparado.
          </p>
        </motion.div>

        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-sm opacity-90">Número do pedido</p>
                <p className="font-mono text-lg">{order.id}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid gap-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Endereço de entrega
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{order.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    Método de pagamento
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>

            
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Itens do pedido
              </h3>
              <AnimatePresence>
                <div className="space-y-4">
                  {order.products.map((item, index) => (
                    <OrderItem key={index} item={item} />
                  ))}
                </div>
              </AnimatePresence>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              {order.deliveryMethod === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Taxa de entrega</span>
                  <span>R$ {deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => window.location.href = '/'}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar para a página inicial
          </Button>
        </div>
      </div>
    </div>
  )
}