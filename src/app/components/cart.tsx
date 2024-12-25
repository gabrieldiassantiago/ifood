'use client'
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingBag, Trash2 } from 'lucide-react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { useCart } from "./providers/cart-provider";


export function Cart() {
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [loading] = useState(false);
  const router = useRouter();

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const addonTotal = item.addons?.reduce((addonSum, addon) => addonSum + addon.price, 0) || 0;
      return total + (item.price + addonTotal) * item.quantity;
    }, 0);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white border rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <ShoppingBag className="mr-2" />
        Meu Carrinho
      </h2>
      
      <ScrollArea className="h-[400px] pr-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-6 pb-4 border-b last:border-none"
            >
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} cada
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  {item.addons && item.addons.length > 0 && (
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="font-medium">Acréscimos:</span>
                      {item.addons.map((addon, index) => (
                        <span key={index} className="ml-1">
                          {addon.name} (+${addon.price.toFixed(2)})
                          {index < item.addons!.length - 1 ? ',' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  className="w-16 text-center border rounded-md p-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">Seu carrinho está vazio.</p>
        )}
      </ScrollArea>

      {items.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-xl font-semibold text-gray-800">
            <span>Total:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>

          <Button 
            className="w-full" 
            variant="default" 
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? "Carregando..." : "Finalizar Compra"}
          </Button>

          <Button className="w-full" variant="outline" onClick={clearCart}>
            Limpar Carrinho
          </Button>
        </div>
      )}
    </div>
  );
}
