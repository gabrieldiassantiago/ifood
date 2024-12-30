'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCart } from '@/hooks/use-cart'
import { CreditCard, Wallet, QrCode, Truck, Store } from 'lucide-react'
import { CustomerDetails, EntregasBairros, PaymentMethod } from '../types/order'
import { createOrder, getNeighborhoods } from '../services/api'
import { BottomNav } from '@/components/ui/layout/bottom-nav'

const paymentMethods: PaymentMethod[] = [
  { id: 'credit', name: 'Cartão de Crédito', icon: 'credit-card' },
  { id: 'pix', name: 'PIX', icon: 'qr-code' },
  { id: 'cash', name: 'Dinheiro', icon: 'wallet' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [details, setDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    address: '',
    neighborhood: '',
    deliveryType: 'delivery'
  })
  const [neighborhoods, setNeighborhoods] = useState<EntregasBairros[]>([])
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<EntregasBairros | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [changeAmount, setChangeAmount] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const response = await getNeighborhoods()
        setNeighborhoods(response.data)
      } catch (error) {
        console.error('Error fetching neighborhoods:', error)
      }
    }

    fetchNeighborhoods()
  }, [])

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const deliveryFee = selectedNeighborhood ? selectedNeighborhood.value : 0
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  
    try {
      const orderData = {
        products: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          additions: item.additions?.map(addition => ({
            additionId: addition.id,
            price: addition.price
          })) || []
        })),
        address: details.address,
        paymentMethod: paymentMethod,
        name: details.name,
        phone: details.phone,
        deliveryMethod: details.deliveryType,
        neighborhoodId: selectedNeighborhood?.id,
        changeFor: paymentMethod === 'cash' ? parseFloat(changeAmount) : undefined,
        total: total
      }
  
      const response = await createOrder(orderData)
      clearCart()
      router.push(`/sucess/${response.data.id}`)
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Erro ao criar o pedido. Por favor, tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'credit-card':
        return <CreditCard className="h-5 w-5" />
      case 'qr-code':
        return <QrCode className="h-5 w-5" />
      case 'wallet':
        return <Wallet className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="px-4 py-6 space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Finalizar pedido</h1>

        <div className="bg-white rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-medium text-gray-900">Resumo do pedido</h2>
          {items.map((item) => (
            <div key={item.id} className="flex flex-col space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{item.name} x {item.quantity}</span>
                <span className="text-gray-700">R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
              {item.additions && item.additions.length > 0 && (
                <div className="pl-4 text-sm text-gray-500">
                  <span>Acréscimos:</span>
                  <ul className="list-disc list-inside">
                    {item.additions.map((addition) => (
                      <li key={addition.id}>{addition.name} - R$ {addition.price.toFixed(2)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Taxa de entrega</span>
              <span>R$ {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-lg mt-2">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-gray-700">
              Seu nome
            </Label>
            <Input
              id="name"
              placeholder="Insira seu nome aqui..."
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
              required
              className="h-12 rounded-xl border-gray-300 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm text-gray-700">
              Seu telefone (WhatsApp)
            </Label>
            <Input
              id="phone"
              placeholder="Insira seu telefone aqui..."
              value={details.phone}
              onChange={(e) => setDetails({ ...details, phone: e.target.value })}
              required
              className="h-12 rounded-xl border-gray-300 bg-white"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm text-gray-700">
              Tipo de entrega
            </Label>
            <RadioGroup
              defaultValue="delivery"
              onValueChange={(value) => 
                setDetails({ ...details, deliveryType: value as 'delivery' | 'pickup' })
              }
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-white rounded-xl p-4 shadow-md transition-all hover:shadow-lg cursor-pointer [&:has(:checked)]:ring-2 [&:has(:checked)]:ring-blue-600">
                <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                <Label 
                  htmlFor="delivery" 
                  className="flex flex-col items-center gap-2"
                >
                  <Truck className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium">Entrega</span>
                  <span className="text-xs text-gray-500">30-45 min</span>
                </Label>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md transition-all hover:shadow-lg cursor-pointer [&:has(:checked)]:ring-2 [&:has(:checked)]:ring-blue-600">
                <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                <Label 
                  htmlFor="pickup" 
                  className="flex flex-col items-center gap-2"
                >
                  <Store className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium">Retirar</span>
                  <span className="text-xs text-gray-500">15-20 min</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {details.deliveryType === 'delivery' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm text-gray-700">
                  Qual é seu endereço?
                </Label>
                <Input
                  id="address"
                  placeholder="ex: av são paulo, 23"
                  value={details.address}
                  onChange={(e) => setDetails({ ...details, address: e.target.value })}
                  required
                  className="h-12 rounded-xl border-gray-300 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood" className="text-sm text-gray-700">
                  Qual é seu bairro?
                </Label>
                <Select
                  onValueChange={(value) => {
                    const selected = neighborhoods.find(n => n.id === value)
                    setSelectedNeighborhood(selected || null)
                  }}
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-300 bg-white">
                    <SelectValue placeholder="Selecione seu bairro" />
                  </SelectTrigger>
                  <SelectContent>
                    {neighborhoods.map((neighborhood) => (
                      <SelectItem key={neighborhood.id} value={neighborhood.id}>
                        {neighborhood.name} - R$ {neighborhood.value.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-4">
            <Label className="text-sm text-gray-700">
              Forma de pagamento
            </Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-4"
            >
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center space-x-4 border rounded-xl p-4 shadow-md transition-all hover:shadow-lg  [&:has(:checked)]:ring-2 [&:has(:checked)]:ring-blue-600 cursor-pointer"
                >
                  <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                  <Label htmlFor={method.id} className="flex items-center gap-2">
                    {getIcon(method.icon)}
                    {method.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {paymentMethod === 'cash' && (
            <div className="space-y-2">
              <Label htmlFor="changeAmount" className="text-sm text-gray-700">
                Troco para quanto?
              </Label>
              <Input
                id="changeAmount"
                type="number"
                placeholder="Digite o valor para troco"
                value={changeAmount}
                onChange={(e) => setChangeAmount(e.target.value)}
                className="h-12 rounded-xl border-gray-300 bg-white"
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg"
            disabled={loading || (details.deliveryType === 'delivery' && !selectedNeighborhood) || !paymentMethod}
          >
            {loading ? 'Processando...' : 'Finalizar pedido'}
          </Button>
        </form>
      </div>
      <BottomNav />
    </div>
  )
}