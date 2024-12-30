'use client';
import { useState } from 'react';
import { Check, Clock, ChefHat, Truck, Search, ArrowLeft, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Order } from '../types/order';
import { BottomNav } from '@/components/ui/layout/bottom-nav';
import { getOrdersByPhone } from '@/app/services/api';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderSkeleton } from '@/components/Skeleton';

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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-auto">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4"
        >
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Acompanhar Pedido</h1>
        </motion.div>

        <AnimatePresence mode="wait">
          {!isTracking ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
            >
              <div className="text-center space-y-4 mb-8">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <Search className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Rastreie seu pedido</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Digite seu número de telefone para acompanhar o status dos seus pedidos em tempo real
                </p>
              </div>

              <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-lg h-14 pl-12"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-14 text-lg font-semibold">
                  Buscar pedido
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {isLoading ? (
                <OrderSkeleton />
              ) : orders.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
                  <div className="mb-4">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto" />
                  </div>
                  <p className="text-red-500 text-lg">{error}</p>
                </div>
              ) : (
                orders.map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;
                  const currentStep = statusInfo.step;

                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                    >
                      <div className="p-6 space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Pedido de {order.name}</h2>
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
                            <StatusIcon className="h-5 w-5" />
                            <span>{statusInfo.label}</span>
                          </div>
                        </div>

                        {/* Progress Steps */}
                        <div className="relative py-4">
                          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
                          <div className="relative z-10 flex justify-between">
                            {statusSteps.map((step, index) => {
                              const StepIcon = step.icon;
                              const isActive = index <= currentStep;
                              return (
                                <div key={step.key} className="flex flex-col items-center">
                                  <motion.div
                                    initial={false}
                                    animate={{
                                      scale: isActive ? 1.2 : 1,
                                      backgroundColor: isActive ? 'var(--primary)' : 'var(--muted)',
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className={cn(
                                      'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                                      isActive
                                        ? 'text-primary-foreground'
                                        : 'text-muted-foreground'
                                    )}
                                  >
                                    <StepIcon className="h-5 w-5" />
                                  </motion.div>
                                  <span className="text-xs font-medium mt-2 text-muted-foreground">
                                    {step.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Total</p>
                            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">R$ {order.total.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Pagamento</p>
                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{order.paymentMethod}</p>
                          </div>
                          <div className="sm:col-span-2 lg:col-span-1">
                            <p className="text-sm font-medium text-muted-foreground">Endereço</p>
                            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">{order.address}</p>
                          </div>
                        </div>

                        {/* Products */}
                        <div className="space-y-4 pb-12">
                          <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-100">Itens do Pedido</h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {order.products.map((product) => (
                              <motion.div
                                key={product.id}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start gap-2">
                                    <div>
                                      <p className="font-semibold truncate text-gray-800 dark:text-gray-100">{product.product.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Quantidade: {product.quantity}
                                      </p>
                                    </div>
                                    <p className="font-semibold whitespace-nowrap text-gray-800 dark:text-gray-100">
                                      R$ {product.product.price.toFixed(2)}
                                    </p>
                                  </div>
                                  {product.additions && product.additions.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium text-muted-foreground">Adicionais:</p>
                                      <ul className="text-sm text-muted-foreground">
                                        {product.additions.map((addition) => (
                                          <li key={addition.id}>{addition.name} - R$ {addition.price.toFixed(2)}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  
                                  
                                                            
                                </div>
                                
                              </motion.div>
                            ))}
                            
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <BottomNav />
    </div>
  );
}

