'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Wallet, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useCart } from '@/hooks/use-cart';
import { PaymentMethod, OrderRequest } from '../types/order';
import { createOrder } from '../services/api';
import { BottomNav } from '@/components/ui/layout/bottom-nav';

const paymentMethods: PaymentMethod[] = [
  { id: 'credit', name: 'Cartão de Crédito', icon: 'credit-card' },
  { id: 'pix', name: 'PIX', icon: 'qr-code' },
  { id: 'cash', name: 'Dinheiro', icon: 'wallet' },
];

export default function PaymentPage() {
  const router = useRouter();
  const { clearCart, items } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [changeAmount, setChangeAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [neighborhoodId, setNeighborhoodId] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');

  const checkoutData = {
    products: items.map(item => ({ productId: item.id, quantity: item.quantity })),
    total: items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    name,
    phone,
    address,
    neighborhoodId,
    deliveryMethod,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData: OrderRequest = {
        ...checkoutData,
        paymentMethod: selectedMethod,
        changeFor: selectedMethod === 'cash' ? parseFloat(changeAmount) : undefined,
      };

      const response = await createOrder(orderData);
      clearCart();
      router.push(`/success?orderId=${response.data.id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erro ao criar o pedido. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'credit-card':
        return <CreditCard className="h-5 w-5" />;
      case 'qr-code':
        return <QrCode className="h-5 w-5" />;
      case 'wallet':
        return <Wallet className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="pb-20">
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-semibold">Forma de pagamento</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm text-gray-700">
              Nome
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl border-gray-200 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm text-gray-700">
              Telefone
            </Label>
            <Input
              id="phone"
              type="text"
              placeholder="Digite seu telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 rounded-xl border-gray-200 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm text-gray-700">
              Endereço
            </Label>
            <Input
              id="address"
              type="text"
              placeholder="Digite seu endereço"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-12 rounded-xl border-gray-200 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhoodId" className="text-sm text-gray-700">
              Bairro
            </Label>
            <Input
              id="neighborhoodId"
              type="text"
              placeholder="Digite seu bairro"
              value={neighborhoodId}
              onChange={(e) => setNeighborhoodId(e.target.value)}
              className="h-12 rounded-xl border-gray-200 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryMethod" className="text-sm text-gray-700">
              Método de Entrega
            </Label>
            <select
              id="deliveryMethod"
              value={deliveryMethod}
              onChange={(e) => setDeliveryMethod(e.target.value as 'delivery' | 'pickup')}
              className="h-12 rounded-xl border-gray-200 bg-white"
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Retirar</option>
            </select>
          </div>

          <RadioGroup
            value={selectedMethod}
            onValueChange={setSelectedMethod}
            className="space-y-4"
          >
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center space-x-4 border rounded-lg p-4"
              >
                <RadioGroupItem value={method.id} id={method.id} />
                <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer">
                  {getIcon(method.icon)}
                  {method.name}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedMethod === 'cash' && (
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
                className="h-12 rounded-xl border-gray-200 bg-white"
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!selectedMethod || loading}
          >
            {loading ? 'Processando...' : 'Finalizar pedido'}
          </Button>
        </form>
      </div>
      <BottomNav />
    </div>
  );
}