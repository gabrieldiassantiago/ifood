'use client'

import { useState } from 'react'
import { Heart, ShoppingCart, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { motion, AnimatePresence } from 'framer-motion'
import { Product } from '@/app/types/order'
import Image from 'next/image'

interface ProductListProps {
  products: Product[]
  isLoading: boolean
}

const SkeletonLoader = () => {
  return (
    <div className="bg-white rounded-2xl p-6 relative shadow-sm animate-pulse">
      <div className="absolute right-4 top-4 w-8 h-8 rounded-full bg-gray-200"></div>
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-48 bg-gray-200 rounded"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
      </div>
    </div>
  )
}

const SuccessAlert = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg"
  >
    <CheckCircle size={20} className="inline mr-2" />
    {message}
  </motion.div>
)

export function ProductList({ products, isLoading }: ProductListProps) {
  const { addToCart } = useCart()
  const [addedProducts, setAddedProducts] = useState<{ [key: string]: boolean }>({})
  const [showAlert, setShowAlert] = useState(false)

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    setAddedProducts({ ...addedProducts, [product.id]: true })
    setShowAlert(true)
    setTimeout(() => {
      setAddedProducts({ ...addedProducts, [product.id]: false })
      setShowAlert(false)
    }, 2000)
  }

  return (
    <div>
      <AnimatePresence>
        {showAlert && <SuccessAlert message="Produto adicionado ao carrinho com sucesso!" />}
      </AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))
        ) : (
          products.map((product) => (
            <motion.div 
              key={product.id} 
              className="bg-white rounded-2xl p-6 relative shadow-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button 
                className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center z-10 hover:bg-gray-100 transition-colors"
                aria-label="Add to favorites"
              >
                <Heart size={16} className="stroke-gray-400" />
              </button>
              <div className="space-y-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="rounded-xl object-cover h-48 w-full"
                />
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.description}</p>
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
                        initial={{ rotate: 0 }}
                        transition={{ duration: 0.5 }}
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
          ))
        )}
      </div>
    </div>
  )
}