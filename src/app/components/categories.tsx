import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const categories = [
  { name: "Todos", icon: "🍽️" },
  { name: "Batatas", icon: "🥔" },
  { name: "Churrasco", icon: "🍖" },
  { name: "Bebidas", icon: "🍹" },
]

interface CategoriesProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export function Categories({ selectedCategory, setSelectedCategory }: CategoriesProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex flex-wrap sm:flex-nowrap space-x-2 sm:space-x-4 p-2 sm:p-4">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`flex flex-col items-center justify-center min-w-[80px] sm:min-w-[100px] p-2 sm:p-3 rounded-lg border transition-all duration-300 mb-2 sm:mb-0 ${
              selectedCategory === category.name
                ? "bg-orange-500 text-white border-orange-600"
                : "bg-white text-gray-800 border-gray-200 hover:bg-orange-100"
            }`}
          >
            <span className="text-2xl sm:text-3xl mb-1 sm:mb-2">{category.icon}</span>
            <span className="text-xs sm:text-sm font-medium">{category.name}</span>
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
