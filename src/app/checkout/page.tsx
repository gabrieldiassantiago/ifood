'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';
import { useCart } from '../components/providers/cart-provider';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  addons?: { name: string; price: number }[];
}

interface Neighborhood {
  id: string;
  name: string;
  value: number;
}

export default function Checkout() {
  const { items, clearCart, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryMethod: 'delivery',
  });

  useEffect(() => {
    const fetchNeighborhoods = async () => {
      try {
        const response = await axios.get('https://order-back-1.onrender.com/neighborhoods');
        setNeighborhoods(response.data);
      } catch (error) {
        console.error('Error fetching neighborhoods:', error);
      }
    };

    fetchNeighborhoods();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNeighborhoodChange = (neighborhoodId: string) => {
    const neighborhood = neighborhoods.find(n => n.id === neighborhoodId);
    setSelectedNeighborhood(neighborhood || null);
  };

  const getTotalPrice = () => {
    const itemsTotal = items.reduce((total, item) => {
      const addonTotal = item.addons?.reduce((addonSum, addon) => addonSum + addon.price, 0) || 0;
      return total + (item.price + addonTotal) * item.quantity;
    }, 0);
    
    const deliveryFee = selectedNeighborhood && formData.deliveryMethod === 'delivery' ? selectedNeighborhood.value : 0;
    return itemsTotal + deliveryFee;
  };

  if (items.length === 0) {
    router.push('/menu');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const products = items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      }));
      const address = formData.deliveryMethod === 'pickup' ? 'Retirada na loja' : `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zipCode}`;

      const orderData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        products,
        address,
        deliveryMethod: formData.deliveryMethod,
        paymentMethod,
        neighborhoodId: selectedNeighborhood?.id,
        totalPrice: getTotalPrice(),
      };

      const response = await axios.post('https://order-back-1.onrender.com/orders', orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Log the response to see the returned data
      console.log('Order response:', response.data);

      setLoading(false);
      clearCart();
      router.push('/success');
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      setError('Ocorreu um erro ao tentar criar seu pedido. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Pedido</h1>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
            <CardDescription>Revise seus itens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item: CartItem) => (
                <div key={item.id} className="flex items-center justify-between space-x-4 border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 relative">
                      <Image
                        src={item.image}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                      {item.addons && item.addons.length > 0 && (
                        <p className="text-xs text-gray-500">
                          Acréscimos: {item.addons.map(addon => addon.name).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${((item.price + (item.addons?.reduce((sum, addon) => sum + addon.price, 0) || 0)) * item.quantity).toFixed(2)}
                    </p>
                    <button className="text-sm text-red-500 hover:text-red-700" onClick={() => removeItem(item.id)}>
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Subtotal</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            {selectedNeighborhood && formData.deliveryMethod === 'delivery' && (
              <div className="flex justify-between items-center text-sm mt-2">
                <span>Taxa de entrega ({selectedNeighborhood.name})</span>
                <span>${selectedNeighborhood.value.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center font-bold text-xl mt-4">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações de Entrega</CardTitle>
            <CardDescription>Preencha seus dados para concluir o pedido</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <Label>Método de Pagamento</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="mt-2 space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit" id="credit" />
                      <Label htmlFor="credit">Cartão de Crédito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pix" id="pix" />
                      <Label htmlFor="pix">Pix</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <Label>Método de Entrega</Label>
                <RadioGroup
                  value={formData.deliveryMethod}
                  onValueChange={(value: string) => handleSelectChange('deliveryMethod', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Entrega</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup">Retirada na Loja</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.deliveryMethod === 'delivery' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required={formData.deliveryMethod === 'delivery'}
                      placeholder="Rua, número, complemento"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required={formData.deliveryMethod === 'delivery'}
                      placeholder="Sua cidade"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required={formData.deliveryMethod === 'delivery'}
                      placeholder="Seu estado"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required={formData.deliveryMethod === 'delivery'}
                      placeholder="Seu CEP"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Select onValueChange={handleNeighborhoodChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o bairro" />
                      </SelectTrigger>
                      <SelectContent>
                        {neighborhoods.map((neighborhood) => (
                          <SelectItem key={neighborhood.id} value={neighborhood.id}>
                            {neighborhood.name} - Taxa de entrega: R${neighborhood.value.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Atenção</AlertTitle>
                <AlertDescription>
                  O pagamento será realizado na entrega ou retirada através de máquina de cartão.
                </AlertDescription>
              </Alert>
              
              {error && (
                <div className="text-red-500 text-center mt-4">
                  {error}
                </div>
              )}

            </form>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSubmit}
              className="w-full" 
              disabled={loading || (formData.deliveryMethod === 'delivery' && !selectedNeighborhood)}
            >
              {loading ? "Processando..." : "Confirmar Pedido"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}