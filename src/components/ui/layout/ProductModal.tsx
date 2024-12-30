import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, X, MessageSquare } from 'lucide-react';
import { Addition, Product } from '@/app/types/order';
import { getAdditions } from '@/app/services/api';
import { cn } from '@/lib/utils';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, additions: Addition[], observation: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onAddToCart }) => {
  const [additions, setAdditions] = useState<Addition[]>([]);
  const [selectedAdditions, setSelectedAdditions] = useState<Addition[]>([]);
  const [observation, setObservation] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const fetchAdditions = async () => {
      const response = await getAdditions();
      setAdditions(response.data);
    };

    if (isOpen) {
      fetchAdditions();
      setSelectedAdditions([]);
      setObservation('');
      setShowNotes(false);
    }
  }, [isOpen]);

  const handleAddAddition = (addition: Addition) => {
    setSelectedAdditions((prev) => [...prev, addition]);
  };

  const handleRemoveAddition = (additionId: string) => {
    setSelectedAdditions((prev) => prev.filter((addition) => addition.id !== additionId));
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedAdditions, observation);
    onClose();
  };

  const totalPrice = React.useMemo(() => {
    const additionsTotal = selectedAdditions.reduce((sum, addition) => sum + addition.price, 0);
    return (product.price + additionsTotal).toFixed(2);
  }, [product.price, selectedAdditions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-blue-600">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Adicionais</h3>
            <ScrollArea className="h-[240px] pr-4">
              <div className="space-y-3">
                {additions.map((addition) => {
                  const isSelected = selectedAdditions.some((a) => a.id === addition.id);
                  return (
                    <div
                      key={addition.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg transition-colors",
                        isSelected ? "bg-blue-50 dark:bg-blue-950" : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                    >
                      <div>
                        <p className="font-medium">{addition.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          R$ {addition.price.toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant={isSelected ? "destructive" : "secondary"}
                        size="icon"
                        onClick={() => isSelected ? handleRemoveAddition(addition.id) : handleAddAddition(addition)}
                      >
                        {isSelected ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Selected Additions Summary */}
          {selectedAdditions.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Selecionados</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAdditions.map((addition) => (
                  <Badge
                    key={addition.id}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {addition.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div className="mb-6">
            <Button
              variant="ghost"
              className="w-full justify-start px-0 text-gray-600 dark:text-gray-300"
              onClick={() => setShowNotes(!showNotes)}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Adicionar observações
            </Button>
            {showNotes && (
              <Textarea
                placeholder="Ex: Sem cebola, molho à parte..."
                className="mt-3"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
              />
            )}
          </div>

          <Separator className="my-6" />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Valor total</p>
              <p className="text-2xl font-bold">R$ {totalPrice}</p>
            </div>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleAddToCart}
            >
              Adicionar ao carrinho
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;