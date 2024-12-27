'use client'

import { useState } from 'react'
import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { motion } from 'framer-motion'
import { Product } from '@/app/types/order'

interface ProductListProps {
  products: Product[]
}

export function ProductList({ products }: ProductListProps) {
  const { addToCart } = useCart()
  const [addedProducts, setAddedProducts] = useState<{ [key: string]: boolean }>({})

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    setAddedProducts({ ...addedProducts, [product.id]: true })
    setTimeout(() => {
      setAddedProducts({ ...addedProducts, [product.id]: false })
    }, 2000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product) => (
        <motion.div 
          key={product.id} 
          className="bg-white rounded-2xl p-6 relative shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center z-10"
            aria-label="Add to favorites"
          >
            <Heart size={16} className="stroke-gray-400" />
          </button>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-blue-600 text-lg font-semibold">
                R$ {product.price.toFixed(2)}
              </span>
              <Button
                size="sm"
                variant={addedProducts[product.id] ? "secondary" : "default"}
                onClick={() => handleAddToCart(product)}
                className="h-10 px-4 text-sm rounded-xl transition-all duration-300 ease-in-out"
                disabled={!product.availability || product.stock === 0}
              >
                {addedProducts[product.id] ? (
                  <motion.span
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    Adicionado!
                  </motion.span>
                ) : (
                  <>
                    <ShoppingCart size={16} className="mr-2" />
                    {product.availability && product.stock > 0 ? 'Adicionar' : 'Indisponível'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

