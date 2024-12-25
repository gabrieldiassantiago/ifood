"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from "./providers/cart-provider";
import { Modal } from "./moda";
import { FoodItemSkeleton } from "./Loading";
import useSWR from 'swr';

interface Addon {
  name: string;
  price: number;
}

interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  availability: boolean;
  addons?: Addon[];
}

interface FoodGridProps {
  searchTerm: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function FoodGrid({ searchTerm }: FoodGridProps) {
  const { addItem } = useCart();
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: foodItems, error, isLoading } = useSWR("https://order-back-1.onrender.com/products", fetcher);

  if (error) return <div>Falha ao carregar</div>;
  if (isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <FoodItemSkeleton key={index} />
      ))}
    </div>
  );

  const handleAddToCart = () => {
    if (currentItem) {
      addItem({ ...currentItem, addons: selectedAddons, quantity });
      setIsModalOpen(false);
      setSelectedAddons([]);
      setQuantity(1);
    }
  };

  const openModal = (item: FoodItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const filteredFoodItems = foodItems
    .filter((item: FoodItem) => item.availability) 
    .filter((item: FoodItem) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredFoodItems.map((item: FoodItem) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
            <p className="text-sm text-gray-600 mb-4">${item.price.toFixed(2)}</p>
            <Button
              variant="default"
              className="w-full bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 transition duration-200"
              onClick={() => openModal(item)}
            >
              Adicionar ao Carrinho
            </Button>
          </div>
        ))}

        {isModalOpen && currentItem && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="p-6 bg-white rounded-xl shadow-xl w-full max-w-md mx-auto relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
              <Image
                src={currentItem.image}
                alt={currentItem.name}
                width={350}
                height={200}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">{currentItem.name}</h3>
              <p className="text-lg text-gray-600 mb-5">${currentItem.price.toFixed(2)} each</p>

              <div className="space-y-4 mb-6">
                <h4 className="text-sm font-medium text-gray-700">Add-ons</h4>
                {currentItem.addons && currentItem.addons.map((addon, index) => (
                  <label key={index} className="flex items-center justify-between text-sm text-gray-600">
                    <span>{addon.name} (+${addon.price.toFixed(2)})</span>
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-orange-500"
                      onChange={() => {
                        if (selectedAddons.includes(addon)) {
                          setSelectedAddons(selectedAddons.filter((a) => a !== addon))
                        } else {
                          setSelectedAddons([...selectedAddons, addon])
                        }
                      }}
                    />
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-700">Quantidade:</span>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-3 text-lg font-semibold">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                variant="default"
                size="lg"
                onClick={handleAddToCart}
                className="w-full bg-orange-500 text-white hover:bg-orange-600"
              >
                Adicionar ao Carrinho
              </Button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
