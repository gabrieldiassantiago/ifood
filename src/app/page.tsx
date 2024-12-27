'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { getCategories, getProducts } from './services/api'
import { Category, Product } from './types/order'
import { CategoryList } from '@/components/ui/layout/category-list'
import { ProductList } from '@/components/ui/layout/product-list'
import { BottomNav } from '@/components/ui/layout/bottom-nav'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        setProducts(productsResponse.data)
        setCategories(categoriesResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="px-4 py-6 space-y-6">
        <h1 className="text-xl font-medium text-gray-900">Olá, boa noite</h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="search"
            placeholder="Buscar aqui..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <section>
          <h2 className="text-base font-medium text-gray-900 mb-4">Categorias</h2>
          <CategoryList categories={categories} isLoading={loading} />
        </section>

        <section>
          <h2 className="text-base font-medium text-gray-900 mb-4">Os mais populares</h2>
          <ProductList products={products} isLoading={loading} />
        </section>
      </div>
      <BottomNav />
    </main>
  )
}