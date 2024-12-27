import { Category } from '@/app/types/order'
import Image from 'next/image'

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
      {categories.map((category) => (
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

