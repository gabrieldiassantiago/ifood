'use client';
import { useState } from 'react';
import { Check, Clock, ChefHat, Truck, Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Order } from '../types/order';
import { BottomNav } from '@/components/ui/layout/bottom-nav';
import { getOrdersByPhone } from '@/app/services/api';
import { cn } from '@/lib/utils';

const statusSteps = [
  { key: 'pendente', icon: Clock, label: 'Pedido Recebido' },
  { key: 'preparando', icon: ChefHat, label: 'Em Preparo' },
  { key: 'enviado', icon: Truck, label: 'Em Entrega' },
  { key: 'entregue', icon: Check, label: 'Entregue' },
] as const;

type StatusKey = 'pendente' | 'preparando' | 'enviado' | 'entregue';

interface StatusInfo {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  label: string;
  step: number;
}

const getStatusInfo = (status: string): StatusInfo => {
  const statusMap: Record<StatusKey, StatusInfo> = {
    pendente: {
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-500/10',
      label: 'Pendente',
      step: 0
    },
    preparando: {
      icon: ChefHat,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-500/10',
      label: 'Preparando',
      step: 1
    },
    enviado: {
      icon: Truck,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-500/10',
      label: 'Em Entrega',
      step: 2
    },
    entregue: {
      icon: Check,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-500/10',
      label: 'Entregue',
      step: 3
    }
  };

  return statusMap[status.toLowerCase() as StatusKey] || statusMap.pendente;
};

export default function TrackPage() {
  const [phone, setPhone] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await getOrdersByPhone(phone);
      if (Array.isArray(response.data)) {
        setOrders(response.data);
        setError(null);
      } else {
        setOrders([]);
        setError('A resposta da API não é um array de pedidos.');
      }
      setIsTracking(true);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Não foi possível encontrar pedidos para este número de telefone.');
      setIsTracking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-auto">
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          {isTracking && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsTracking(false)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-2xl font-bold">Acompanhar Pedido</h1>
        </div>

        {!isTracking ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="text-center space-y-3 mb-8">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Rastreie seu pedido</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Digite seu número de telefone para acompanhar o status dos seus pedidos em tempo real
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <div className="space-y-2">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-lg h-12"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 text-base">
                Buscar pedido
              </Button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                <div className="mb-4">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                </div>
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                const currentStep = statusInfo.step;

                return (
                  <div
                    key={order.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg"
                  >
                    <div className="p-6 space-y-6">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold">Pedido de {order.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            Realizado em {new Date().toLocaleDateString()}
                          </p>
                        </div>
                        <div
                          className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium w-fit',
                            statusInfo.bgColor,
                            statusInfo.color
                          )}
                        >
                          <StatusIcon className="h-4 w-4" />
                          <span>{statusInfo.label}</span>
                        </div>
                      </div>

                      {/* Progress Steps */}
                      <div className="relative">
                        <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
                        <div className="relative z-10 flex justify-between">
                          {statusSteps.map((step, index) => {
                            const StepIcon = step.icon;
                            const isActive = index <= currentStep;
                            return (
                              <div key={step.key} className="flex flex-col items-center">
                                <div
                                  className={cn(
                                    'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
                                    isActive
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-gray-100 dark:bg-gray-800 text-muted-foreground'
                                  )}
                                >
                                  <StepIcon className="h-4 w-4" />
                                </div>
                                <span className="text-xs font-medium mt-2 text-muted-foreground">
                                  {step.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total</p>
                          <p className="text-2xl font-bold">R$ {order.total.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Pagamento</p>
                          <p className="font-semibold">{order.paymentMethod}</p>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                          <p className="font-semibold">{order.address}</p>
                        </div>
                      </div>

                      {/* Products */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Itens do Pedido</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {order.products.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-start gap-4 p-2 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              {/* Removido o ícone de status aqui */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <p className="font-semibold truncate">{product.product.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Quantidade: {product.quantity}
                                    </p>
                                  </div>
                                  <p className="font-semibold whitespace-nowrap">
                                    R$ {product.product.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}