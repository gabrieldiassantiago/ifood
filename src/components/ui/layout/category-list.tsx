import Image from 'next/image'
import { Category } from '@/app/types/order'

interface CategoryListProps {
  categories: Category[]
  isLoading: boolean
}

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col items-center space-y-1 min-w-[64px] animate-pulse">
      <div className="relative w-16 h-16 rounded-full bg-gray-200"></div>
      <span className="text-xs text-gray-200">Loading...</span>
    </div>
  )
}

export function CategoryList({ categories, isLoading }: CategoryListProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => <SkeletonLoader key={index} />)
        : categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center space-y-1 min-w-[64px]"
            >
              <div className="relative w-16 h-16 rounded-full bg-black overflow-hidden">
                <Image
                  src={category.icon}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs text-gray-900">{category.name}</span>
            </div>
          ))}
    </div>
  )
}